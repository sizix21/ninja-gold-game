"use client";

import { useState, useEffect, useRef } from "react";

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
}

export default function Home() {
  const [score, setScore] = useState(0);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  
  // استفاده از useRef برای نگه داشتن فایل صوتی در حافظه
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // ایجاد شیء صوتی هنگام لود شدن صفحه
    audioRef.current = new Audio("/click.mp3");
    
    const savedScore = localStorage.getItem("ninjaScore");
    if (savedScore) setScore(parseInt(savedScore));
  }, []);

  useEffect(() => {
    localStorage.setItem("ninjaScore", score.toString());
  }, [score]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setScore(prevScore => prevScore + 1);

    // پخش صدا
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // بازگشت به ابتدای صدا برای کلیک‌های سریع
      audioRef.current.play().catch(err => console.log("Audio play error:", err));
    }

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newFloatingNumber: FloatingNumber = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      value: 1,
    };

    setFloatingNumbers(prevNumbers => [...prevNumbers, newFloatingNumber]);

    setTimeout(() => {
      setFloatingNumbers(prevNumbers => prevNumbers.filter(num => num.id !== newFloatingNumber.id));
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#1a1a1a", color: "white", fontFamily: "sans-serif", overflow: "hidden", position: "relative" }}>
      <h1>SCORE</h1>
      <h2 style={{ fontSize: "3rem", margin: "0" }}>{score}</h2>
      
      <div 
        onClick={handleClick}
        style={{ 
          cursor: "pointer", 
          marginTop: "20px", 
          transition: "transform 0.1s ease-in-out", 
          touchAction: "manipulation", 
          WebkitTapHighlightColor: "transparent"
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.95)"} 
        onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}    
      >
        <img 
          src="/coin.png" 
          alt="Ninja" 
          style={{ 
            width: "300px", 
            height: "auto", 
            borderRadius: "0", 
            userSelect: "none",
            pointerEvents: "none" 
          }} 
        />
      </div>
      
      <p style={{ marginTop: "20px", color: "#888" }}>Ninja Potato Game</p>

      {floatingNumbers.map(num => (
        <div
          key={num.id}
          style={{
            position: "fixed",
            left: num.x,
            top: num.y,
            transform: "translate(-50%, -100%)",
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#FFD700",
            textShadow: "0 0 8px rgba(255, 215, 0, 0.8)",
            animation: "floatUpAndFade 1s forwards",
            pointerEvents: "none",
            zIndex: 100
          }}
        >
          +{num.value}
        </div>
      ))}

      <style>{`
        @keyframes floatUpAndFade {
          0% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -120px); }
        }
      `}</style>
    </div>
  );
}