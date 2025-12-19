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
  const [userName, setUserName] = useState("Ninja Player");
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/click.mp3");
    const savedScore = localStorage.getItem("ninjaScore");
    if (savedScore) setScore(parseInt(savedScore));

    // Get Telegram Name
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const user = (window as any).Telegram.WebApp.initDataUnsafe?.user;
      if (user) setUserName(user.first_name);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ninjaScore", score.toString());
  }, [score]);

  // Energy Recovery Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prev) => (prev < 5000 ? prev + 1 : 5000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (energy <= 0) return;
    setScore(prev => prev + 1);
    setEnergy(prev => Math.max(0, prev - 1));

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

    const newNum = { id: Date.now(), x: clientX, y: clientY, value: 1 };
    setFloatingNumbers(prev => [...prev, newNum]);
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(n => n.id !== newNum.id));
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#1a1a1a", color: "white", fontFamily: "sans-serif", padding: "20px", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "45px", height: "45px", backgroundColor: "#333", borderRadius: "10px", border: "1px solid #555" }}></div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>{userName}</div>
            <div style={{ color: "#ff4444", fontSize: "12px", fontWeight: "bold" }}>Lvl 1 / 10</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "20px" }}>🍎</div>
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>254</div>
        </div>
      </div>

      {/* Main Score */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "40px" }}>
        <span style={{ fontSize: "40px", color: "#ffd700" }}>$</span>
        <span style={{ fontSize: "50px", fontWeight: "bold" }}>{score.toLocaleString()}</span>
      </div>

      {/* Middle: Energy & Ninja */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", justifyContent: "center" }}>
        <div style={{ position: "absolute", left: "0", top: "15%", display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(0,0,0,0.3)", padding: "5px 10px", borderRadius: "20px" }}>
          <div style={{ fontSize: "24px" }}>🔋</div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>{energy} / 5000</div>
        </div>

        <div 
          onClick={handleClick}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          style={{ transition: "transform 0.1s", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
        >
          <img src="/coin.png" alt="Ninja" style={{ width: "280px", height: "auto", userSelect: "none", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Footer Menu */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button style={{ backgroundColor: "transparent", border: "2px solid #ff4444", color: "white", borderRadius: "8px", padding: "5px 15px" }}>QR</button>
          <button style={{ backgroundColor: "transparent", border: "2px solid #44cc44", color: "#44cc44", borderRadius: "8px", padding: "5px 15px" }}>Boost</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "5px" }}>
          {["Tap", "Mine", "Fight", "Library", "Cards"].map(label => (
            <button key={label} style={{ flex: 1, backgroundColor: "#333", border: "1px solid #555", color: "#ccc", borderRadius: "8px", padding: "10px 5px", fontSize: "12px" }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Floating Numbers */}
      {floatingNumbers.map(num => (
        <div key={num.id} style={{ position: "fixed", left: num.x, top: num.y, transform: "translate(-50%, -100%)", fontSize: "2rem", fontWeight: "bold", color: "#FFD700", animation: "f 1s forwards", pointerEvents: "none" }}>+{num.value}</div>
      ))}

      <style>{`@keyframes f { 0%{opacity:1;transform:translate(-50%,0)} 100%{opacity:0;transform:translate(-50%,-100px)} }`}</style>
    </div>
  );
}