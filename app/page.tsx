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
      
      {/* Header: Profile & Level (Left) + Salad (Right) */}
<div style={{ 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  width: "100%", 
  padding: "10px 15px",
  position: "absolute",
  top: 0,
  left: 0,
  boxSizing: "border-box",
  zIndex: 10
}}>
  {/* بخش پروفایل و لول */}
  <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(255,255,255,0.05)", padding: "5px 10px", borderRadius: "12px" }}>
    <div style={{ width: "35px", height: "35px", borderRadius: "50%", border: "2px solid #ffd700", overflow: "hidden", backgroundColor: "#333" }}>
      <img src="/coin.png" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: "12px", color: "#ccc" }}>{userName}</span>
      <span style={{ fontSize: "11px", fontWeight: "bold", color: "#ffd700" }}>Lv. 1 (Warrior)</span>
    </div>
  </div>

  {/* Salad Token (سمت راست) */}
  <div style={{ 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    backgroundColor: "rgba(0,0,0,0.4)", 
    padding: "5px 12px", 
    borderRadius: "20px",
    height: "35px"
  }}>
    <img src="/salad-butt.png" alt="Salad" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>
      {score.toLocaleString()}
    </span>
  </div>
</div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", marginTop: "70px" }}>
        
        {/* Score Area */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
          <img src="/salad-butt.png" alt="Salad" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
          <span style={{ fontSize: "45px", fontWeight: "bold", color: "#fff" }}>
            {score.toLocaleString()}
          </span>
        </div>
        {/* Energy Bar - Left Aligned */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 10px", marginBottom: "20px", alignSelf: "flex-start" }}>
          <span style={{ fontSize: "24px" }}>🔋</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>{energy} / 5000</span>
            <div style={{ width: "120px", height: "6px", backgroundColor: "#333", borderRadius: "3px", marginTop: "4px" }}>
              <div style={{ width: `${(energy / 5000) * 100}%`, height: "100%", backgroundColor: "#4caf50", borderRadius: "3px", transition: "width 0.3s" }}></div>
            </div>
          </div>
        </div>

        {/* Ninja Area */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div 
            onClick={handleClick}
            style={{ transition: "transform 0.05s ease", cursor: "pointer", touchAction: "manipulation" }}
            onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.92)"}
            onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <img src="/coin.png" alt="Ninja" style={{ width: "280px", height: "auto", objectFit: "contain" }} />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "5px", alignItems: "flex-end" }}>
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
              <img src={icons[label] || "/tap-butt.png"} alt={label} style={{ width: "35px", height: "35px", objectFit: "contain", filter: isActive ? "none" : "grayscale(100%)", opacity: isActive ? "1" : "0.6" }} />
              <span style={{ fontSize: "10px", fontWeight: isActive ? "bold" : "normal" }}>{label}</span>
            </button>
          );
        })}
      </div>
{/* QR Button - بالای Tab */}
<button style={{ 
  position: "absolute", 
  bottom: "90px", // ارتفاع از پایین صفحه (کمی بالاتر از فوتر)
  left: "50px",   // تنظیم برای قرارگیری بالای Tab
  background: "none", 
  border: "none", 
  cursor: "pointer", 
  width: "35px", 
  height: "35px",
  zIndex: 20
}}>
  <img src="/qr-butt.png" alt="QR" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
</button>

{/* Boost Button - بالای Cards */}
<button style={{ 
  position: "absolute", 
  bottom: "90px", 
  right: "50px",  // تنظیم برای قرارگیری بالای Cards
  background: "none", 
  border: "none", 
  cursor: "pointer", 
  width: "35px", 
  height: "35px",
  zIndex: 20
}}>
  <img src="/boost-butt.png" alt="Boost" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
</button>
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