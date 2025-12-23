"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // اضافه شدن ایمپورت موشن

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
  // اصلاح شده: حالا اقلیدس منتظر کارت شماره ۲ می‌ماند نه ۵
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
  const [purchasedCards, setPurchasedCards] = useState<string[]>([]); // آی‌دی کارت‌های خریده شده
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const switchAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- Handlers ---
  const handleSwipe = (direction: "left" | "right") => {
    const currentIndex = TABS.indexOf(activeTab);
    if (direction === "right" && currentIndex > 0) {
      setActiveTab(TABS[currentIndex - 1]);
    } else if (direction === "left" && currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1]);
    }
  };

  const handleBuyCard = (card: any) => {
    // ۱. بررسی موجودی
    if (greenCoins < card.cost) {
      alert("سکه سبز کافی نداری!");
      return;
    }
    
    // ۲. بررسی پیش‌شرط خرید
    if (card.requireToBuy && !purchasedCards.includes(card.requireToBuy)) {
      alert("ابتدا باید کارت قبلی را بخرید!");
      return;
    }

    // ۳. اعمال خرید
    setGreenCoins(prev => prev - card.cost);
    setPurchasedCards(prev => [...prev, card.id]);
    setTotalProfit(prev => prev + card.profitBoost);
  };

  useEffect(() => {
    audioRef.current = new Audio("/click.mp3");
    switchAudioRef.current = new Audio("/switch.mp3");
    switchAudioRef.current.volume = 0.5;

    // Loading from LocalStorage
    const savedGreen = localStorage.getItem("ninjaGreenCoins");
    if (savedGreen) setGreenCoins(parseInt(savedGreen));
    const savedRed = localStorage.getItem("ninjaRedCoins");
    if (savedRed) setRedCoins(parseInt(savedRed));
    const savedOrange = localStorage.getItem("ninjaOrangeCoins");
    if (savedOrange) setOrangeCoins(parseInt(savedOrange));
    const savedSalad = localStorage.getItem("ninjaSalad");
    if (savedSalad) setSaladToken(parseInt(savedSalad));
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
  dragMomentum={false} // در موبایل مانع از پرش ناگهانی می‌شود
  onDragEnd={(e, info) => {
    const threshold = 40; // حساسیت حرکت
    if (info.offset.x < -threshold) handleSwipe("left");
    if (info.offset.x > threshold) handleSwipe("right");
  }}
  style={{ 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    width: "100%",
    touchAction: "pan-y" // این خط کلید حل مشکل است! اجازه می‌دهد اسکرول عمودی کار کند ولی افقی را به Swipe می‌سپارد
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
            {alreadyBought ? "Owned" : isLocked ? "Locked 🔒" : `${card.cost} 🟢`}
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
                  <div style={{ width: "100px", height: "5px", backgroundColor: "#333", borderRadius: "3px" }}>
                    <div style={{ width: `${(energy / 2000) * 100}%`, height: "100%", backgroundColor: "#4caf50" }}></div>
                  </div>
                </div>
                <div onClick={handleClick} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", marginTop: "-100px" }}>
                  <img src="/coin.png" style={{ width: "260px", transform: isTapping ? "scale(0.92)" : "scale(1)", transition: "0.05s" }} />
                </div>
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
              <img src="/chef-robot.png" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
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
                <h2>صفحه {activeTab}</h2>
              </div>
            )}
          </motion.div>

         {/* Footer Navigation (Fixed) */}
<div style={{ 
  display: "flex", 
  justifyContent: "center", // تغییر از space-between به center برای تمرکز بهتر
  alignItems: "center",
  width: "100%",           // حیاتی برای وسط‌چین شدن در کل عرض صفحه
  gap: "30px", 
  zIndex: 30, 
  paddingBottom: "15px",
  position: "absolute",    // اگر می‌خواهی همیشه ته صفحه بماند
  bottom: 0,
  left: 0
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
        onClick={() => setActiveTab(label)} 
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
            width: "40px", // کمی بزرگتر برای دسترسی بهتر
            filter: isActive ? "none" : "grayscale(100%)", 
            opacity: isActive ? 1 : 0.6,
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
          <button onClick={() => setIsSaladPage(false)} style={{ padding: "10px 20px", backgroundColor: "#ffd700", borderRadius: "10px", fontWeight: "bold" }}>🔙 Back</button>
          <h2 style={{ marginTop: "20px" }}>Salad Shop</h2>
        </div>
      )}

      {/* Overlays */}
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

      {floatingNumbers.map(num => (
        <div key={num.id} style={{ position: "fixed", left: num.x, top: num.y, color: "#ffd700", fontSize: "32px", fontWeight: "bold", animation: "f 0.8s forwards", pointerEvents: "none", zIndex: 1000 }}>
          +1
        </div>
      ))}
      <style>{`@keyframes f { 0%{opacity:1; transform:translateY(0)} 100%{opacity:0; transform:translateY(-100px)} }`}</style>
    </div>
  );
}