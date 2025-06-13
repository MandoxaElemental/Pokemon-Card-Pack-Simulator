'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { allCards, Card } from '@/app/Utils/Interfaces';

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
  const [opening, setOpening] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [isNewCard, setIsNewCard] = useState<boolean[]>([]); // Track new cards
  const [packsOpened, setPacksOpened] = useState(0);
  const [collectedCards, setCollectedCards] = useState<CardCollection>({});
  const [showDex, setShowDex] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
        } else {
        }
      } else {
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

    const newCards: Card[] = [];
    const newCardFlags: boolean[] = [];
    for (let i = 0; i < 5; i++) {
      const card = getRandomCard();
      newCards.push(card);
      // Card is new if it’s not in collectedCards
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
    setRevealed([false, false, false, false, false]);
    setIsNewCard(newCardFlags);

    newCards.forEach((_, index) => {
      setTimeout(() => {
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

        if (index === 4) setOpening(false);
      }, 1000 + index * 400);
    });
  };

  const handleCardClick = (cardName: string) => {
    setSelectedCard(cardName);
    setShowDex(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">🎴 Card Pack Opening</h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={openPack}
          disabled={opening}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          {opening ? 'Opening...' : 'Open Pack'}
        </button>
        <button
          onClick={clearStorage}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset Collection
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 perspective">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            className="w-44 h-64 relative"
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
                className={`absolute w-full h-full rotateY-180 backface-hidden p-2 rounded-xl border-5 flex flex-col items-center justify-between text-center shadow-lg ${getTypeBackgroundClass(card.type[0], card.rarity)} ${card.rarity === 'Mythical' && revealed[idx] ? 'glow-mythical' : ''} ${isNewCard[idx] && revealed[idx] ? 'glow-new' : ''} ${revealed[idx] ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                onClick={() => revealed[idx] && handleCardClick(card.name)}
              >
                {revealed[idx] && (
                  <>
                  <div className='flex justify-center items-center w-42 h-42 p-2'>                    
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
                    <div className={`text-sm opacity-80 mb-1 ${card.rarity === 'Mythical' ? 'text-[#ffd700]' : 'text-white'}`}>{getRarityIcon(card.rarity)}</div>
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
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-3 rounded"
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
              className="absolute top-2 right-4 text-gray-300 hover:text-white text-xl"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4">📖 Card Dex</h3>
            <p className="mb-4">You&apos;ve collected {Object.keys(collectedCards).length} out of {allCards.length} cards.</p>
            {selectedCard && collectedCards[selectedCard] && (
  <div className="flex items-center gap-4 mb-6 p-4 border rounded-lg bg-gray-800 shadow-lg">
    <div  className="w-32 h-32 relative">
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
      <p className="text-sm">Type: {collectedCards[selectedCard].card.type.join(', ')}</p>
      <p className="text-sm">Owned: {collectedCards[selectedCard].count}</p>
    </div>
  </div>
)}

            <div className="grid grid-cols-5 gap-4">
              {allCards.map(card => {
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
          </div>
        </div>
      )}
    </div>
  );
};

function getTypeBackgroundClass(type: string, rarity: Card['rarity']) {
  const typeColors: Record<string, string> = {
  Normal: 'bg-[#a1a3a0]',
  Fighting: 'bg-[#fc820b]',
  Flying: 'bg-[#82b9ef]',
  Poison: 'bg-[#9040cb]',
  Ground: 'bg-[#905120]',
  Rock: 'bg-[#aea980]',
  Bug: 'bg-[#92a31b]',
  Ghost: 'bg-[#714270]',
  Steel: 'bg-[#61a0b8]',
  Fire: 'bg-[#e72928]',
  Water: 'bg-[#2980ef]',
  Grass: 'bg-[#40a12a]',
  Electric: 'bg-[#fbc100]',
  Psychic: 'bg-[#ee417b]',
  Ice: 'bg-[#3fcef5]',
  Dragon: 'bg-[#5060e0]',
  Dark: 'bg-[#624d4f]',
  Fairy: 'bg-[#ee71ee]',
  Stellar: 'bg-[#40b4a4]',
};

  const rarityBorderColors: Record<Card['rarity'], string> = {
    Common: 'border-[#C0C0C0]',
    Uncommon: 'border-[#3CB371]',
    Rare: 'border-[#FFD700]',
    Epic: 'border-[#800080]',
    Legendary: 'border-[#FF8C00]',
    Mythical: 'border-[#8A2BE2]'
  };

  const backgroundColor = typeColors[type] || 'bg-white';
  return `${rarityBorderColors[rarity]} ${backgroundColor}`;
}