"use client";

import { useState, useEffect, useRef } from "react";

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
}

export default function Home() {
  // --- States ---
  const [activeTab, setActiveTab] = useState("Tap");
  const [userName, setUserName] = useState("Ninja Player");
  const [greenCoins, setGreenCoins] = useState(0);
  const [redCoins, setRedCoins] = useState(0);
  const [orangeCoins, setOrangeCoins] = useState(0);
  const [saladToken, setSaladToken] = useState(0);
  const [energy, setEnergy] = useState(2000);

  const [isGreenOn, setIsGreenOn] = useState(true);
  const [isRedOn, setIsRedOn] = useState(false);
  const [isOrangeOn, setIsOrangeOn] = useState(false);

  const [greenProfit, setGreenProfit] = useState(1);
  const [redProfit, setRedProfit] = useState(0);
  const [orangeProfit, setOrangeProfit] = useState(0);

  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ۱. بارگذاری اطلاعات و محاسبه غیبت (Offline System)
  useEffect(() => {
    audioRef.current = new Audio("/click.mp3");

    const savedGreen = localStorage.getItem("ninjaGreenCoins");
    if (savedGreen) setGreenCoins(parseInt(savedGreen));

    const savedRed = localStorage.getItem("ninjaRedCoins");
    if (savedRed) setRedCoins(parseInt(savedRed));

    const savedOrange = localStorage.getItem("ninjaOrangeCoins");
    if (savedOrange) setOrangeCoins(parseInt(savedOrange));

    const savedSalad = localStorage.getItem("ninjaSalad");
    if (savedSalad) setSaladToken(parseInt(savedSalad));

    const savedEnergy = localStorage.getItem("ninjaEnergy");
    const lastTime = localStorage.getItem("lastTime");

    if (savedEnergy && lastTime) {
      const currentTime = Date.now();
      const secondsPassed = Math.floor((currentTime - parseInt(lastTime)) / 1000);
      
      // منطق ۵ دقیقه سود آفلاین (۳۰۰ ثانیه)
      const offlineSeconds = Math.min(300, secondsPassed);
      
      setEnergy(Math.min(2000, parseInt(savedEnergy) + secondsPassed));
      setGreenCoins(prev => prev + (offlineSeconds * greenProfit));
      if (isRedOn) setRedCoins(prev => prev + (offlineSeconds * redProfit));
    } else if (savedEnergy) {
      setEnergy(parseInt(savedEnergy));
    }

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

  // ۲. ذخیره‌سازی خودکار در localStorage
  useEffect(() => {
    localStorage.setItem("ninjaGreenCoins", greenCoins.toString());
    localStorage.setItem("ninjaRedCoins", redCoins.toString());
    localStorage.setItem("ninjaOrangeCoins", orangeCoins.toString());
    localStorage.setItem("ninjaEnergy", energy.toString());
    localStorage.setItem("ninjaSalad", saladToken.toString());
    localStorage.setItem("lastTime", Date.now().toString());
  }, [greenCoins, redCoins, orangeCoins, energy, saladToken]);

  // ۳. تایمر تولید ثانیه‌ای (آنلاین)
  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prev) => (prev < 2000 ? prev + 1 : 2000));
      if (isGreenOn) setGreenCoins(prev => prev + greenProfit);
      if (isRedOn) setRedCoins(prev => prev + redProfit);
      if (isOrangeOn) setOrangeCoins(prev => prev + orangeProfit);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGreenOn, isRedOn, isOrangeOn, greenProfit, redProfit, orangeProfit]);

  // --- Handlers ---
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (energy <= 0) return;
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
    setTimeout(() => setFloatingNumbers(prev => prev.filter(n => n.id !== newNum.id)), 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#1a1a1a", color: "white", fontFamily: "sans-serif", padding: "20px", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 15px", position: "absolute", top: 0, left: 0, boxSizing: "border-box", zIndex: 10 }}>
        <div onClick={() => setActiveTab("Level")} style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(255,255,255,0.05)", padding: "5px 10px", borderRadius: "12px", cursor: "pointer" }}>
          <div style={{ width: "35px", height: "35px", borderRadius: "50%", border: "2px solid #ffd700", overflow: "hidden", backgroundColor: "#333" }}>
            <img src="/coin.png" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#ccc" }}>{userName}</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#ffd700" }}>Lv. 1</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(0,0,0,0.4)", padding: "5px 12px", borderRadius: "20px", height: "35px" }}>
          <img src="/salad-butt.png" alt="Salad" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>{saladToken.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", marginTop: "40px" }}>
        
        {activeTab === "Tap" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" }}>
              <img src="/currency-c.png" alt="Green Coin" style={{ width: "50px" }} />
              <span style={{ fontSize: "40px", fontWeight: "bold" }}>{greenCoins.toLocaleString()}</span>
            </div>
            <div style={{ padding: "10px" }}>
              <span style={{ fontSize: "12px" }}>🔋 {energy} / 2000</span>
              <div style={{ width: "100px", height: "5px", backgroundColor: "#333", borderRadius: "3px" }}>
                <div style={{ width: `${(energy / 2000) * 100}%`, height: "100%", backgroundColor: "#4caf50", borderRadius: "3px" }}></div>
              </div>
            </div>
            <div onClick={handleClick} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
              <img src="/coin.png" style={{ width: "260px" }} />
            </div>
          </div>
        ) : activeTab === "Mine" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px" }}>
            <div style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                   <div><img src="/currency-c.png" style={{width: "20px"}}/><p>{greenCoins}</p></div>
                   <div><img src="/currency-r.png" style={{width: "20px"}}/><p>{redCoins}</p></div>
                   <div><img src="/currency-t.png" style={{width: "20px"}}/><p>{orangeCoins}</p></div>
                </div>
                <h3 style={{textAlign: "center", color: "#ffd700", margin: "10px 0"}}>Profit: {greenProfit + redProfit + orangeProfit}/s</h3>
            </div>
            <div style={{flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative"}}>
                <img src="/chef-robot.png" style={{width: "90%", maxWidth: "320px"}} />
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                   <img src={isGreenOn ? "/cartridge-green-on.png" : "/cartridge-green-off.png"} style={{width: "55px"}} />
                   <img src={isRedOn ? "/cartridge-red-on.png" : "/cartridge-red-off.png"} style={{width: "55px", opacity: isRedOn ? 1 : 0.4}} />
                </div>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width: "100%", marginBottom: "80px"}}>
               <button onClick={() => { if(greenCoins >= 100) { setGreenCoins(g=>g-100); setGreenProfit(p=>p+1); }}} style={{padding: "10px", backgroundColor: "#333", color: "white", borderRadius: "12px", border: "1px solid #444"}}>Upgrade Green<br/>💰 100</button>
               <button onClick={() => { if(greenCoins >= 500 && !isRedOn) { setGreenCoins(g=>g-500); setIsRedOn(true); setRedProfit(1); }}} style={{padding: "10px", backgroundColor: "#333", color: "white", borderRadius: "12px", border: "1px solid #444"}}>Unlock Red<br/>💰 500</button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <h2>صفحه {activeTab}</h2>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "5px", alignItems: "flex-end", zIndex: 30, paddingBottom: "10px" }}>
        {["Tap", "Mine", "Fight", "Library", "Cards"].map((label) => {
          const isActive = activeTab === label;
          const footerIcons: { [key: string]: string } = {
            "Tap": "/tap-butt.png", "Mine": "/mine-butt.png", "Fight": "/fight-butt.png", "Library": "/closet-butt.png", "Cards": "/cards-butt.png"
          };
          return (
            <button key={label} onClick={() => setActiveTab(label)} style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}>
              <img src={footerIcons[label]} alt={label} style={{ width: "35px", height: "35px", filter: isActive ? "none" : "grayscale(100%)", opacity: isActive ? "1" : "0.6" }} />
              <span style={{ fontSize: "10px", color: isActive ? "#ffd700" : "#888" }}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* QR & Boost Buttons */}
      {activeTab === "Tap" && (
        <>
          <button onClick={() => setActiveTab("QR")} style={{ position: "absolute", bottom: "100px", left: "12%", background: "none", border: "none" }}>
            <img src="/qr-butt.png" style={{ width: "35px" }} />
          </button>
          <button onClick={() => setActiveTab("Boost")} style={{ position: "absolute", bottom: "100px", right: "12%", background: "none", border: "none" }}>
            <img src="/boost-butt.png" style={{ width: "35px" }} />
          </button>
        </>
      )}

      {/* Floating Numbers Animation */}
      {floatingNumbers.map(num => (
        <div key={num.id} style={{ position: "fixed", left: num.x, top: num.y, color: "#ffd700", animation: "f 0.8s forwards", pointerEvents: "none", zIndex: 1000 }}>+1</div>
      ))}

      <style>{`@keyframes f { 0%{opacity:1; transform:translateY(0)} 100%{opacity:0; transform:translateY(-100px)} }`}</style>
    </div>
  );
}