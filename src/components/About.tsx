'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/app/Utils/Interfaces';

const About: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

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

  const AboutModal = () => (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-6"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-[#E4F1F6] rounded-lg max-w-md w-full p-6 relative text-[#2A3F55]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-4 hover:opacity-80 text-3xl cursor-pointer text-[#8c9ca4]"
        >
          ✖
        </button>
        <h3 className="text-xl font-bold mb-4">Welcome to PokéPack Opening Simulator</h3>
        <p className="mb-2">
          Just a small solo side project I am working on. Feel free to contact me if you have any suggestions, or find any bugs.
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
    </div>
  );

  return (
    <div className="absolute top-5 right-5">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShowModal(true)}
          className="h-9 w-9 flex items-center justify-center bg-white font-bold text-2xl rounded-full shadow-lg hover:bg-slate-200 cursor-pointer transition-colors"
        >
          ?
        </button>
        <Link href="https://ko-fi.com/S6S2P5VOY" target="_blank" rel="noopener noreferrer">
          <Image
            src="/ko-fi.webp"
            alt="Buy Me a Coffee at ko-fi.com"
            width={140}
            height={36}
            className="hover:opacity-80 shadow-lg rounded-xl transition-opacity"
            style={{ border: '0px', height: '36px' }}
          />
        </Link>
      </div>
      {showModal && <AboutModal />}
    </div>
  );
};

export default About;