"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
}

const TABS = ["Tap", "Mine", "Fight", "Library", "Cards"];

const CARDS_DATA = [
  { id: "arch-1", family: "archimedes", name: "Archimedes I", image: "/card-archimedes.png", cost: 500, profitBoost: 10, visibleAfter: null, requireToBuy: null },
  { id: "arch-2", family: "archimedes", name: "Archimedes II", image: "/card-archimedes.png", cost: 1200, profitBoost: 25, visibleAfter: "arch-1", requireToBuy: "arch-1" },
  { id: "eucl-1", family: "euclid", name: "Euclid I", image: "/card-euclid.png", cost: 2000, profitBoost: 50, visibleAfter: "arch-2", requireToBuy: "arch-2" },
];

export default function Home() {
  // --- States ---
  const [activeTab, setActiveTab] = useState("Tap");
  const [userName, setUserName] = useState("Ninja Player");
  const [greenCoins, setGreenCoins] = useState(0);
  const [redCoins, setRedCoins] = useState(0);
  const [orangeCoins, setOrangeCoins] = useState(0);
  const [saladToken, setSaladToken] = useState(0);
  const [energy, setEnergy] = useState(2000);
  const [isTapping, setIsTapping] = useState(false);
  const [isGreenActive, setIsGreenActive] = useState(false);
  const [isRedActive, setIsRedActive] = useState(false);
  const [isOrangeActive, setIsOrangeActive] = useState(false);
  const [greenProfit, setGreenProfit] = useState(1);
  const [redProfit, setRedProfit] = useState(0);
  const [orangeProfit, setOrangeProfit] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [isSaladPage, setIsSaladPage] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [purchasedCards, setPurchasedCards] = useState<string[]>([]); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const switchAudioRef = useRef<HTMLAudioElement | null>(null);
  const [lastSafeCoins, setLastSafeCoins] = useState(greenCoins);
 
  const [isMakingSalad, setIsMakingSalad] = useState(false); 
  const [saladStartTime, setSaladStartTime] = useState<number | null>(null); 
  const [progress, setProgress] = useState(0); 

  // --- سیستم ذخیره خودکار روی حافظه موبایل (LocalStorage) ---
  useEffect(() => {
    localStorage.setItem("greenCoins", greenCoins.toString());
    localStorage.setItem("redCoins", redCoins.toString());
    localStorage.setItem("orangeCoins", orangeCoins.toString());
    localStorage.setItem("saladToken", saladToken.toString());
    localStorage.setItem("totalProfit", totalProfit.toString());
    localStorage.setItem("purchasedCards", JSON.stringify(purchasedCards));
  }, [greenCoins, redCoins, orangeCoins, saladToken, totalProfit, purchasedCards]);
  
  const adjustValue = (type: string, amount: number) => {
    switch (type) {
      case 'green': setGreenCoins(prev => Math.max(0, prev + amount)); break;
      case 'red': setRedCoins(prev => Math.max(0, prev + amount)); break;
      case 'orange': setOrangeCoins(prev => Math.max(0, prev + amount)); break;
      case 'salad': setSaladToken(prev => Math.max(0, prev + amount)); break;
      case 'energy': setEnergy(prev => Math.max(0, Math.min(2000, prev + amount))); break;
    }
  };

  const handleStartSalad = () => {
    if (isMakingSalad) {
      alert("در حال حاضر یک سالاد در حال پخت است!");
      return;
    }
    if (greenCoins >= 1000 && redCoins >= 500 && orangeCoins >= 100) {
      setGreenCoins(prev => prev - 1000);
      setRedCoins(prev => prev - 500);
      setOrangeCoins(prev => prev - 100);
      setIsMakingSalad(true);
      setSaladStartTime(Date.now());
    } else {
      alert("سکه کافی ندارید!");
    }
  };
useEffect(() => {
  let interval: any;
  if (isMakingSalad && saladStartTime) {
    interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - saladStartTime;
      const oneHour = 60 * 60 * 1000; // ۳۶۰۰۰۰۰ میلی‌ثانیه
      const currentProgress = Math.min((elapsed / oneHour) * 100, 100);
      
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        setSaladToken(prev => prev + 1);
        setIsMakingSalad(false);
        setSaladStartTime(null);
        setProgress(0);
        clearInterval(interval);
      }
    }, 1000);
  }
  return () => clearInterval(interval);
}, [isMakingSalad, saladStartTime]);

useEffect(() => {
  const tele = (window as any).Telegram?.WebApp;
  if (tele) {
    tele.ready();
  }

  // --- جایگزینی لود کردن از تلگرام با لود کردن از حافظه موبایل (LocalStorage) ---
  const savedGreen = localStorage.getItem("greenCoins");
  const savedRed = localStorage.getItem("redCoins");
  const savedOrange = localStorage.getItem("orangeCoins");
  const savedSalad = localStorage.getItem("saladToken");
  const savedProfit = localStorage.getItem("totalProfit");
  const savedCards = localStorage.getItem("purchasedCards");

  if (savedGreen) setGreenCoins(Number(savedGreen));
  if (savedRed) setRedCoins(Number(savedRed));
  if (savedOrange) setOrangeCoins(Number(savedOrange));
  if (savedSalad) setSaladToken(Number(savedSalad));
  if (savedProfit) setTotalProfit(Number(savedProfit));
  if (savedCards) setPurchasedCards(JSON.parse(savedCards));

}, []);
  // --- Handlers ---
const handleSwipe = (direction: "left" | "right") => {
  const currentIndex = TABS.indexOf(activeTab);
  if (direction === "right" && currentIndex > 0) {
    setActiveTab(TABS[currentIndex - 1]);
  } else if (direction === "left" && currentIndex < TABS.length - 1) {
    setActiveTab(TABS[currentIndex + 1]);
  }
};

// تابع خرید کارت اصلاح شده (بدون نیاز به ذخیره دستی در تلگرام)
const handleBuyCard = (card: any) => {
  // ۱. بررسی پیش‌شرط
  if (card.requireToBuy && !purchasedCards.includes(card.requireToBuy)) {
    alert("ابتدا باید کارت قبلی را بخرید!");
    return;
  }
  
  // بررسی موجودی کافی
  if (greenCoins < card.cost) {
    alert("سکه کافی ندارید!");
    return;
  }

  // ۲. آپدیت استیت‌های بازی (ذخیره‌سازی به صورت خودکار توسط useEffect قطعه اول انجام می‌شود)
  setGreenCoins(prev => prev - card.cost);
  setPurchasedCards(prev => [...prev, card.id]);
  setTotalProfit(prev => prev + card.profitBoost);
};

// نوار سالادسازی 
useEffect(() => {
  let interval: any;
  if (isMakingSalad && saladStartTime) {
    interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - saladStartTime;
      const oneHour = 60 * 60 * 1000;
      const currentProgress = Math.min((elapsed / oneHour) * 100, 100);
      
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        setSaladToken(prev => prev + 1);
        setIsMakingSalad(false);
        setSaladStartTime(null);
        setProgress(0);
        clearInterval(interval);
        alert("سالاد شما آماده شد!");
      }
    }, 1000);
  }
  
  return () => clearInterval(interval);
}, [isMakingSalad, saladStartTime]);

 useEffect(() => {
    audioRef.current = new Audio("/click.mp3");
    switchAudioRef.current = new Audio("/switch.mp3");
    switchAudioRef.current.volume = 0.5;

    // بارگذاری از حافظه گوشی با کلیدهای یکسان
    const savedGreen = localStorage.getItem("greenCoins");
    if (savedGreen) setGreenCoins(parseInt(savedGreen));
    const savedRed = localStorage.getItem("redCoins");
    if (savedRed) setRedCoins(parseInt(savedRed));
    const savedOrange = localStorage.getItem("orangeCoins");
    if (savedOrange) setOrangeCoins(parseInt(savedOrange));
    const savedSalad = localStorage.getItem("saladToken"); // اصلاح نام کلید
    if (savedSalad) setSaladToken(parseInt(savedSalad));
    const savedCards = localStorage.getItem("purchasedCards");
    if (savedCards) setPurchasedCards(JSON.parse(savedCards));
    const savedProfit = localStorage.getItem("totalProfit");
    if (savedProfit) setTotalProfit(parseInt(savedProfit));
  }, []);

  // Timer for Mining
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 1, 2000));
      if (isGreenActive) setGreenCoins(prev => prev + greenProfit);
      if (isRedActive) setRedCoins(prev => prev + redProfit);
      if (isOrangeActive) setOrangeCoins(prev => prev + orangeProfit);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGreenActive, isRedActive, isOrangeActive, greenProfit, redProfit, orangeProfit]);

  const playSwitchSound = () => {
    if (switchAudioRef.current) {
      switchAudioRef.current.currentTime = 0;
      switchAudioRef.current.play().catch(() => {});
    }
  };

  // بخش Security Breach حذف شد چون دیگر با ابر تلگرام مقایسه نمی‌کنیم

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (energy <= 0) return;
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 100);
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
      
      {!isSaladPage ? (
        <>
          {/* Main Container with Swipe */}
          <motion.div 
            key={activeTab}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            dragMomentum={false} 
            onDragEnd={(e, info) => {
              const threshold = 40; 
              if (info.offset.x < -threshold) handleSwipe("left");
              if (info.offset.x > threshold) handleSwipe("right");
            }}
            style={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              width: "100%",
              touchAction: "pan-y" 
            }}
          >
          
           {/* Cards Tab */}
 {activeTab === "Cards" && (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
    {CARDS_DATA.filter(card => 
      card.visibleAfter === null || purchasedCards.includes(card.visibleAfter)
    ).map(card => {
      const alreadyBought = purchasedCards.includes(card.id);
      const isLocked = !!(card.requireToBuy && !purchasedCards.includes(card.requireToBuy));

      return (
        <div key={card.id} style={{ 
          background: "#222", 
          borderRadius: "15px", 
          padding: "10px", 
          opacity: alreadyBought ? 0.6 : 1,
          filter: isLocked ? "grayscale(1)" : "none",
          textAlign: "center"
        }}>
          <img src={card.image} style={{ width: "100%", borderRadius: "10px" }} alt={card.name} />
          <h4>{card.name}</h4>
          <p style={{ fontSize: "12px", color: "#4CAF50" }}>+{card.profitBoost} P/h</p>
          
          <button 
            disabled={alreadyBought || isLocked}
            onClick={() => handleBuyCard(card)}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: alreadyBought ? "#444" : isLocked ? "#666" : "#ffd700",
              color: "#000",
              borderRadius: "10px",
              border: "none",
              fontWeight: "bold"
            }}
          >
            {alreadyBought ? "Owned" : isLocked ? "Locked 🔒" : `${card.cost.toLocaleString()} 🟢`}
          </button>
        </div>
      );
    })}
  </div>
)}

{/* Tap Tab */}
{activeTab === "Tap" && (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: "40px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 15px", position: "absolute", top: 0, left: 0, boxSizing: "border-box", zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(255,255,255,0.05)", padding: "5px 10px", borderRadius: "12px" }}>
        <div style={{ width: "35px", height: "35px", borderRadius: "50%", border: "2px solid #ffd700", overflow: "hidden" }}>
          <img src="/coin.png" style={{ width: "100%" }} />
        </div>
        <div>
          <span style={{ fontSize: "12px", display: "block" }}>{userName}</span>
          <span style={{ fontSize: "11px", color: "#ffd700" }}>Lv. 1</span>
        </div>
      </div>
      <div onClick={() => setIsSaladPage(true)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(73, 73, 73, 0.5)", padding: "5px 12px", borderRadius: "15px" }}>
        <span>{saladToken.toLocaleString()}</span>
        <img src="/salad-token.png" style={{ width: "35px", height: "28px" }} />
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" }}>
      <img src="/currency-c.png" style={{ width: "50px" }} />
      <span style={{ fontSize: "40px", fontWeight: "bold" }}>{greenCoins.toLocaleString()}</span>
    </div>
    <div style={{ padding: "10px" }}>
      <span style={{ fontSize: "12px" }}>🔋 {energy} / 2000</span>
      <div style={{ width: "100px", height: "5px", backgroundColor: "#333", borderRadius: "3px", marginTop: "5px" }}>
        <div style={{ width: `${(energy / 2000) * 100}%`, height: "100%", backgroundColor: "#4caf50", borderRadius: "3px" }}></div>
      </div>
    </div>
    <div onClick={handleClick} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", marginTop: "-100px" }}>
      <img src="/coin.png" style={{ width: "260px", transform: isTapping ? "scale(0.92)" : "scale(1)", transition: "0.05s" }} />
    </div>
    <>
      <button onClick={() => setActiveTab("QR")} style={{ position: "absolute", bottom: "100px", left: "12%", background: "none", border: "none" }}>
        <img src="/qr-butt.png" style={{ width: "35px" }} />
      </button>
      <button onClick={() => setActiveTab("Boost")} style={{ position: "absolute", bottom: "100px", right: "12%", background: "none", border: "none" }}>
        <img src="/boost-butt.png" style={{ width: "35px" }} />
      </button>
    </>
  </div>
)}

{/* بخش Debug/QR - هماهنگ با ذخیره‌سازی */}
{activeTab === "QR" && (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", color: "white" }}>
    <h2 style={{ marginBottom: "20px" }}>Test & Debug</h2>
    <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "20px", width: "100%", border: "1px solid rgba(255,255,255,0.1)" }}>
      {[
        { label: "Green Coins", key: "green", color: "#4CAF50" },
        { label: "Red Coins", key: "red", color: "#F44336" },
        { label: "Orange Coins", key: "orange", color: "#FF9800" },
        { label: "Salad Count", key: "salad", color: "#FFEB3B" },
        { label: "Energy", key: "energy", color: "#2196F3" }
      ].map((item) => (
        <div key={item.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
          <span style={{ color: item.color, fontWeight: "bold" }}>{item.label}</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => adjustValue(item.key, -100)} style={{ background: "#444", color: "#fff", border: "none", borderRadius: "8px", padding: "5px 12px" }}>-100</button>
            <button onClick={() => adjustValue(item.key, 100)} style={{ background: "#444", color: "#fff", border: "none", borderRadius: "8px", padding: "5px 12px" }}>+100</button>
          </div>
        </div>
      ))}
      {/* دکمه پاک کردن کل حافظه برای تست */}
      <button 
        onClick={() => { localStorage.clear(); window.location.reload(); }}
        style={{ width: "100%", marginTop: "10px", padding: "10px", backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: "10px" }}
      >
        Reset All Data (Danger)
      </button>
    </div>
  </div>
)}

{/* Boost Tab */}
{activeTab === "Boost" && (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", color: "white", backgroundImage: "url('/boost-back.jpg')", backgroundSize: "cover", backgroundPosition: "center", overflowY: "auto", width: "100%", height: "100vh" }}>
    <button onClick={() => setActiveTab("Tap")} style={{ position: "absolute", top: "20px", left: "20px", background: "none", border: "none", zIndex: 110, cursor: "pointer" }}>
      <img src="/back-butt.png" style={{ width: "20px", height: "auto" }} />
    </button>
    <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "30px" }}>Boost</h2>
    {/* باقی محتوای بوست طبق کد شما ثابت است */}
  </div>
)}
            {activeTab === "Mine" && (
  <div style={{ 
        flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    padding: "0px",
    position: "relative", 
    height: "100%", 
    overflow: "hidden",
    backgroundColor: "#1a1a1a"

  }}>
    {/* ۱. بخش موجودی‌ها (بالا) */}
    <div style={{ 
    width: "100%", 
    backgroundColor: "rgba(0,0,0,0.8)", 
    backdropFilter: "blur(12px)", 
    borderRadius: "0 0 30px 30px", 
    padding: "20px 15px",
    opacity: 0.8, 
    zIndex: 10,
    borderBottom: "2px solid rgba(255,215,0,0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
}}>
    {/* radife seke ha*/}
    <div style={{ display: "flex", justifyContent: "space-around", width: "100%", marginBottom: "2px", alignItems: "flex-start" }}>
    
    {/* sotoone seke haye sabz*/}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img src="/currency-c.png" style={{width: "18px"}}/>
            <span style={{fontSize: "13px", fontWeight: "bold"}}>{greenCoins.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
            {greenProfit * 60}/m
        </div>
        <div style={{ fontSize: "10px", color: "#fff", opacity: 0.6, marginTop: "2px" }}>
        </div>
    </div>

    {/* sotone seke haye ghermez*/}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img src="/currency-r.png" style={{width: "18px"}}/>
            <span style={{fontSize: "13px", fontWeight: "bold"}}>{redCoins.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
            {redProfit * 60}/m
        </div>
        {/* tanzime zamane offline baraye baghie seke ha*/}
        <div style={{ height: "12px" }}></div> 
    </div>

    {/* sotone seke narenji*/}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img src="/currency-t.png" style={{width: "18px"}}/>
            <span style={{fontSize: "13px", fontWeight: "bold"}}>{orangeCoins.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
            {orangeProfit * 60}/m
        </div>
        <div style={{ height: "12px" }}></div>
    </div>
</div>

    {/* radife profit va zaman*/}
    <div style={{ 
        width: "90%", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "10px"
    }}>
        <div style={{ color: "#ffd700", fontSize: "15px", fontWeight: "bold" }}>
    Profit: {totalProfit.toLocaleString()}
</div>
        <div style={{ color: "#fff", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>🕒</span>
            <span>5min</span>
        </div>
    </div>

    {/* namayeshgare bozorge hoshmand*/}
<div style={{ 
    display: "flex", 
    alignItems: "center", 
    gap: "12px",
    backgroundColor: "rgba(255,215,0,0.1)",
    padding: "5px 30px",
    borderRadius: "20px",
    border: `1px solid ${isRedActive ? "#f44336" : isOrangeActive ? "#ff9800" : "#4CAF50"}`, // تغییر رنگ مرز بر اساس فعالیت
    width: "fit-content"
}}>
    {/* taghiire khodkare icon*/}
    <img 
        src={isRedActive ? "/currency-r.png" : isOrangeActive ? "/currency-t.png" : "/currency-c.png"} 
        style={{ width: "30px", height: "30px" }} 
    />
    {/* taghiire khodkare adad*/}
    <span style={{ fontSize: "28px", fontWeight: "900", color: "#fff" }}>
        {isRedActive ? redCoins.toLocaleString() : isOrangeActive ? orangeCoins.toLocaleString() : greenCoins.toLocaleString()}
    </span>
</div>
</div>

    {/* ۲. عکس ربات (بخش مرکزی) */}
    <div style={{
              position: "absolute",
              top: "0%",
              left: "0%",
              width: "100%",
              height: "100%",
              opacity: 0.8,
              zIndex: 0,      // raftan poshte elemanha
              pointerEvents: "none"
            }}>
              <img src="/chef-robot.jpg" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>

    {/* ۳. بخش کارتریج‌ها (قفل شده به پایین صفحه) */}
                {/* hol dadne kartrij ha be paiin*/}
            <div style={{ flex: 1 }} /> 

    {/* kartrij ha*/}
<div style={{ 
  width: "90%", 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "flex-end",
  gap: "25px", 
  zIndex: 5,
  marginBottom: "50px",
  padding: "15px",
  borderRadius: "20px"
}}>
  {/* کارتریج سبز */}
  <img 
    onClick={() => {setIsGreenActive(!isGreenActive); setIsRedActive(false); setIsOrangeActive(false); playSwitchSound();}} 
    src={isGreenActive ? "/cartridge-green-on.png" : "/cartridge-green-off.png"} 
    style={{ 
      width: "75px", 
      cursor: "pointer",
      filter: isGreenActive ? "drop-shadow(0 0 15px rgba(76, 175, 80, 0.8))" : "none",
      transition: "0.3s"
    }} 
  />

  {/* کارتریج قرمز */}
  <img 
    onClick={() => {setIsRedActive(!isRedActive); setIsGreenActive(false); setIsOrangeActive(false); playSwitchSound();}} 
    src={isRedActive ? "/cartridge-red-on.png" : "/cartridge-red-off.png"} 
    style={{ 
      width: "75px", 
      cursor: "pointer",
      filter: isRedActive ? "drop-shadow(0 0 15px rgba(244, 67, 54, 0.8))" : "none",
      transition: "0.3s"
    }} 
  />

  {/* کارتریج نارنجی */}
  <img 
    onClick={() => {setIsOrangeActive(!isOrangeActive); setIsGreenActive(false); setIsRedActive(false); playSwitchSound();}} 
    src={isOrangeActive ? "/cartridge-orange-on.png" : "/cartridge-orange-off.png"} 
    style={{ 
      width: "75px", 
      cursor: "pointer",
      filter: isOrangeActive ? "drop-shadow(0 0 15px rgba(255, 152, 0, 0.8))" : "none",
      transition: "0.3s"
    }} 
  />
</div>
  </div>
)}

           {/* Other Tabs placeholder */}
 {(activeTab === "Fight" || activeTab === "Library") && (
   <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
     <h2 style={{ color: "#555" }}>صفحه {activeTab} (بزودی)</h2>
   </div>
 )}
 </motion.div>

 {/* Footer Navigation (Fixed) */}
 <div style={{ 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center",
  width: "100%",
  gap: "20px", 
  zIndex: 30, 
  paddingBottom: "15px",
  position: "absolute",
  bottom: 0,
  left: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", // اضافه شدن سایه برای خوانایی بهتر
  paddingTop: "20px"
 }}>
  {TABS.map((label) => {
    const isActive = activeTab === label;
    const footerIcons: { [key: string]: string } = {
      "Tap": "/tap-butt.png", 
      "Mine": "/mine-butt.png", 
      "Fight": "/fight-butt.png", 
      "Library": "/closet-butt.png", 
      "Cards": "/cards-butt.png"
    };
    return (
      <button 
        key={label} 
        onClick={() => { setActiveTab(label); playSwitchSound(); }} 
        style={{ 
          background: "none", 
          border: "none", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          padding: "5px",
          cursor: "pointer"
        }}
      >
        <img 
          src={footerIcons[label]} 
          style={{ 
            height: "40px", 
            filter: isActive ? "none" : "grayscale(100%)", 
            opacity: isActive ? 1 : 0.6,
            transform: isActive ? "scale(1.1)" : "scale(1)",
            transition: "0.2s" 
          }} 
        />
      </button>
    );
  })}
 </div>
 </>
 ) : (
  /* --- Salad Page --- */
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#000" }}>
    
    {isSaladPage && (
      <div style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100vh", 
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('/salad-back.jpg')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        zIndex: 100, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        color: "white" 
      }}>
        
        <button onClick={() => setIsSaladPage(false)} style={{ position: "absolute", top: "20px", left: "20px", background: "none", border: "none", zIndex: 110 }}>
          <img src="/back-butt.png" style={{ width: "20px" }} />
        </button>

        {/* ۱. بخش تعداد سالاد */}
        <div style={{ 
          marginTop: "100px", 
          display: "flex",
          backgroundColor: "rgba(0,0,0,0.5)", 
          padding: "10px 20px",
          borderRadius: "15px",
          flexDirection: "row-reverse", 
          alignItems: "center", 
          gap: "10px" 
        }}>
          <img src="/salad-token.png" style={{ width: "50px" }} alt="Salad Token" />
          <span style={{ fontSize: "24px", fontWeight: "bold" }}>{saladToken.toLocaleString()}</span>
        </div>

        {/* ۲. موجودی فعلی سکه‌ها */}
        <div style={{ display: "flex", gap: "15px", marginTop: "20px", backgroundColor: "rgba(0,0,0,0.5)", padding: "10px 20px", borderRadius: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><img src="/currency-c.png" style={{ width: "18px" }} />{greenCoins.toLocaleString()}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><img src="/currency-r.png" style={{ width: "18px" }} />{redCoins.toLocaleString()}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><img src="/currency-t.png" style={{ width: "18px" }} />{orangeCoins.toLocaleString()}</div>
        </div>

        {/* ۳. هزینه ساخت */}
        <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start", backgroundColor: "rgba(0,0,0,0.5)", padding: "10px 20px", borderRadius: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "18px", color: greenCoins >= 1000 ? "#fff" : "#ff4d4d" }}>
            <img src="/currency-c.png" style={{ width: "22px" }} /> 1,000
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "18px", color: redCoins >= 500 ? "#fff" : "#ff4d4d" }}>
            <img src="/currency-r.png" style={{ width: "22px" }} /> 500
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "18px", color: orangeCoins >= 100 ? "#fff" : "#ff4d4d" }}>
            <img src="/currency-t.png" style={{ width: "22px" }} /> 100
          </div>
        </div>

        {/* ۴. کاسه سالاد بزرگ و نوار پیشرفت */}
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img 
            src="/salad-token.png" 
            onClick={handleStartSalad}
            style={{ 
              width: "120px", 
              cursor: "pointer", 
              filter: `drop-shadow(0px 8px 10px rgba(0,0,0,0.4)) ${isMakingSalad ? "grayscale(80%)" : "none"}`, 
              transform: isMakingSalad ? "scale(1)" : "scale(1.1)",
              transition: "0.3s"
            }} 
          />
          
          <div style={{ width: "250px", height: "12px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "10px", marginTop: "20px", overflow: "hidden", border: "1px solid #fff" }}>
            <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#4CAF50", transition: "width 1s linear" }} />
          </div>
          <span style={{ marginTop: "8px", fontSize: "12px", fontWeight: "bold" }}>
            {isMakingSalad ? `در حال آماده‌سازی (${Math.floor(progress)}%)` : "برای شروع پخت کلیک کنید"}
          </span>
        </div>
      </div>
    )}
  </div>
 )}

 {floatingNumbers.map(num => (
   <div key={num.id} style={{ position: "fixed", left: num.x, top: num.y, color: "#ffd700", fontSize: "32px", fontWeight: "bold", animation: "f 0.8s forwards", pointerEvents: "none", zIndex: 1000 }}>
     +1
   </div>
 ))}
      <style>{`@keyframes f { 0%{opacity:1; transform:translateY(0)} 100%{opacity:0; transform:translateY(-100px)} }`}</style>
    </div>
  );
}

