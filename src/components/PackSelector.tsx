'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { BoosterPack } from '@/app/Utils/Interfaces';

interface PackSelectorProps {
  selectedPack: string;
  setSelectedPack: (packId: string) => void;
  themedPacks: BoosterPack[];
  disabled: boolean;
}

export const PackSelector: React.FC<PackSelectorProps> = ({ selectedPack, setSelectedPack, themedPacks, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      setIsOpen(false);
    }
  };

  const selectedPackData = themedPacks.find(pack => pack.id === selectedPack) || themedPacks[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`
          bg-gradient-to-br from-gray-700 to-gray-800
          hover:from-gray-600 hover:to-gray-700
          active:from-gray-800 active:to-gray-900
          text-white font-bold py-2 px-4 rounded-2xl
          cursor-pointer
          shadow-lg hover:shadow-xl
          border border-gray-500
          flex gap-2 items-center justify-center
          transform transition-all duration-200
          hover:scale-105 active:scale-95
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        disabled={disabled}
      >
        {selectedPackData.name}
        <Image src='/caret-down-fill.svg' alt='caret-down' width={15} height={15} className='invert'/>
        
      </button>
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-gray-800 rounded-2xl shadow-xl/20 p-4 z-50 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-5 gap-4">
            {themedPacks.map(pack => (
              <button
                key={pack.id}
                onClick={() => handlePackSelect(pack.id)}
                className={`
                  flex flex-col items-center gap-2 p-2 rounded-lg
                  hover:bg-gray-700
                  transition-all duration-200
                  ${pack.id === selectedPack ? 'bg-gray-600' : ''}
                  min-w-[100px]
                `}
              >
                <Image
                  src={`/booster/mystery-pack.png`}
                  alt={pack.name}
                  width={80}
                  height={120}
                  className="rounded-md shadow-md hover:scale-110 transition-transform duration-200"
                />
                <span className="text-white text-sm font-semibold text-center">{pack.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};