'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/app/Utils/Interfaces';
import { useSound } from '@/app/Context/SoundContext';
import { AnimatePresence, motion } from 'framer-motion';

const About: React.FC = () => {
  const { isMuted, toggleMute } = useSound();
  const [showModal, setShowModal] = useState(false);
const modalContentRef = useRef<HTMLDivElement>(null);
  

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

  const rarityWeights: Record<Card['rarity'], number> = {
    Common: 40,
    Uncommon: 25,
    Rare: 15,
    Epic: 10,
    Legendary: 7,
    Mythical: 3,
  };

  return (
    <div className="absolute top-5 right-5">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShowModal(true)}
          className="h-10 w-10 bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 active:from-gray-300 active:to-gray-400 text-black font-bold rounded-full cursor-pointer drop-shadow-sm/25 hover:shadow-xl border border-gray-300 flex items-center justify-center transform transition-all duration-200 hover:scale-105 active:scale-95 text-2xl"
        >
          ?
        </button>
        <button
          onClick={toggleMute}
          className={`h-10 w-10 bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 active:from-gray-300 active:to-gray-400 text-black font-bold rounded-full cursor-pointer drop-shadow-sm/25 hover:shadow-xl border border-gray-300 flex items-center justify-center transform transition-all duration-200 hover:scale-105 active:scale-95 ${isMuted ? 'inset-shadow-xs inset-shadow-[#8c9ca4]' : ''}`}
        >
          <Image src={isMuted ? '/icons/mute.svg' : '/icons/unmute.svg'} alt={isMuted ? 'Muted' : 'Unmuted'} width={30} height={30} />
        </button>
        <Link href="https://x.com/GReinares" target="_blank" rel="noopener noreferrer">
          <button
            className="h-10 w-10 bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 active:from-gray-300 active:to-gray-400 text-black font-bold rounded-full cursor-pointer drop-shadow-sm/25 hover:shadow-xl border border-gray-300 flex items-center justify-center transform transition-all duration-200 hover:scale-105 active:scale-95 text-2xl"
          >
            <Image src='/icons/twitter-x.svg' alt='x' width={20} height={20} />
          </button>
        </Link>
        <Link href="https://ko-fi.com/S6S2P5VOY" target="_blank" rel="noopener noreferrer">
          <Image
            src="/ko-fi.webp"
            alt="Buy Me a Coffee at ko-fi.com"
            width={140}
            height={36}
            className="hover:opacity-80 drop-shadow-sm/25 rounded-xl transform transition-all duration-200 hover:scale-105 active:scale-95 text-2xl"
            style={{ border: '0px', height: '36px' }}
          />
        </Link>
      </div>
      {showModal && 
      (
            <AnimatePresence>
    <motion.div
            initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-6"
      onClick={(e) => {
            if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
              setShowModal(false);
            }
          }}
    >
      <motion.div
      ref={modalContentRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.445, 0.05, 0.55, 0.95] }}
        className="bg-[#E4F1F6] rounded-lg max-w-md w-full p-6 relative text-[#2A3F55]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-4 hover:opacity-80 text-3xl cursor-pointer text-[#8c9ca4]"
        >
          ✖
        </button>
        <h3 className="text-xl font-bold mb-4">Welcome to PokéPack Opening Simulator - Alpha v1.0.2</h3>
        <div className="p-3 inset-shadow-sm inset-shadow-[#8c9ca4] rounded-lg">
        <p className="mb-2">
          Just a small solo side project I am working on. Feel free to contact me if you have any suggestions, or find any bugs as this is still a work in progress.
        </p>
        <h4 className="text-lg font-semibold mb-2">Card Rarities</h4>
        <ul className="space-y-2 mb-2">
          {Object.entries(rarityWeights).map(([rarity, weight]) => (
            <li key={rarity} className="flex items-center gap-2">
              <span className="w-auto flex items-center gap-1">
                {getRarityIcon(rarity as Card['rarity'])}
                <span className="font-medium">{rarity}:</span>
              </span>
              <span className="text-sm">Weight - {weight}%</span>
            </li>
          ))}
        </ul>
        <p>(There is also a 1% chance that your card will be Shiny!)</p>
        </div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
      )
      }
    </div>
  );
};

export default About;