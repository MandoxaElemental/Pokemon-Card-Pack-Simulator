'use client'
import React, { useState } from 'react'
import Image from "next/image";
import Link from "next/link";

const About = () => {
const [showModal, setShowModal] = useState(false);

  const AboutModal = () => (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-6"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-[#E4F1F6] rounded-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-4 hover:opacity-80 text-2xl cursor-pointer text-[#8c9ca4]"
        >
          ✖
        </button>
        <h3 className="text-xl font-bold mb-4">Welcome</h3>
        <p className="mb-6">Hello World</p>
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
}

export default About