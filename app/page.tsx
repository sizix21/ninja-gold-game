'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [points, setPoints] = useState(0);

  const handleTap = () => {
    setPoints(prev => prev + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-white p-4 select-none">
      <div className="text-center mb-10">
        <p className="text-xl text-yellow-500 font-bold uppercase">Score</p>
        <h1 className="text-7xl font-black mt-2">{points}</h1>
      </div>

      <button 
        onClick={handleTap}
        className="w-64 h-64 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 active:scale-95 transition-transform flex items-center justify-center border-[12px] border-yellow-700/30 shadow-2xl"
      >
        <span className="text-8xl">🪙</span>
      </button>

      <div className="mt-16 w-full max-w-xs text-center">
        <p className="text-sm opacity-50">Ninja Potato Game</p>
      </div>
    </main>
  );
}