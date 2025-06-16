import React from 'react'
import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <div className='absolute top-5 right-5'>
    <Link href="https://ko-fi.com/S6S2P5VOY" target="_blank" rel="noopener noreferrer">
      <Image
        src="/ko-fi.webp"
        alt="Buy Me a Coffee at ko-fi.com"
        width={140}
        height={46}
        style={{ border: '0px', height: '36px' }}
        className='hover:opacity-80 shadow-xl/20 rounded-xl'
      />
    </Link>
    </div>
  )
}

export default About