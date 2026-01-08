import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BoosterPack, Card, allCards } from '@/app/Utils/Interfaces';

interface PackSelectorProps {
  selectedPack: string;
  setSelectedPack: (packId: string) => void;
  themedPacks: BoosterPack[];
  disabled: boolean;
}

const CardItem = ({ card, shinyCheck, displayPack }: { card: any; shinyCheck: boolean; displayPack: any }) => {
  const isChaseCard = `${card.name}-${card.number}` === displayPack.chaseCard;

  return (
    <div className="flex flex-col items-center min-w-[100px]">
      <div className="relative w-[100px] h-[100px]">
        {isChaseCard && (
          <div
            className="absolute inset-0 bg-[url('/glow.png')] bg-center bg-no-repeat bg-contain animate-spin-slow -z-10"
          />
        )}
        <Image
          src={`/${isChaseCard && shinyCheck ? 'shiny' : 'home-icons'}/${card.number}${card.variant ? `-${card.variant}` : ''}.png`}
          alt={card.name}
          width={100}
          height={100}
          className={`${isChaseCard ? 'drop-shadow-lg drop-shadow-yellow-400/50' : 'drop-shadow-md'} object-contain z-20`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/home-icons/placeholder.png';
          }}
        />
      </div>
    </div>
  );
};

export const PackSelector: React.FC<PackSelectorProps> = ({ selectedPack, setSelectedPack, themedPacks, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPackId, setHoveredPackId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayPack = hoveredPackId
    ? themedPacks.find(pack => pack.id === hoveredPackId) || themedPacks[0]
    : themedPacks.find(pack => pack.id === selectedPack) || themedPacks[0];

  const packCards = (displayPack.carouselCards || [])
    .map(cardKey => {
      const [name, number, variant] = cardKey.split('-');
      return allCards.find(c => c.name === name && c.number === parseInt(number) && (!variant || c.variant === variant));
    })
    .filter((card): card is Card => !!card);
  const shinyCheck = displayPack.shinyChase || false;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen(prev => !prev);
  };

  const handlePackSelect = (packId: string) => {
    if (!disabled) {
      setSelectedPack(packId);
    }
  };

  return (
    <div className="relative flex flex-col items-center" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`
          bg-gradient-to-br from-gray-700 to-gray-800
          hover:from-gray-600 hover:to-gray-700
          text-white font-bold py-2 px-4 rounded-2xl
          shadow-lg hover:shadow-xl
          border border-gray-500
          flex gap-2 items-center justify-center
          transform transition-all duration-200
          hover:scale-105 active:scale-95
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        disabled={disabled}
        aria-label={`Select booster pack, currently ${displayPack.name}`}
      >
        {displayPack.name}
        <Image src="/caret-down-fill.svg" alt="caret-down" width={15} height={15} className="invert" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="scale-50 sm:scale-75 md:scale-100 absolute top-full left-1/2 -translate-x-1/2 md:mt-2 w-[600px] bg-[#E4F1F6] rounded-2xl shadow-xl p-4 z-50"
          >
          <div className="flex justify-center">
          {packCards.length > 0 ? (
            <div className="w-[80%] h-[120px] rounded-lg inset-shadow-sm inset-shadow-[#8c9ca4] overflow-hidden mb-4 pt-2 relative">
              <div className="absolute inset-0 flex">
                <div style={{
                    display: "flex",
                    gap: "8px",
                    animation: `infinite-scroll ${packCards.length > 9 ? '15' : '5'}s linear infinite`
                }}
                  className="pt-2 flex gap-2 animate-infinite-scroll">
                  {packCards.map((card, index) => (
                    <CardItem key={`first-${card.number}-${card.variant || ''}-${index}`} card={card} shinyCheck={shinyCheck} displayPack={displayPack} />
                  ))}
                  {packCards.map((card, index) => (
                    <CardItem key={`dup-${card.number}-${card.variant || ''}-${index}`} card={card} shinyCheck={shinyCheck} displayPack={displayPack} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-[80%] h-[120px] flex justify-center items-center mb-4">
              <span className="text-sm font-semibold text-[#2A3F55]">No cards available</span>
            </div>
          )}
                    </div>

            <div className="max-h-[240px] overflow-y-auto rounded-lg inset-shadow-sm inset-shadow-[#8c9ca4] p-3">
              <div className="grid grid-cols-5 gap-2">
                {themedPacks.map(pack => (
                  <button
                    key={pack.id}
                    onClick={() => handlePackSelect(pack.id)}
                    onMouseEnter={() => setHoveredPackId(pack.id)}
                    onMouseLeave={() => setHoveredPackId(null)}
                    className={`
                      flex flex-col items-center gap-2 p-2 rounded-lg
                      hover:bg-blue-700 hover:text-white
                      transition-all duration-200
                      ${pack.id === selectedPack ? 'bg-blue-500 text-white inset-shadow-sm inset-shadow-blue-700' : ''}
                      min-w-[100px] cursor-pointer
                    `}
                    aria-label={`Select ${pack.name} pack, hover to preview cards`}
                  >
                    <Image
                      src={`/booster/${pack.id}-pack.png`}
                      alt={pack.name}
                      width={80}
                      height={120}
                      className="hover:scale-110 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.src = '/booster/placeholder-pack.png';
                      }}
                    />
                    <span className="text-sm font-semibold text-center">{pack.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};