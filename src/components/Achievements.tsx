import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { allCards, Card, specialFormRegionMapping } from '@/app/Utils/Interfaces';
import { achievements } from '@/app/Utils/Achievement';

const regionRanges: Record<string, [number, number]> = {
  Kanto: [1, 151],
  Johto: [152, 251],
  Hoenn: [252, 386],
  Sinnoh: [387, 493],
  Unova: [494, 649],
  Kalos: [650, 721],
  Alola: [722, 809],
  Galar: [810, 905],
  Paldea: [906, 1025],
};

interface CollectedCard {
  card: Card;
  count: number;
  isShiny: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  showIcons: boolean;
  requiredCards?: Array<{
    cardKey: string;
    cardKeyBase?: string;
    variant?: string;
    isShiny?: boolean;
    minCount?: number;
  }>;
  collectionGoal?: {
    property: 'type' | 'rarity' | 'isShiny' | 'region';
    value?: string;
    targetCount: number;
  };
}

interface AchievementsProps {
  showAchievements: boolean;
  setShowAchievements: (show: boolean) => void;
  collectedCards: Record<string, CollectedCard>;
}

interface Toast {
  id: string;
  name: string;
}

interface PopupState {
  visible: boolean;
  achievementId: string | null;
  position: { x: number; y: number };
}

export default function Achievements({ showAchievements, setShowAchievements, collectedCards }: AchievementsProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [popup, setPopup] = useState<PopupState>({ visible: false, achievementId: null, position: { x: 0, y: 0 } });
  const [prevCompleted, setPrevCompleted] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completedAchievements');
      return new Set(saved ? JSON.parse(saved) : []);
    }
    return new Set();
  });

  const getProgress = (achievement: Achievement) => {
    if (achievement.requiredCards) {
      let completed = 0;
      const groupedRequirements: Record<string, { minCount: number; cardKeys: string[] }> = {};

      achievement.requiredCards.forEach(req => {
        const key = req.cardKeyBase || req.cardKey;
        if (!groupedRequirements[key]) {
          groupedRequirements[key] = { minCount: req.minCount || 1, cardKeys: [] };
        }
        groupedRequirements[key].cardKeys.push(`${req.cardKey}${req.variant ? `-${req.variant}` : ''}`);
        groupedRequirements[key].minCount = Math.max(groupedRequirements[key].minCount, req.minCount || 1);
      });

      for (const key in groupedRequirements) {
        const { minCount, cardKeys } = groupedRequirements[key];
        let totalCount = 0;

        cardKeys.forEach(fullKey => {
          const card = collectedCards[fullKey];
          if (card) {
            const req = achievement.requiredCards!.find(r => `${r.cardKey}${r.variant ? `-${r.variant}` : ''}` === fullKey);
            const shinyMatches = !req?.isShiny || card.isShiny === req.isShiny;
            if (shinyMatches) {
              totalCount += card.count || 0;
            }
          }
        });

        if (totalCount >= minCount) {
          completed += 1;
        }
      }

      return { completed, total: Object.keys(groupedRequirements).length };
    } else if (achievement.collectionGoal) {
      const { property, value, targetCount } = achievement.collectionGoal;
      let completed = 0;
      Object.values(collectedCards).forEach(card => {
        if (property === 'type' && value && card.card.type.includes(value)) {
          completed += card.count;
        } else if (property === 'rarity' && value && card.card.rarity === value) {
          completed += card.count;
        } else if (property === 'isShiny' && card.isShiny) {
          completed += card.count;
        } else if (property === 'region' && value) {
          const [start, end] = regionRanges[value] || [0, 0];
          const variantRegions = specialFormRegionMapping[card.card.number]?.[card.card.variant || ''] || [];
          if (
            (card.card.number >= start && card.card.number <= end && !card.card.variant) ||
            variantRegions.includes(value)
          ) {
            completed += card.count;
          }
        }
      });
      return { completed: Math.min(completed, targetCount), total: targetCount };
    }
    return { completed: 0, total: 0 };
  };

  const getRepresentativeCards = (achievement: Achievement) => {
    if (!achievement.showIcons) {
      return [];
    }
    if (achievement.requiredCards) {
      return achievement.requiredCards.map(req => {
        const fullKey = `${req.cardKey}${req.variant ? `-${req.variant}` : ''}`;
        const card = collectedCards[fullKey];
        const cardData = card?.card || allCards.find(c => {
          const [name, number] = req.cardKey.split('-');
          return c.name === name && c.number === parseInt(number) && (req.variant ? c.variant === req.variant : !c.variant);
        });
        return { fullKey, card, cardData, isShiny: req.isShiny };
      });
    }
    return [];
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent, achievement: Achievement) => {
    if (!achievement.showIcons) return;
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopup({
      visible: true,
      achievementId: achievement.id,
      position: {
        x: rect.left,
        y: rect.top + rect.height + 8, // Add small gap below the box
      },
    });
  };

  const handleInteractionEnd = () => {
    setPopup({ visible: false, achievementId: null, position: { x: 0, y: 0 } });
  };

  useEffect(() => {
    const currentCompleted = new Set<string>();
    const newToasts: Toast[] = [];

    achievements.forEach(achievement => {
      const { completed, total } = getProgress(achievement);
      if (completed >= total) {
        currentCompleted.add(achievement.id);
        if (!prevCompleted.has(achievement.id)) {
          newToasts.push({ id: achievement.id, name: achievement.name });
        }
      }
    });

    if (newToasts.length > 0) {
      setToasts(prev => [...prev, ...newToasts]);
      setPrevCompleted(currentCompleted);
      if (typeof window !== 'undefined') {
        localStorage.setItem('completedAchievements', JSON.stringify(Array.from(currentCompleted)));
      }
    }

    if (newToasts.length > 0) {
      const timers = newToasts.map(toast =>
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, 3000)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [collectedCards]);

  return (
    <div className="relative">
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-6"
            onClick={(e) => {
              if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
                setShowAchievements(false);
              }
            }}
          >
            <motion.div
              ref={modalContentRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.445, 0.05, 0.55, 0.95] }}
              className="bg-[#E4F1F6] rounded-lg max-w-3xl w-full p-6 text-[#2A3F55] relative overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setShowAchievements(false)}
                className="absolute top-2 right-4 text-[#2A3F55] hover:opacity-80 text-3xl cursor-pointer"
                aria-label="Close Achievements"
              >
                ✖
              </button>
              <h3 className="text-2xl font-bold mb-4">Achievements</h3>
              <p className="mb-4">
                Completed {achievements.filter(a => {
                  const { completed, total } = getProgress(a);
                  return completed >= total;
                }).length} of {achievements.length} achievements.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {achievements.map(achievement => {
                  const { completed, total } = getProgress(achievement);
                  const isComplete = completed >= total;
                  const representativeCards = getRepresentativeCards(achievement);
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * achievements.indexOf(achievement) }}
                      className={`p-4 flex flex-col justify-between rounded-lg inset-shadow-sm inset-shadow-[#8c9ca4] ${
                        isComplete ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-[#DDE8ED]'
                      }`}
                      onMouseEnter={(e) => handleInteraction(e, achievement)}
                      onMouseLeave={handleInteractionEnd}
                      onTouchStart={(e) => handleInteraction(e, achievement)}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <Image
                            src={`/badges/${achievement.id}.png`}
                            alt={`${achievement.name} Badge`}
                            fill
                            className={`object-contain ${!isComplete ? 'brightness-0 opacity-50' : ''}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="text-md font-bold">{achievement.name}</h4>
                            <span className="text-sm font-semibold">
                              {completed}/{total} {isComplete ? '✓' : ''}
                            </span>
                          </div>
                          <p className="text-sm">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 bg-black/25 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((completed / total) * 100, 100)}%` }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {popup.visible && popup.achievementId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bg-[#E4F1F6] text-[#2A3F55] rounded-lg shadow-lg p-4 z-60 w-auto"
            style={{ top: popup.position.y, left: popup.position.x }}
          >
            {(() => {
              const achievement = achievements.find(a => a.id === popup.achievementId);
              if (!achievement || !achievement.showIcons) return null;
              const representativeCards = getRepresentativeCards(achievement);
              return (
                <div className={`grid ${representativeCards.length < 10 ? 'grid-cols-3' : representativeCards.length === 10 ? 'grid-cols-5' : 'grid-cols-10'} gap-2`}>
                  {representativeCards.map(({ fullKey, card, cardData, isShiny }) => {
                    const isOwned = card && (isShiny === undefined || card.isShiny === isShiny) && card.count >= 1;
                    return (
                      <div key={fullKey} className="flex flex-col items-center">
                        <div className="w-12 h-12 relative">
                          <Image
                            src={
                              cardData
                                ? `${isOwned && (isShiny || card?.isShiny) ? '/shiny' : '/home-icons'}/${cardData.number}${cardData.variant ? `-${cardData.variant}` : ''}.png`
                                : '/home-icons/placeholder.png'
                            }
                            alt={cardData?.name || 'Unknown'}
                            fill
                            className={`object-contain ${!isOwned ? 'brightness-0 opacity-50' : ''}`}
                          />
                        </div>
                        <span className="text-xs text-center">
                          {cardData?.name || 'Unknown'}
                          {isShiny ? ' ✦' : ''} ({card?.count || 0})
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed top-4 right-4 z-60 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="bg-[#E4F1F6] text-[#2A3F55] p-4 rounded-lg shadow-lg max-w-sm w-full flex items-center gap-3"
              role="alert"
            >
              <div className="w-6 h-6 relative flex-shrink-0">
                <Image
                  src={`/badges/${toast.id}.png`}
                  alt={`${toast.name} Badge`}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-semibold">Achievement Unlocked: {toast.name}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}