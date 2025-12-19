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

  // لود کردن اطلاعات و تنظیمات تلگرام
  useEffect(() => {
    audioRef.current = new Audio("/click.mp3");
    
    const savedEnergy = localStorage.getItem("ninjaEnergy");
    if (savedEnergy) setEnergy(parseInt(savedEnergy));

    const savedScore = localStorage.getItem("ninjaScore");
    if (savedScore) setScore(parseInt(savedScore));

    const tgTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();  
        const user = tg.initDataUnsafe?.user;
        if (user) {
          setUserName(user.first_name || "Ninja Player");
        }
      }
    }, 500);

    return () => clearTimeout(tgTimer);
  }, []);

  // سیستم پر شدن انرژی
  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prev) => (prev < 5000 ? prev + 1 : 5000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ذخیره سازی پیشرفت
  useEffect(() => {
    localStorage.setItem("ninjaEnergy", energy.toString());
    localStorage.setItem("ninjaScore", score.toString());
  }, [energy, score]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (energy <= 0) return;

    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10); 
    }

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
      
      {/* Header: QR, Boost and Token */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 15px", position: "absolute", top: 0, left: 0, boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer" }}>
            <img src="/qr-butt.png" alt="QR" style={{ width: "40px", height: "40px" }} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer" }}>
            <img src="/boost-butt.png" alt="Boost" style={{ width: "40px", height: "40px" }} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <img src="/salad-butt.png" alt="Salad" style={{ width: "35px", height: "35px" }} />
          <span style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "60px" }}>
        
        {/* Score Area */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <img src="/salad-butt.png" alt="Salad" style={{ width: "45px", height: "45px" }} />
          <span style={{ fontSize: "50px", fontWeight: "bold", color: "#fff" }}>
            {score.toLocaleString()}
          </span>
        </div>

        {/* Energy & Ninja */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          {/* Energy Bar */}
          <div style={{ position: "absolute", top: "-40px", display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(0,0,0,0.3)", padding: "5px 15px", borderRadius: "20px" }}>
            <span style={{ fontSize: "20px" }}>🔋</span>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{energy} / 5000</span>
          </div>

          {/* Ninja (Tap Area) */}
          <div 
            onClick={handleClick}
            onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.92)"}
            onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            style={{ transition: "transform 0.05s ease", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
          >
            <img 
              src="/coin.png" 
              alt="Ninja" 
              style={{ width: "280px", height: "auto", userSelect: "none", pointerEvents: "none" }} 
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "5px", alignItems: "flex-end", marginTop: "10px" }}>
        {["Tap", "Mine", "Fight", "Library", "Cards"].map((label) => {
          const isActive = label === "Tap";
          const icons: { [key: string]: string } = {
            "Tap": "/tap-butt.png",
            "Mine": "/mine-butt.png",
            "Fight": "/fight-butt.png",
            "Library": "/closet-butt.png",
            "Cards": "/cards-butt.png"
          };

          return (
            <button key={label} style={{ flex: 1, backgroundColor: "transparent", border: "none", outline: "none", color: isActive ? "#ffd700" : "#888", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}>
              <img src={icons[label] || "/tap-butt.png"} alt={label} style={{ width: "35px", height: "35px", filter: isActive ? "none" : "grayscale(100%)", opacity: isActive ? "1" : "0.6" }} />
              <span style={{ fontSize: "10px", fontWeight: isActive ? "bold" : "normal" }}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Animations */}
      {floatingNumbers.map(num => (
        <div key={num.id} style={{ position: "fixed", left: num.x, top: num.y, transform: "translate(-50%, -100%)", fontSize: "2.5rem", fontWeight: "bold", color: "#FFD700", animation: "f 0.8s ease-out forwards", pointerEvents: "none", zIndex: 9999 }}>
          +1
        </div>
      ))}

      <style>{`
        @keyframes f {
          0% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -120px); }
        }
      `}</style>
    </div>
  );
}