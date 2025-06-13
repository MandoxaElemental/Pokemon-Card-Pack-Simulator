'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { allCards, Card, regionRanges } from '@/app/Utils/Interfaces';

type CardCollection = {
  [key: string]: { card: Card; count: number };
};

interface SavedData {
  collectedCards: CardCollection;
  packsOpened: number;
}

export const CardPackOpener: React.FC = () => {
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
  const [isMuted, setIsMuted] = useState(false); // New state for mute toggle
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [currentRegion, setCurrentRegion] = useState<keyof typeof regionRanges>('All');
  const slideSoundRef = useRef<HTMLAudioElement | null>(null); // Ref for slide sound
  const flipSoundRef = useRef<HTMLAudioElement | null>(null); // Ref for flip sound
  const displayedCards = allCards.filter(card => {
    const [start, end] = regionRanges[currentRegion] || [NaN, NaN];
    return card.number >= start && card.number <= end;
  });

  // Preload sound effects
  useEffect(() => {
    slideSoundRef.current = new Audio('/sounds/card-slide.mp3');
    flipSoundRef.current = new Audio('/sounds/card-flip.mp3');
    slideSoundRef.current.volume = 0.5; // Adjust volume (0 to 1)
    flipSoundRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('pokemonCollection');
      if (savedData) {
        const parsed = JSON.parse(savedData) as SavedData;
        if (parsed.collectedCards && typeof parsed.packsOpened === 'number') {
          const validatedCards: CardCollection = {};
          Object.entries(parsed.collectedCards as CardCollection).forEach(
            ([name, entry]: [string, { card: Card; count: number }]) => {
              const validCard = allCards.find(c => c.name === name);
              if (validCard && typeof entry.count === 'number' && entry.count > 0) {
                validatedCards[name] = { card: validCard, count: entry.count };
              }
            }
          );
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
        localStorage.setItem(
          'pokemonCollection',
          JSON.stringify({ collectedCards, packsOpened })
        );
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
      setCollectedCards({});
      setPacksOpened(0);
      setCards([]);
      setFlipped([]);
      setRevealed([]);
      setIsNewCard([]);
      console.log('Cleared localStorage');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    setShowResetModal(false);
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const getRarityIcon = (rarity: Card['rarity']) => {
    switch (rarity) {
      case 'Common': return '♦';
      case 'Uncommon': return '♦♦';
      case 'Rare': return '♦♦♦';
      case 'Epic': return '♦♦♦♦';
      case 'Legendary': return '★';
      case 'Mythical': return '♛';
      default: return '';
    }
  };

  const rarityWeights: Record<Card['rarity'], number> = {
    Common: 40,
    Uncommon: 25,
    Rare: 15,
    Epic: 10,
    Legendary: 7,
    Mythical: 3,
  };

  function getRandomCard(): Card {
    const pool: Card[] = [];
    allCards.forEach(card => {
      const weight = rarityWeights[card.rarity];
      for (let i = 0; i < weight; i++) pool.push(card);
    });
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const openPack = () => {
    if (opening) return;
    setOpening(true);
    setCards([]);
    setFlipped([]);
    setRevealed([]);
    setIsNewCard([]);

    setTimeout(() => {
      const newCards: Card[] = [];
      const newCardFlags: boolean[] = [];

      for (let i = 0; i < 5; i++) {
        const card = getRandomCard();
        newCards.push(card);
        newCardFlags.push(!collectedCards[card.name]);
      }

      const updatedCollected = { ...collectedCards };
      newCards.forEach((card) => {
        if (updatedCollected[card.name]) {
          updatedCollected[card.name].count += 1;
        } else {
          updatedCollected[card.name] = { card, count: 1 };
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
          // Play slide sound when card enters
          if (!isMuted && slideSoundRef.current) {
            slideSoundRef.current.currentTime = 0; // Reset sound
            slideSoundRef.current.play().catch(e => console.error('Error playing slide sound:', e));
          }

          setEntered(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });

          if (newShaking[index]) {
            setTimeout(() => {
              // Play flip sound when card flips
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
                  // Play flip sound for Mythical double flip
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
                    // Play flip sound for second Mythical flip
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
                    }, 200);
                  }, 400);
                }, 400);
              } else {
                setTimeout(() => {
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
              // Play flip sound for non-shaking cards
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
              }, 200);
            }, 600);
          }

          if (index === 4) setTimeout(() => setOpening(false), 1400);
        }, 300 * index);
      });
    }, 500);
  };

  const handleCardClick = (cardName: string) => {
    setSelectedCard(cardName);
    setShowDex(true);
  };

  const ResetConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-6">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 text-white relative">
        <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
        <p className="mb-6">Resetting your collection will delete all your collected cards and progress. This action cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowResetModal(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={clearStorage}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Pokemon Card Pack Opening Simulator</h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={openPack}
          disabled={opening}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          {opening ? 'Opening...' : 'Open Pack'}
        </button>
        <button
          onClick={handleResetClick}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Reset Collection
        </button>
        <button
          onClick={toggleMute}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer flex items-center gap-1"
        >
          <Image
            src={isMuted ? '/icons/mute.svg' : '/icons/unmute.svg'}
            alt={isMuted ? 'Muted' : 'Unmuted'}
            width={20}
            height={20}
            className="invert"
          />
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>

      {showResetModal && <ResetConfirmationModal />}

      <div className="relative w-full h-74 grid grid-cols-5 gap-4 perspective">
        {cards.map((card, idx) => (
          <motion.div
            key={`card-${idx}`}
            className="w-54 h-74 relative"
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: entered[idx] ? 0 : 100,
              opacity: entered[idx] ? 1 : 0,
              rotate: shaking[idx] && !revealed[idx] ? [0, -5, 5, -5, 5, 0] : 0,
            }}
            transition={{
              duration: shaking[idx] && !revealed[idx] ? 0.5 : 0.5,
              delay: idx * 0.1,
            }}
            style={{ zIndex: 2 }}
          >
            <motion.div
              initial={true}
              animate={{ rotateY: flipped[idx] ? 0 : 180 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full transform-style-preserve-3d"
            >
              <div className="absolute w-full h-full backface-hidden">
                <Image
                  src="/cardback.png"
                  alt="Card Back"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl border-2 border-gray-600"
                />
              </div>

              <div
                style={{ background: getGradientBackground(card.type) }}
                className={`absolute w-full h-full rotateY-180 backface-hidden p-2 rounded-xl border-5 flex flex-col items-center justify-between text-center shadow-lg ${getTypeBorderClass(card.rarity)} ${card.rarity === 'Mythical' && revealed[idx] ? 'glow-mythical' : ''} ${isNewCard[idx] && revealed[idx] ? 'glow-new' : ''} ${revealed[idx] ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                onClick={() => revealed[idx] && handleCardClick(card.name)}
              >
                {revealed[idx] && (
                  <>
                    {isNewCard[idx] && (
                      <div className="absolute top-1 left-1 bg-white text-slate-400 border-slate-400 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        NEW
                      </div>
                    )}
                    <div className="absolute top-1 right-1 flex gap-1">
                      {card.type.map((t, idx) => (
                        <Image
                          key={idx}
                          src={`/icons/types/${t}.png`}
                          alt={`${t} icon`}
                          width={20}
                          height={20}
                        />
                      ))}
                    </div>
                    <div className='flex justify-center items-center w-48 h-48 p-2'>
                      <Image
                        src={`/sprites/sprites/pokemon/other/home/${card.number}.png`}
                        alt={card.name}
                        width={200}
                        height={200}
                        className="mb-2 w-full h-full rounded-t-lg"
                      />
                    </div>
                    <div>
                      <div className="font-bold">{card.name}</div>
                      <div className={`text-sm opacity-80 mb-1 ${card.rarity === 'Mythical' ? 'text-[#ffd700] text-shadow-white' : 'text-white'}`}>{getRarityIcon(card.rarity)}</div>
                      <div className="text-xs italic mt-1">{card.move}</div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-4 mt-6 items-center">
        <div className="text-lg font-semibold">📦 Packs Opened: {packsOpened}</div>
        <button
          onClick={() => {
            setSelectedCard(null);
            setShowDex(true);
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-3 rounded cursor-pointer"
        >
          📖 View Card Dex
        </button>
      </div>

      {showDex && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-6">
          <div className="bg-gray-900 rounded-lg max-w-3xl w-full p-6 text-white relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setShowDex(false);
                setSelectedCard(null);
              }}
              className="absolute top-2 right-4 text-gray-300 hover:text-white text-xl cursor-pointer"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4">📖 Card Dex</h3>
            <p className="mb-4">You&apos;ve collected {Object.keys(collectedCards).length} out of {allCards.length} cards.</p>
            {selectedCard && collectedCards[selectedCard] && (
              <div className="flex items-center gap-4 mb-6 p-4 border rounded-lg bg-gray-800 shadow-lg">
                <div className="w-32 h-32 relative">
                  <Image
                    src={`/sprites/sprites/pokemon/other/home/${collectedCards[selectedCard].card.number}.png`}
                    alt={selectedCard}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold">{selectedCard}</h4>
                  <p className="text-sm italic text-gray-300 mb-1">{collectedCards[selectedCard].card.move}</p>
                  <p className={`text-sm font-semibold ${collectedCards[selectedCard].card.rarity === 'Mythical' ? 'text-[#ffd700]' : 'text-white'}`}>
                    Rarity: {getRarityIcon(collectedCards[selectedCard].card.rarity)} {collectedCards[selectedCard].card.rarity}
                  </p>
                  <div className="text-sm flex items-center gap-1">
                    Type:
                    {collectedCards[selectedCard].card.type.map((t, idx) => (
                      <Image
                        key={idx}
                        src={`/icons/types/${t}.png`}
                        alt={`${t} icon`}
                        width={20}
                        height={20}
                      />
                    ))}
                  </div>
                  <p className="text-sm">Owned: {collectedCards[selectedCard].count}</p>
                </div>
              </div>
            )}
            <div className="flex gap-2 mb-4 flex-wrap">
              {Object.keys(regionRanges).map(region => (
                <button
                  key={region}
                  onClick={() => setCurrentRegion(region as keyof typeof regionRanges)}
                  className={`cursor-pointer px-3 py-1 rounded ${
                    currentRegion === region ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
            {displayedCards.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">No cards available for this region yet.</p>
            ) : (
              <div className="grid grid-cols-5 gap-4">
                {displayedCards.map(card => {
                  const owned = collectedCards[card.name];
                  return (
                    <div onClick={() => handleCardClick(card.name)} key={card.name} className="flex flex-col items-center cursor-pointer">
                      <div className="w-20 h-20 relative mb-2">
                        {owned ? (
                          <Image
                            src={`/sprites/sprites/pokemon/other/home/${card.number}.png`}
                            alt={card.name}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <Image
                            src={`/sprites/sprites/pokemon/other/home/${card.number}.png`}
                            alt={card.name}
                            fill
                            className="object-contain brightness-0"
                          />
                        )}
                      </div>
                      <div className="font-semibold">{card.name}</div>
                      <div className={`${card.rarity === 'Mythical' ? 'text-[#ffd700]' : 'text-white'}`}>{getRarityIcon(card.rarity)}</div>
                      {owned ? (
                        <div className="text-xs">Owned: {owned.count}</div>
                      ) : (
                        <div className="text-xs italic">Missing</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function getGradientBackground(types: string[]) {
  const typeColors: Record<string, string> = {
    Normal: '#a1a3a0',
    Fighting: '#fc820b',
    Flying: '#82b9ef',
    Poison: '#9040cb',
    Ground: '#905120',
    Rock: '#aea980',
    Bug: '#92a31b',
    Ghost: '#714270',
    Steel: '#61a0b8',
    Fire: '#e72928',
    Water: '#2980ef',
    Grass: '#40a12a',
    Electric: '#fbc100',
    Psychic: '#ee417b',
    Ice: '#3fcef5',
    Dragon: '#5060e0',
    Dark: '#624d4f',
    Fairy: '#ee71ee',
    Stellar: '#40b4a4',
  };

  const color1 = typeColors[types[0]] || '#ffffff';
  const color2 = types[1] ? typeColors[types[1]] : color1;

  return `linear-gradient(to bottom right, ${color1}, ${color2})`;
}

function getTypeBorderClass(rarity: Card['rarity']) {
  const rarityBorderColors: Record<Card['rarity'], string> = {
    Common: 'border-[#FFFFFF]',
    Uncommon: 'border-[#C0C0C0]',
    Rare: 'border-[#FFD700]',
    Epic: 'border-[#FF8C00]',
    Legendary: 'border-[#800080]',
    Mythical: 'border-[#8A2BE2]'
  };

  return rarityBorderColors[rarity];
}