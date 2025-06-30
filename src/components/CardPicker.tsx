'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { allCards, Card, regionRanges, specialFormRegionMapping, BoosterPack } from '@/app/Utils/Interfaces';
import { PackSelector } from './PackSelector';
import { useSound } from '@/app/Context/SoundContext';
import Achievements from './Achievements';
import { themedPacks } from '@/app/Utils/Packs';

type CardCollection = {
  [key: string]: { card: Card; count: number; isShiny: boolean };
};

interface SavedData {
  collectedCards: CardCollection;
  packsOpened: number;
}

interface CardPackOpenerProps {
  curatedPack?: BoosterPack;
}

export const CardPackOpener: React.FC<CardPackOpenerProps> = ({ curatedPack }) => {
  const { isMuted } = useSound();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [entered, setEntered] = useState<boolean[]>([]);
  const [opening, setOpening] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [isNewCard, setIsNewCard] = useState<boolean[]>([]);
  const [packsOpened, setPacksOpened] = useState(0);
  const [collectedCards, setCollectedCards] = useState<CardCollection>({});
  const [showDex, setShowDex] = useState(false);
  const [shaking, setShaking] = useState<boolean[]>([]);
  const [, setDoubleFlipped] = useState<boolean[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showWaveCards, setShowWaveCards] = useState(true);
  const [selectedPack, setSelectedPack] = useState<string>(curatedPack ? curatedPack.id : 'mystery');
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [currentRegion, setCurrentRegion] = useState<keyof typeof regionRanges | 'All'>('All');
  const [currentRarity, setCurrentRarity] = useState<'All' | Card['rarity']>('All');
  const [currentType, setCurrentType] = useState<string>('All');
  const [displayMode, setDisplayMode] = useState<'All' | 'Owned' | 'Missing'>('All');
  const slideSoundRef = useRef<HTMLAudioElement | null>(null);
  const flipSoundRef = useRef<HTMLAudioElement | null>(null);
  const mythicJingleRef = useRef<HTMLAudioElement | null>(null);
  const legendJingleRef = useRef<HTMLAudioElement | null>(null);
  const shinyJingleRef = useRef<HTMLAudioElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isShinyToggled, setIsShinyToggled] = useState(false);


  const displayedCards = Array.from(
    new Set(
      allCards
        .filter(card => {
          if (currentRegion === 'All') {
            return true;
          }
          const [start, end] = regionRanges[currentRegion] || [0, 0];
          const variantRegions = specialFormRegionMapping[card.number]?.[card.variant || ''] || [];
          return (
            (card.number >= start && card.number <= end && !card.variant) ||
            variantRegions.includes(currentRegion as string)
          );
        })
        .filter(card => currentRarity === 'All' || card.rarity === currentRarity)
        .filter(card => currentType === 'All' || card.type.includes(currentType))
        .filter(card => {
          const cardKey = `${card.name}-${card.number}${card.variant ? `-${card.variant}` : ''}`;
          if (displayMode === 'All') return true;
          if (displayMode === 'Owned') return !!collectedCards[cardKey];
          if (displayMode === 'Missing') return !collectedCards[cardKey];
          return true;
        })
        .map(card => `${card.name}-${card.number}${card.variant ? `-${card.variant}` : ''}`)
    )
  ).map(key => {
    const [, name, number, variant] = key.match(/(.+)-(\d+)(?:-(\w+))?/) || [];
    return allCards.find(c => c.name === name && c.number === parseInt(number) && (variant ? c.variant === variant : !c.variant));
  }).filter((card): card is Card => card !== undefined);

  useEffect(() => {
    if (showDex && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [showDex, selectedCard]);

  useEffect(() => {
    slideSoundRef.current = new Audio('/sounds/card-slide.mp4');
    flipSoundRef.current = new Audio('/sounds/card-flip.mp3');
    mythicJingleRef.current = new Audio('/sounds/mythic-jingle.mp3');
    legendJingleRef.current = new Audio('/sounds/legend-jingle.mp3');
    shinyJingleRef.current = new Audio('/sounds/shiny-jingle.mp3');
    slideSoundRef.current.volume = 0.5;
    flipSoundRef.current.volume = 0.5;
    mythicJingleRef.current.volume = 0.5;
    legendJingleRef.current.volume = 0.5;
    shinyJingleRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('pokemonCollection');
      if (savedData) {
        const parsed = JSON.parse(savedData) as SavedData;
        if (parsed.collectedCards && typeof parsed.packsOpened === 'number') {
          const validatedCards: CardCollection = {};
          Object.entries(parsed.collectedCards).forEach(([key, entry]) => {
            const [, name, number, variant] = key.match(/(.+)-(\d+)(?:-(\w+))?/) || [];
            const validCard = allCards.find(c =>
              c.name === name && c.number === parseInt(number) && (variant ? c.variant === variant : !c.variant)
            );
            if (validCard && typeof entry.count === 'number' && entry.count > 0) {
              validatedCards[key] = { card: validCard, count: entry.count, isShiny: entry.isShiny || false };
            }
          });
          setCollectedCards(validatedCards);
          setPacksOpened(parsed.packsOpened);
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setCollectedCards({});
      setPacksOpened(0);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(collectedCards).length > 0 || packsOpened > 0) {
      try {
        localStorage.setItem('pokemonCollection', JSON.stringify({ collectedCards, packsOpened }));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [collectedCards, packsOpened]);

  useEffect(() => {
    if (showDex && selectedCard && cardRefs.current[selectedCard]) {
      cardRefs.current[selectedCard]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showDex, selectedCard]);

  const clearStorage = () => {
    try {
      localStorage.removeItem('pokemonCollection');
      localStorage.removeItem('completedAchievements');
      setCollectedCards({});
      setPacksOpened(0);
      setCards([]);
      setFlipped([]);
      setRevealed([]);
      setIsNewCard([]);
      setShowWaveCards(true);

      console.log('Cleared localStorage');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    setShowResetModal(false);
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const getRarityIcon = (rarity: Card['rarity']) => {
    const diamondIconPath = '/diamond.png';
    const starIconPath = '/star.png';
    const crownIconPath = '/crown.png';

    const renderRepeatedImage = (src: string, count: number) => (
      <span className="inline-flex gap-0.5 items-center justify-center">
        {Array.from({ length: count }).map((_, i) => (
          <Image key={i} src={src} alt="rarity" width={16} height={16} />
        ))}
      </span>
    );

    switch (rarity) {
      case 'Common':
        return renderRepeatedImage(diamondIconPath, 1);
      case 'Uncommon':
        return renderRepeatedImage(diamondIconPath, 2);
      case 'Rare':
        return renderRepeatedImage(diamondIconPath, 3);
      case 'Epic':
        return renderRepeatedImage(diamondIconPath, 4);
      case 'Legendary':
        return <Image src={starIconPath} alt="Legendary" width={16} height={16} />;
      case 'Mythical':
        return <Image src={crownIconPath} alt="Mythical" width={16} height={16} />;
      default:
        return null;
    }
  };

  const defaultRarityWeights: Record<Card['rarity'], number> = {
    Common: 40,
    Uncommon: 25,
    Rare: 15,
    Epic: 10,
    Legendary: 7,
    Mythical: 3,
  };

  function getRandomCard(packId: string): Card & { rarity: Card['rarity']; isShiny?: boolean } {
    const pack = (curatedPack ? [curatedPack] : themedPacks).find(p => p.id === packId) || themedPacks[0];
    const pool: (Card & { rarity: Card['rarity']; isShiny?: boolean })[] = [];
    const weights = pack.weights || defaultRarityWeights;

    allCards
      .filter(pack.filter)
      .forEach(card => {
        const weight = weights[card.rarity] || 1;
        for (let i = 0; i < weight; i++) {
          const isShiny = Math.random() < 0.01;
          pool.push({ ...card, rarity: card.rarity, isShiny });
        }
      });

    if (pool.length === 0) {
      console.warn(`No cards available for pack: ${pack.name}`);
      return allCards[Math.floor(Math.random() * allCards.length)] as Card & { rarity: Card['rarity']; isShiny?: boolean };
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const openPack = () => {
    if (opening) return;
    setOpening(true);
    setShowWaveCards(false);
    setCards([]);
    setFlipped([]);
    setRevealed([]);
    setIsNewCard([]);

    setTimeout(() => {
      const newCards: (Card & { isShiny?: boolean })[] = [];
      const newCardFlags: boolean[] = [];

      for (let i = 0; i < 5; i++) {
        const card = getRandomCard(selectedPack);
        newCards.push(card);
        const key = `${card.name}-${card.number}${card.variant ? `-${card.variant}` : ''}`;
        newCardFlags.push(!collectedCards[key] || !collectedCards[key].isShiny && card.isShiny);
      }

      const updatedCollected = { ...collectedCards };
      newCards.forEach((card) => {
        const key = `${card.name}-${card.number}${card.variant ? `-${card.variant}` : ''}`;
        if (updatedCollected[key]) {
          updatedCollected[key].count += 1;
          if (card.isShiny) updatedCollected[key].isShiny = true;
        } else {
          updatedCollected[key] = { card: card, count: 1, isShiny: card.isShiny || false };
        }
      });

      setCollectedCards(updatedCollected);
      setPacksOpened(prev => prev + 1);
      setCards(newCards);
      setFlipped([true, true, true, true, true]);
      setEntered([false, false, false, false, false]);
      setRevealed([false, false, false, false, false]);
      setIsNewCard(newCardFlags);
      const newShaking = newCards.map(card => card.rarity === 'Legendary' || card.rarity === 'Mythical');
      const newDoubleFlipped = newCards.map(card => card.rarity === 'Mythical');
      setShaking(newShaking);
      setDoubleFlipped(newDoubleFlipped);

      newCards.forEach((_, index) => {
        setTimeout(() => {
          if (!isMuted && slideSoundRef.current) {
            slideSoundRef.current.currentTime = 0;
            slideSoundRef.current.play().catch(e => console.error('Error playing slide sound:', e));
          }

          setEntered(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });

          if (newShaking[index]) {
            setTimeout(() => {
              if (!isMuted && flipSoundRef.current) {
                flipSoundRef.current.currentTime = 0;
                flipSoundRef.current.play().catch(e => console.error('Error playing flip sound:', e));
              }

              setFlipped(prev => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
              });

              if (newDoubleFlipped[index]) {
                setTimeout(() => {
                  if (!isMuted && flipSoundRef.current) {
                    flipSoundRef.current.currentTime = 0;
                    flipSoundRef.current.play().catch(e => console.error('Error playing flip sound:', e));
                  }

                  setFlipped(prev => {
                    const updated = [...prev];
                    updated[index] = true;
                    return updated;
                  });

                  setTimeout(() => {
                    if (!isMuted && flipSoundRef.current) {
                      flipSoundRef.current.currentTime = 0;
                      flipSoundRef.current.play().catch(e => console.error('Error playing flip sound:', e));
                    }

                    setFlipped(prev => {
                      const updated = [...prev];
                      updated[index] = false;
                      return updated;
                    });

                    setTimeout(() => {
                      if (!isMuted && mythicJingleRef.current && newDoubleFlipped[index]) {
                        mythicJingleRef.current.currentTime = 0;
                        mythicJingleRef.current.play().catch(e => console.error('Error playing mythic jingle:', e));
                      }
                      setRevealed(prev => {
                        const updated = [...prev];
                        updated[index] = true;
                        return updated;
                      });
                    }, 200);
                  }, 400);
                }, 400);
              } else {
                setTimeout(() => {
                  if (!isMuted && legendJingleRef.current && newShaking[index]) {
                    legendJingleRef.current.currentTime = 0;
                    legendJingleRef.current.play().catch(e => console.error('Error playing legend jingle:', e));
                  }
                  setRevealed(prev => {
                    const updated = [...prev];
                    updated[index] = true;
                    return updated;
                  });
                }, 200);
              }
            }, 500);
          } else {
            setTimeout(() => {
              if (!isMuted && flipSoundRef.current) {
                flipSoundRef.current.currentTime = 0;
                flipSoundRef.current.play().catch(e => console.error('Error playing flip sound:', e));
              }

              setFlipped(prev => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
              });

              setTimeout(() => {
                setRevealed(prev => {
                  const updated = [...prev];
                  updated[index] = true;
                  return updated;
                });
                if (!isMuted && shinyJingleRef.current && newCards[index].isShiny) {
                  shinyJingleRef.current.currentTime = 0;
                  shinyJingleRef.current.play().catch(e => console.error('Error playing shiny jingle:', e));
                }
              }, 200);
            }, 600);
          }

          if (index === 4) setTimeout(() => setOpening(false), 1400);
        }, 300 * index);
      });
    }, 500);
  };

  const handleCardClick = (cardKey: string) => {
    setSelectedCard(cardKey);
    setIsShinyToggled(false)
    setShowDex(true);
  };

  const ResetConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-6" onClick={() => setShowResetModal(false)}>
      <div className="bg-[#E4F1F6] rounded-lg max-w-md w-full p-6 text-[#2A3F55] relative">
        <h3 className="text-xl font-bold mb-2 bord">WARNING</h3>
        <div className="rounded-lg inset-shadow-sm inset-shadow-[#8c9ca4] p-3">
        <p className="mb-6">Resetting your collection will delete all your collected cards and progress. This action cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <button onClick={() => setShowResetModal(false)} className="bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 active:from-gray-700 active:to-gray-900 text-white font-bold py-2 px-4 rounded-2xl cursor-pointer drop-shadow-sm/25 hover:shadow-xl border border-gray-700 flex gap-2 items-center transform transition-all duration-200 hover:scale-105 active:scale-95">Cancel</button>
          <button onClick={clearStorage} className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 active:from-red-700 active:to-red-900 text-white font-bold py-2 px-4 rounded-2xl cursor-pointer drop-shadow-sm/25 hover:shadow-xl border border-red-700 flex gap-2 items-center transform transition-all duration-200 hover:scale-105 active:scale-95">Confirm</button>
        </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 text-black">
      <h2 className="mt-10 md:mt-0 text-2xl font-bold mb-4">PokéPack Opening Simulator</h2>
      
      {!curatedPack && (
        <div className="flex gap-4 mb-4">
          <PackSelector
            selectedPack={selectedPack}
            setSelectedPack={setSelectedPack}
            themedPacks={themedPacks}
            disabled={opening}
          />
        </div>
      )}

      <div className="grid grid-cols-3 auto-cols-fr gap-2 mb-6">
        <button
  onClick={() => setShowAchievements(true)}
  className="font-bold flex gap-2 items-center cursor-pointer bg-gradient-to-br from-blue-400 to-blue-600 text-white text-md px-4 py-2 justify-center rounded-2xl shadow-md drop-shadow-sm/25 hover:from-blue-300 hover:to-blue-500 active:from-blue-500 active:to-blue-700 transition-all duration-200 focus:ring-2 focus:ring-[#8c9ca4] hover:scale-105 active:scale-95"
>
  <Image src='/icons/badge.png' alt='badge' width={20} height={20} className=''/>
  <div className='md:block hidden'>Achievements</div>
        </button>
        <button
          onClick={openPack}
          disabled={opening}
          className={`
            bg-gradient-to-br from-white to-gray-200
            hover:from-gray-100 hover:to-gray-300
            active:from-gray-300 active:to-gray-400
            text-black font-bold py-2 px-4 rounded-2xl
            cursor-pointer justify-center
            drop-shadow-sm/25 hover:shadow-xl
            border border-gray-300
            flex gap-2 items-center
            transform transition-all duration-200
            hover:scale-105 active:scale-95
            ${opening ? 'opacity-50 cursor-not-allowed inset-shadow-sm inset-shadow-[#8c9ca4]' : ''}
          `}
        >
          <Image
            src={opening ? '/icons/pack-open.png' : '/icons/pack-close.png'}
            alt={opening ? 'Pack Open' : 'Pack Close'}
            width={15}
            height={15}
            className="invert"
          />
          <div className='md:block hidden'>
          {opening ? 'Opening...' : 'Open Pack'}
          </div>
        </button>
        <button onClick={handleResetClick} 
        className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 active:from-red-700 active:to-red-900 text-white font-bold py-2 px-4 rounded-2xl cursor-pointer drop-shadow-sm/25 hover:shadow-xl border border-red-700 flex gap-2 items-center transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
            <Image src='/icons/trash.png' alt='trash' width={20} height={20} className=''/>
          <div className='md:block hidden'>
            Reset Collection
            </div>
          </button>
      </div>

      {showResetModal && <ResetConfirmationModal />}

      {showWaveCards && cards.length === 0 && (
<div className="relative w-full max-w-[90vw] h-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 perspective text-white rounded-lg inset-shadow-sm inset-shadow-[#8c9ca4] p-2 sm:p-3">
  {Array.from({ length: 5 }).map((_, idx) => (
    <motion.div
      key={`wave-card-${idx}`}
      className="w-[35vw] sm:w-[25vw] md:w-[16vw] aspect-[5/7] relative max-w-[200px] min-w-[100px]"
              animate={{
                y: [0, -10, 10, 0],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: idx * 0.2,
                  ease: 'easeInOut',
                },
              }}
            >
              <div className="absolute w-full h-full backface-hidden">
                <Image
                  src="/cardback.png"
                  alt="Card Back"
                  fill
                  className="rounded-xl border-2 border-gray-600"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

<div className={`${showWaveCards && cards.length === 0 ? 'hidden' : 'relative'} w-full max-w-[90vw] h-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 perspective text-white rounded-lg inset-shadow-sm inset-shadow-[#8c9ca4] p-2 sm:p-3`}>
          {cards.map((card, idx) => {
          const imagePath = card.variant ? `${card.isShiny ? '/shiny' : '/home-icons'}/${card.number}-${card.variant}.png` : `${card.isShiny ? '/shiny' : '/home-icons'}/${card.number}.png`;
          const cardKey = `${card.name}-${card.number}${card.variant ? `-${card.variant}` : ''}`;
          const isArceus = card.name === 'Arceus' || card.name.startsWith('Arceus (');
          const isSilvally = card.name === 'Silvally' || card.name.startsWith('Silvally (') || card.name === 'Type: Null';
          const isMega = card.variant === 'Mega' || card.variant?.startsWith('Mega');
          const isPrimal = card.name.startsWith('Primal ');
          const isGMax = card.variant === 'GMax' || card.variant?.startsWith('GMax');
          const isUltraBeast = (card.number >= 793 && card.number <= 799) || (card.number >= 803 && card.number <= 806);
          return (
            <motion.div
              key={`card-${idx}-${cardKey}`}
className="w-[35vw] sm:w-[25vw] md:w-[16vw] aspect-[5/7] relative max-w-[200px] min-w-[100px]"              initial={{ y: 100, opacity: 0 }}
              animate={{ y: entered[idx] ? 0 : 100, opacity: entered[idx] ? 1 : 0, rotate: shaking[idx] && !revealed[idx] ? [0, -5, 5, -5, 5, 0] : 0 }}
              transition={{ duration: shaking[idx] && !revealed[idx] ? 0.5 : 0.5, delay: idx * 0.1 }}
              style={{ zIndex: 2 }}
            >
              <motion.div
                initial={true}
                animate={{ rotateY: flipped[idx] ? 0 : 180 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 w-full h-full transform-style-preserve-3d"
              >
                <div className="absolute w-full h-full backface-hidden ">
                  <Image src="/cardback.png" alt="Card Back" fill className="rounded-xl border-2 border-gray-600" />
                </div>

                <div
                  className={`absolute  w-full h-full rotateY-180 backface-hidden p-1.5 rounded-xl flex flex-col items-center justify-between text-center shadow-xl/30 ${card.isShiny ? "bg-white" : getTypeBorderClass(card.rarity)} ${card.rarity === 'Mythical' && revealed[idx] && !card.isShiny ? 'glow-mythical' : card.isShiny ? 'glow-shiny twinkle-shiny' : ''} ${revealed[idx] ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                  onClick={() => revealed[idx] && handleCardClick(cardKey)}
                >
                  <div
                    className='w-full h-full rounded-lg flex flex-col items-center justify-between text-center p-2'
                    style={{
                      background: getGradientBackground(card.type),
                      ...(card.isShiny && revealed[idx]
                        ? {
                            backgroundImage: 'url(/rainbow-gradient.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundBlendMode: 'overlay',
                            backgroundRepeat: 'no-repeat',
                          }
                        : {}),
                    }}
                  >
                    {card.isShiny && revealed[idx] && (
                      <>
                        <span className="star1"></span>
                        <span className="star2"></span>
                        <span className="star3"></span>
                        <span className="star4"></span>
                        <span className="star5"></span>
                      </>
                    )}
                    {revealed[idx] && (
                      <>
                        {isNewCard[idx] && (
                          <div className="absolute top-3 left-3 bg-white text-slate-400 border-slate-400 text-xs font-bold px-2 py-1 z-30 rounded-full drop-shadow-sm/25">
                            NEW
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex gap-1 z-30">
                          {card.type.map((t, idx) => (
                            <Image key={idx} src={`/icons/types/${t}.png`} alt={`${t} icon`} width={20} height={20} />
                          ))}
                        </div>
                        <div className='flex justify-center items-center w-[80%] h-[80%] p-2 relative'>
                          {isArceus && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.5 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="absolute inset-0 flex justify-center items-center z-10"
                            >
                              <Image
                                src="/icons/arceus-symbol.png"
                                alt="Arceus Symbol"
                                width={180}
                                height={180}
                                className="object-contain invert opacity-80 contrast-125"
                              />
                            </motion.div>
                          )}
                          {isSilvally && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.5 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="absolute inset-0 flex justify-center items-center z-10"
                            >
                              <Image
                                src="/icons/aether.png"
                                alt="Null Symbol"
                                width={180}
                                height={180}
                                className="object-contain invert opacity-80 contrast-125"
                              />
                            </motion.div>
                          )}
                          {isPrimal && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.5 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="absolute inset-0 flex justify-center items-center z-10"
                            >
                              <Image
                                src={`/icons/${card.number === 382 ? 'blue' : 'red'}-orb.png`}
                                alt={`orb`}
                                width={160}
                                height={160}
                                className="object-contain opacity-80"
                              />
                            </motion.div>
                          )}
                          {isMega && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.5 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="absolute inset-0 flex justify-center items-center z-10"
                            >
                              <Image
                                src="/icons/mega-evolution.png"
                                alt="Mega Evolution Symbol"
                                width={160}
                                height={160}
                                className="object-contain opacity-80"
                              />
                            </motion.div>
                          )}
                          {isGMax && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.5 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="absolute inset-0 flex justify-center items-center z-10"
                            >
                              <Image
                                src="/icons/gigantamax.png"
                                alt="Gigantamax Symbol"
                                width={180}
                                height={180}
                                className="object-contain opacity-80"
                              />
                            </motion.div>
                          )}
                          {isUltraBeast && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.5 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="absolute inset-0 flex justify-center items-center z-10"
                            >
                              <Image
                                src="/icons/ultra-wormhole.png"
                                alt="Ultra-Wormhole"
                                width={200}
                                height={200}
                                className="object-contain opacity-90"
                              />
                            </motion.div>
                          )}
                          <Image
  src={imagePath}
  alt={card.name}
  fill
  className="mb-1 w-[80%] h-[80%] mx-auto rounded-t-lg relative z-20 drop-shadow-xl/25 object-contain"
/>
                        </div>
                        <p className={`${card.artist ? 'relative' : 'hidden'} text-sm italic z-20`}>Art by: {card.artist}</p>
                        <div className={card.isShiny ? 'text-black' : 'text-white'}>
                          <div className="font-bold text-sm md:text-md text-center">{card.isShiny ? `${card.name} ✦` : card.name}</div>
                          <div className={`flex justify-center pt-1 ${card.rarity === 'Mythical' ? 'text-[#ffd700] text-shadow-white' : card.isShiny ? 'text-black' : 'text-white'}`}>
                            {getRarityIcon(card.rarity)}
                          </div>
                          <div className="text-xs md:text-sm italic">{card.move}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-6 items-center">
        <div className="text-lg font-semibold">Packs Opened: {packsOpened}</div>
        <button
          onClick={() => { setSelectedCard(null); setShowDex(true); }}
          className="bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 active:from-gray-300 active:to-gray-400 text-black font-bold py-2 px-4 rounded-2xl cursor-pointer drop-shadow-sm/25 hover:shadow-xl border border-gray-300 flex gap-2 items-center transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Image src='/dex.png' alt='dex' width={20} height={20} className='invert'/>
          View Card Dex
        </button>

      </div>
 <AnimatePresence>
      {showDex && (
         <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-6"
                  onClick={(e) => {
                    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
                      setShowDex(false);
                    }
                  }}
                >
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-6"
          onClick={(e) => {
            if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
              setShowDex(false);
              setIsFiltersOpen(false);
              setSelectedCard(null);
            }
          }}
        >
<div ref={modalContentRef} className="bg-[#E4F1F6] rounded-lg w-full max-w-[95vw] sm:max-w-3xl p-4 sm:p-6 text-[#2A3F55] relative overflow-y-auto max-h-[90vh]">
              <button
              onClick={() => { setShowDex(false); setIsFiltersOpen(false); setSelectedCard(null); }}
              className="absolute top-2 right-4 text-[#2A3F55] hover:opacity-80 text-3xl cursor-pointer"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4">Card Dex</h3>
            <p className="mb-4">You&apos;ve collected {Object.keys(collectedCards).length} out of {allCards.length} cards.</p>
        {selectedCard && collectedCards[selectedCard] && (() => {
        return (
          <div className="flex gap-2 mb-6 p-4 rounded-lg inset-shadow-sm inset-shadow-[#8c9ca4]">
            <div className="w-32 h-32 relative">
              <motion.div
                key={isShinyToggled ? 'shiny' : 'regular'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <Image
                  src={
                    collectedCards[selectedCard].card.variant
                      ? `${isShinyToggled ? '/shiny' : '/home-icons'}/${collectedCards[selectedCard].card.number}-${collectedCards[selectedCard].card.variant}.png`
                      : `${isShinyToggled ? '/shiny' : '/home-icons'}/${collectedCards[selectedCard].card.number}.png`
                  }
                  alt={`${collectedCards[selectedCard].card.name}${isShinyToggled ? ' (Shiny)' : ''}`}
                  fill
                  className="object-contain relative z-20 drop-shadow-lg/50"
                />
              </motion.div>
            </div>
            <div>
                <button
                  onClick={() => setIsShinyToggled(!isShinyToggled)}
                  className={`bg-gradient-to-br from-white to-gray-200 p-2 rounded-full shadow-md hover:drop-shadow-sm/25 transform transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-[#8c9ca4] focus:outline-none ${!collectedCards[selectedCard].isShiny ? 'opacity-50 cursor-not-allowed inset-shadow-sm inset-shadow-[#8c9ca4]' : 'cursor-pointer'}`}
                  aria-label={isShinyToggled ? 'Switch to regular form' : 'Switch to shiny form'}
                  title={isShinyToggled ? 'Show regular form' : 'Show shiny form'}
                  disabled={!selectedCard || !collectedCards[selectedCard] || !collectedCards[selectedCard].isShiny}
                >
                  <Image
                    src={`/icons/Shiny${isShinyToggled ? 'Active' : ''}.png`}
                    alt="Toggle shiny form"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </button>

            </div>
            <div className="pt-1">
              <h4 className="text-xl font-bold">
                {collectedCards[selectedCard].isShiny
                ? `${collectedCards[selectedCard].card.name} ✦`
                : collectedCards[selectedCard].card.name}
              </h4>
              <p className="text-sm italic mb-1">{collectedCards[selectedCard].card.move}</p>
              <p className="flex items-center gap-1 text-sm font-semibold">
                Rarity: {getRarityIcon(collectedCards[selectedCard].card.rarity)} {collectedCards[selectedCard].card.rarity}
              </p>
              <div className="text-sm flex items-center gap-1">
                Type:
                {collectedCards[selectedCard].card.type.map((t, idx) => (
                  <Image key={idx} src={`/icons/types/${t}.png`} alt={`${t} icon`} width={20} height={20} />
                ))}
              </div>
              <p className="text-sm">Owned: {collectedCards[selectedCard].count}</p>
            </div>
          </div>
        );
      })()}
      <div className="mb-4">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`cursor-pointer w-full flex justify-between items-center bg-gradient-to-br from-white to-gray-200 text-[#2A3F55] font-semibold text-md px-4 py-2 rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-[#8c9ca4] focus:outline-none transition-all duration-200 ${isFiltersOpen ?'opacity-50 inset-shadow-sm inset-shadow-[#8c9ca4]' : ''}`}
          aria-expanded={isFiltersOpen}
          aria-controls="filter-controls"
          aria-label={isFiltersOpen ? 'Collapse filters' : 'Expand filters'}
        >
          <span>Filters</span>
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isFiltersOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              id="filter-controls"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.445, 0.05, 0.55, 0.95] }}
              className="overflow-hidden mt-2"
            >
              <div className="grid gap-2 p-4 rounded-lg bg-[#DDE8ED] inset-shadow-sm inset-shadow-[#8c9ca4]">
                                        <div>
                          <p className="font-semibold text-md mb-2">Display Mode:</p>
                          <div className="flex gap-2 mb-4 flex-wrap">
                            {(['All', 'Owned', 'Missing'] as const).map(mode => (
                              <button
                                key={mode}
                                onClick={() => setDisplayMode(mode)}
                                className={`cursor-pointer px-3 py-1 rounded-lg transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:drop-shadow-sm/25 ${
                                  displayMode === mode
                                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 active:from-blue-500 active:to-blue-700 text-white border border-blue-500 inset-shadow-xs inset-shadow-blue-700'
                                    : 'bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 active:from-gray-300 active:to-gray-400'
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </div>
                <div>
                  <p className="font-semibold text-md mb-2">Regions:</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {['All', ...Object.keys(regionRanges)].map(region => (
                      <button
                        key={region}
                        onClick={() => setCurrentRegion(region as keyof typeof regionRanges)}
                        className={`cursor-pointer px-3 py-1 rounded-lg transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:drop-shadow-sm/25 ${
                          currentRegion === region
                            ? 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 active:from-blue-500 active:to-blue-700 text-white border border-blue-500 inset-shadow-xs inset-shadow-blue-700'
                            : 'bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 active:from-gray-300 active:to-gray-400'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-md mb-2">Rarity:</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {(['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'] as const).map(rarity => (
                      <button
                        key={rarity}
                        onClick={() => setCurrentRarity(rarity)}
                        className={`cursor-pointer px-3 py-1 rounded-lg transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:drop-shadow-sm/25 ${
                          currentRarity === rarity
                            ? 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 active:from-blue-500 active:to-blue-700 text-white border border-blue-500 inset-shadow-xs inset-shadow-blue-700'
                            : 'bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 active:from-gray-300 active:to-gray-400'
                        }`}
                      >
                        {rarity}
                      </button>
                    ))}
                  </div>
                </div>
                  <div>
                  <p className="font-semibold text-md mb-2">Type:</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {(['All', 'Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy', 'Stellar'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setCurrentType(type)}
                        className={`cursor-pointer px-3 py-1 rounded-lg transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:drop-shadow-sm/25 ${
                          currentType === type
                            ? 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 active:from-blue-500 active:to-blue-700 text-white border border-blue-500 inset-shadow-xs inset-shadow-blue-700'
                            : 'bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 active:from-gray-300 active:to-gray-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
            {displayedCards.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">No cards available for this region or rarity yet.</p>
            ) : (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 rounded-lg inset-shadow-sm inset-shadow-[#8c9ca4] p-2 sm:p-3">
                  {displayedCards.map(card => {
                  const cardKey = `${card.name}-${card.number}${card.variant ? `-${card.variant}` : ''}`;
                  const owned = collectedCards[cardKey];
                  const imagePath = card.variant ? `/home-icons/${card.number}-${card.variant}.png` : `/home-icons/${card.number}.png`;
                  return (
                    <div onClick={() => handleCardClick(cardKey)} key={cardKey} className="flex flex-col items-center cursor-pointer">
                      <div className="w-20 h-20 relative mb-2">
                        <Image
                          src={imagePath}
                          alt={card.name}
                          fill
                          className={`object-contain ${!owned ? 'brightness-0 opacity-50' : ''}`}
                        />
                      </div>
                      <div className="font-semibold text-md text-center">
                        {owned && collectedCards[cardKey].isShiny ? `${card.name} ✦` : card.name}
                      </div>
                      <div className={`${card.rarity === 'Mythical' ? 'text-[#ffd700]' : 'text-white'}`}>
                        {getRarityIcon(card.rarity)}
                      </div>
                      <div className="text-xs">{owned ? `Owned: ${owned.count}` : 'Missing'}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        </motion.div>
      )}
       </AnimatePresence>
      <Achievements
  showAchievements={showAchievements}
  setShowAchievements={setShowAchievements}
  collectedCards={collectedCards}
/>
    </div>
  );
};

function getGradientBackground(types: string[]) {
  const typeColors: Record<string, string> = {
    Normal: '#c1c2c1',
    Fighting: '#ffac58',
    Flying: '#acd2f4',
    Poison: '#b885dc',
    Ground: '#b98e6e',
    Rock: '#cac6ae',
    Bug: '#b8c36b',
    Ghost: '#a384a2',
    Steel: '#98c2d2',
    Fire: '#ee7375',
    Water: '#74acf6',
    Grass: '#82c375',
    Electric: '#fdd75a',
    Psychic: '#f584a8',
    Ice: '#81dff7',
    Dragon: '#8f99ec',
    Dark: '#9b8a8c',
    Fairy: '#f4a3f5',
    Stellar: '#83cfc6',
  };

  const color1 = typeColors[types[0]] || '#ffffff';
  const color2 = types[1] ? typeColors[types[1]] : color1;

  return `linear-gradient(to bottom right, ${color1}, ${color2})`;
}

function getTypeBorderClass(rarity: Card['rarity']) {
  const rarityBorderColors: Record<Card['rarity'], string> = {
    Common: 'bg-[#FFFFFF]',
    Uncommon: 'bg-[#989fa0]',
    Rare: 'shiny-chrome',
    Epic: 'bg-[#FFCB05]',
    Legendary: 'shiny-gold',
    Mythical: 'shiny-mythic',
  };

  return rarityBorderColors[rarity];
}