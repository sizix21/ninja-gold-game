"use client";

import { useState, useEffect, useRef } from "react";

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
}

export default function Home() {
  const [greenCoins, setGreenCoins] = useState(0); // سکه سبز (ارز کلیکی)
  const [saladToken, setSaladToken] = useState(0); // توکن اصلی (سالاد)
  const [energy, setEnergy] = useState(2000);
  const [userName, setUserName] = useState("Ninja Player");
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeTab, setActiveTab] = useState("Tap");

  // لود کردن اطلاعات
  useEffect(() => {
    audioRef.current = new Audio("/click.mp3");
    
    const savedGreen = localStorage.getItem("ninjaGreenCoins");
    if (savedGreen) setGreenCoins(parseInt(savedGreen));

    const savedSalad = localStorage.getItem("ninjaSalad");
    if (savedSalad) setSaladToken(parseInt(savedSalad));

    const savedEnergy = localStorage.getItem("ninjaEnergy");
    if (savedEnergy) setEnergy(parseInt(savedEnergy));

    const tgTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();  
        const user = tg.initDataUnsafe?.user;
        if (user) setUserName(user.first_name || "Ninja Player");
      }
    }, 500);
    return () => clearTimeout(tgTimer);
  }, []);

  // ذخیره سازی و بازیابی انرژی
  useEffect(() => {
    audioRef.current = new Audio("/click.mp3");
    
    // ۱. لود کردن سکه‌ها و توکن‌ها
    const savedGreen = localStorage.getItem("ninjaGreenCoins");
    if (savedGreen) setGreenCoins(parseInt(savedGreen));
    const savedSalad = localStorage.getItem("ninjaSalad");
    if (savedSalad) setSaladToken(parseInt(savedSalad));

    // ۲. منطق انرژی (آنلاین + آفلاین)
    const savedEnergy = localStorage.getItem("ninjaEnergy");
    const lastTime = localStorage.getItem("lastTime");
    
    if (savedEnergy && lastTime) {
      const currentTime = Date.now();
      const secondsPassed = Math.floor((currentTime - parseInt(lastTime)) / 1000);
      const energyBefore = parseInt(savedEnergy);
      
      // محاسبه انرژی جدید (انرژی قبلی + زمان گذشته) با سقف ۲۰۰۰
      const calculatedEnergy = Math.min(2000, energyBefore + secondsPassed);
      setEnergy(calculatedEnergy);
    } else if (savedEnergy) {
      setEnergy(parseInt(savedEnergy));
    }

    // ۳. تنظیمات تلگرام
    const tgTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();  
        const user = tg.initDataUnsafe?.user;
        if (user) setUserName(user.first_name || "Ninja Player");
      }
    }, 500);
    return () => clearTimeout(tgTimer);
  }, []);

  useEffect(() => {
    // ذخیره تمام مقادیر به همراه زمان فعلی
    localStorage.setItem("ninjaGreenCoins", greenCoins.toString());
    localStorage.setItem("ninjaEnergy", energy.toString());
    localStorage.setItem("ninjaSalad", saladToken.toString());
    localStorage.setItem("lastTime", Date.now().toString());
  }, [greenCoins, energy, saladToken]);
  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prev) => (prev < 2000 ? prev + 1 : 2000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (energy <= 0) return;
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10); 

    setGreenCoins(prev => prev + 1);
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
      
      {/* Header: Profile (Left) & Salad (Right) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 15px", position: "absolute", top: 0, left: 0, boxSizing: "border-box", zIndex: 10 }}>
        {/* پروفایل سمت چپ */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(255,255,255,0.05)", padding: "5px 10px", borderRadius: "12px" }}>
          <div style={{ width: "35px", height: "35px", borderRadius: "50%", border: "2px solid #ffd700", overflow: "hidden", backgroundColor: "#333" }}>
            <img src="/coin.png" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#ccc" }}>{userName}</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#ffd700" }}>Lv. 1</span>
          </div>
        </div>

        {/* توکن اصلی سالاد سمت راست */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(0,0,0,0.4)", padding: "5px 12px", borderRadius: "20px", height: "35px" }}>
          <img src="/salad-butt.png" alt="Salad" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>
            {saladToken.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", marginTop: "20px" }}> 
        {activeTab === "Tap" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", marginTop: "40px" }}>
            
            {/* Green Coin Score (وسط صفحه) */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
              <img src="/currency-c.png" alt="Green Coin" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
              <span style={{ fontSize: "40px", fontWeight: "bold", color: "#fff" }}>
                {greenCoins.toLocaleString()}
              </span>
            </div>

            {/* Energy Bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 10px", marginBottom: "10px", alignSelf: "flex-start" }}>
              <span style={{ fontSize: "20px" }}>🔋</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>{energy} / 2000</span>
                <div style={{ width: "100px", height: "5px", backgroundColor: "#333", borderRadius: "3px", marginTop: "4px" }}>
                  <div style={{ width: `${(energy / 2000) * 100}%`, height: "100%", backgroundColor: "#4caf50", borderRadius: "3px", transition: "width 0.3s" }}></div>
                </div>
              </div>
            </div>

            {/* Ninja Area - حالا کل این بخش قابل کلیک است */}
<div 
  onClick={handleClick} // تابع کلیک از روی عکس به اینجا منتقل شد
  style={{ 
    flex: 1, 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: "-60px",
    width: "100%", // کل عرض صفحه را پوشش می‌دهد
    cursor: "pointer",
    touchAction: "manipulation" 
  }}
  onTouchStart={(e) => {
    // افکت کوچک شدن برای کل ناحیه یا فقط عکس
    const img = e.currentTarget.querySelector('img');
    if (img) img.style.transform = "scale(0.92)";
  }}
  onTouchEnd={(e) => {
    const img = e.currentTarget.querySelector('img');
    if (img) img.style.transform = "scale(1)";
  }}
>
  <div style={{ transition: "transform 0.05s ease" }}>
    <img 
      src="/coin.png" 
      alt="Ninja" 
      style={{ width: "260px", height: "auto", objectFit: "contain", pointerEvents: "none" }} 
    />
  </div>
</div>
          </div>
        ) : activeTab === "Mine" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h2 style={{ color: "#ffd700" }}>Market</h2>
            <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "15px", width: "85%", textAlign: "center" }}>
               <p>کارت‌های ارتقا به زودی...</p>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <h2>صفحه {activeTab}</h2>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "5px", alignItems: "flex-end", zIndex: 30 }}>
        {["Tap", "Mine", "Fight", "Library", "Cards"].map((label) => {
          const isActive = activeTab === label;
          const icons: { [key: string]: string } = {
            "Tap": "/tap-butt.png", "Mine": "/mine-butt.png", "Fight": "/fight-butt.png", "Library": "/closet-butt.png", "Cards": "/cards-butt.png"
          };
          return (
            <button key={label} onClick={() => setActiveTab(label)} style={{ flex: 1, backgroundColor: "transparent", border: "none", outline: "none", color: isActive ? "#ffd700" : "#888", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}>
              <img src={icons[label] || "/tap-butt.png"} alt={label} style={{ width: "35px", height: "35px", objectFit: "contain", filter: isActive ? "none" : "grayscale(100%)", opacity: isActive ? "1" : "0.6" }} />
              <span style={{ fontSize: "10px", fontWeight: isActive ? "bold" : "normal" }}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* QR & Boost Buttons */}
      {activeTab === "Tap" && (
        <>
          <button style={{ position: "absolute", bottom: "100px", left: "12%", transform: "translateX(-50%)", background: "none", border: "none", width: "35px", height: "35px", zIndex: 20 }}>
            <img src="/qr-butt.png" alt="QR" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </button>
          <button style={{ position: "absolute", bottom: "100px", right: "12%", transform: "translateX(50%)", background: "none", border: "none", width: "35px", height: "35px", zIndex: 20 }}>
            <img src="/boost-butt.png" alt="Boost" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </button>
        </>
      )}

      {/* Animations */}
      {floatingNumbers.map(num => (
        <div key={num.id} style={{ position: "fixed", left: num.x, top: num.y, transform: "translate(-50%, -100%)", fontSize: "2.5rem", fontWeight: "bold", color: "#FFD700", animation: "f 0.8s ease-out forwards", pointerEvents: "none", zIndex: 9999 }}>
          +1
        </div>
      ))}

      <style>{`
        @keyframes f { 0% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; transform: translate(-50%, -120px); } }
      `}</style>
    </div>
  );
}