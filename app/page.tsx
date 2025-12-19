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
  const [energy, setEnergy] = useState(5000);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/click.mp3");
    const savedScore = localStorage.getItem("ninjaScore");
    if (savedScore) setScore(parseInt(savedScore));
  }, []);

  useEffect(() => {
    localStorage.setItem("ninjaScore", score.toString());
  }, [score]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (energy <= 0) return;

    setScore(prev => prev + 1);
    setEnergy(prev => Math.max(0, prev - 1));

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const newNum = { id: Date.now(), x: clientX, y: clientY, value: 1 };
    setFloatingNumbers(prev => [...prev, newNum]);
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(n => n.id !== newNum.id));
    }, 1000);
  };

  return (
    <div style={{ 
      display: "flex", flexDirection: "column", height: "100vh", 
      backgroundColor: "#1a1a1a", color: "white", fontFamily: "sans-serif",
      padding: "20px", boxSizing: "border-box", overflow: "hidden", position: "relative" 
    }}>
      
      {/* 1. Header: Profile & Level */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "45px", height: "45px", backgroundColor: "#333", borderRadius: "10px", border: "1px solid #555" }}></div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>Name of Player</div>
            <div style={{ color: "#ff4444", fontSize: "12px", fontWeight: "bold" }}>Lvl 1 / 10</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "20px" }}>🍎</div>
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>254</div>
        </div>
      </div>

      {/* 2. Main Score */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "40px" }}>
        <span style={{ fontSize: "40px", color: "#ffd700" }}>$</span>
        <span style={{ fontSize: "50px", fontWeight: "bold" }}>{score.toLocaleString()}</span>
      </div>

      {/* 3. Middle Section: Energy & Ninja */}
<div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", justifyContent: "center" }}>
  
  {/* Energy Section - اصلاح شده برای قرارگیری در سمت چپ و بالاتر */}
  <div style={{ 
    position: "absolute", 
    left: "0", 
    top: "2%", // تنظیم ارتفاع (می‌توانی این عدد را کم و زیاد کنی)
    display: "flex", 
    alignItems: "center", 
    gap: "8px",
    backgroundColor: "rgba(0,0,0,0.3)", // یک پس‌زمینه بسیار شفاف برای خوانایی بهتر
    padding: "5px 10px",
    borderRadius: "20px"
  }}>
    <div style={{ fontSize: "24px" }}>🔋</div>
    <div style={{ 
      fontSize: "14px", 
      fontWeight: "bold", 
      color: "#ddd",
      whiteSpace: "nowrap" // جلوگیری از شکستن خط
    }}>
      {energy} / 5000
    </div>
  </div>
        {/* Ninja Character */}
        <div 
          onClick={handleClick}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.95)"}
          onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}
          style={{ transition: "transform 0.1s", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
        >
          <img src="/coin.png" alt="Ninja" style={{ width: "280px", height: "auto", userSelect: "none", pointerEvents: "none" }} />
        </div>
      </div>

      {/* 4. Bottom Menu */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button style={btnSmallStyle}>QR</button>
          <button style={{...btnSmallStyle, color: "#44cc44", borderColor: "#44cc44"}}>Boost</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "5px" }}>
          <button style={btnMainStyle}>Tap</button>
          <button style={btnMainStyle}>Mine</button>
          <button style={btnMainStyle}>Fight</button>
          <button style={btnMainStyle}>Library</button>
          <button style={btnMainStyle}>Cards</button>
        </div>
      </div>

      {/* Floating Numbers */}
      {floatingNumbers.map(num => (
        <div key={num.id} style={{
          position: "fixed", left: num.x, top: num.y, transform: "translate(-50%, -100%)",
          fontSize: "2rem", fontWeight: "bold", color: "#FFD700", pointerEvents: "none",
          animation: "floatUpAndFade 1s forwards", zIndex: 100
        }}>+{num.value}</div>
      ))}

      <style>{`
        @keyframes floatUpAndFade {
          0% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -100px); }
        }
      `}</style>
    </div>
  );
}

// Styles for Buttons
const btnSmallStyle = {
  backgroundColor: "transparent", border: "2px solid #ff4444", color: "white",
  borderRadius: "8px", padding: "5px 15px", fontWeight: "bold" as const, fontSize: "14px"
};

const btnMainStyle = {
  flex: 1, backgroundColor: "#333", border: "1px solid #555", color: "#ccc",
  borderRadius: "8px", padding: "10px 5px", fontSize: "12px", fontWeight: "bold" as const
};