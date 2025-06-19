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

export default function Achievements({ showAchievements, setShowAchievements, collectedCards }: AchievementsProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
const [prevCompleted, setPrevCompleted] = useState<Set<string>>(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('completedAchievements');
    return new Set(saved ? JSON.parse(saved) : []);
  }
  return new Set();
});
  const getProgress = (achievement: Achievement) => {
    if (achievement.requiredCards) {
      const completed = achievement.requiredCards.filter(req => {
        const fullKey = `${req.cardKey}${req.variant ? `-${req.variant}` : ''}`;
        const card = collectedCards[fullKey];
        if (!card) return false;
        const shinyMatches = req.isShiny === undefined || card.isShiny === req.isShiny;
        const countMatches = (card.count || 0) >= (req.minCount || 1);
        return shinyMatches && countMatches;
      }).length;
      return { completed, total: achievement.requiredCards.length };
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
      return achievement.requiredCards.slice(0, 3).map(req => {
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
              <div className="space-y-4">
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
                      className={`p-4 rounded-lg inset-shadow-sm inset-shadow-[#8c9ca4] ${
                        isComplete ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-[#DDE8ED]'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 relative flex-shrink-0">
                          <Image
                            src={`/badges/${achievement.id}.png`}
                            alt={`${achievement.name} Badge`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-bold">{achievement.name}</h4>
                            <span className="text-sm font-semibold">
                              {completed}/{total} {isComplete ? '✓' : ''}
                            </span>
                          </div>
                          <p className="text-sm">{achievement.description}</p>
                        </div>
                      </div>
                      {representativeCards.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
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
                                  {isShiny ? ' ✦' : ''}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
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