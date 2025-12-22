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
  {
    id: 1,
    name: "Industrial Blender",
    description: "افزایش سرعت تولید سکه سبز",
    cost: 500,
    target: "greenProfit",
    boost: 2,
    icon: "🌪️"
  },
  {
    id: 2,
    name: "Red Cooling System",
    description: "افزایش سرعت تولید سکه قرمز",
    cost: 2000,
    target: "redProfit",
    boost: 5,
    icon: "❄️"
  },
  {
    id: 3,
    name: "Turbo Toaster",
    description: "افزایش سرعت تولید سکه نارنجی",
    cost: 5000,
    target: "orangeProfit",
    boost: 10,
    icon: "🔥"
  }
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

  const handleBuyCard = (card: typeof CARDS_DATA[0]) => {
    if (greenCoins < card.cost) {
      alert("سکه سبز کافی نداری!");
      return;
    }
    setGreenCoins(prev => prev - card.cost);
    if (card.target === "greenProfit") setGreenProfit(prev => prev + card.boost);
    if (card.target === "redProfit") setRedProfit(prev => prev + card.boost);
    if (card.target === "orangeProfit") setOrangeProfit(prev => prev + card.boost);
    setTotalProfit(prev => prev + (card.boost * 10));
    alert(`${card.name} با موفقیت خریداری شد!`);
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
              <div style={{ flex: 1, padding: "20px", overflowY: "auto", paddingBottom: "100px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Upgrades</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  {CARDS_DATA.map((card) => (
                    <div key={card.id} style={{ background: "#222", padding: "15px", borderRadius: "20px", border: "1px solid #333", textAlign: "center" }}>
                      <div style={{ fontSize: "35px" }}>{card.icon}</div>
                      <div style={{ fontWeight: "bold", margin: "10px 0" }}>{card.name}</div>
                      <div style={{ color: "#4CAF50", fontSize: "12px" }}>+{card.boost * 60}/m</div>
                      <button 
                        onClick={() => handleBuyCard(card)}
                        style={{ marginTop: "10px", width: "100%", padding: "8px", borderRadius: "12px", backgroundColor: greenCoins >= card.cost ? "#ffd700" : "#444", border: "none", fontWeight: "bold" }}
                      >
                        {card.cost} 🟢
                      </button>
                    </div>
                  ))}
                </div>
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

            {/* Mine Tab */}
            {activeTab === "Mine" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#1a1a1a" }}>
                <div style={{ width: "100%", backgroundColor: "rgba(0,0,0,0.8)", padding: "20px 15px", borderRadius: "0 0 30px 30px", zIndex: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div><img src="/currency-c.png" style={{width: "18px"}}/> {greenCoins}</div>
                    <div><img src="/currency-r.png" style={{width: "18px"}}/> {redCoins}</div>
                    <div><img src="/currency-t.png" style={{width: "18px"}}/> {orangeCoins}</div>
                  </div>
                </div>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 0 }}>
                  <img src="/chef-robot.png" style={{ width: "100%" }} />
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ display: "flex", gap: "15px", marginBottom: "20px", zIndex: 5 }}>
                  <img onClick={() => {setIsGreenActive(!isGreenActive); setIsRedActive(false); setIsOrangeActive(false); playSwitchSound();}} src={isGreenActive ? "/cartridge-green-on.png" : "/cartridge-green-off.png"} style={{ width: "75px" }} />
                  <img onClick={() => {setIsRedActive(!isRedActive); setIsGreenActive(false); setIsOrangeActive(false); playSwitchSound();}} src={isRedActive ? "/cartridge-red-on.png" : "/cartridge-red-off.png"} style={{ width: "75px" }} />
                  <img onClick={() => {setIsOrangeActive(!isOrangeActive); setIsGreenActive(false); setIsRedActive(false); playSwitchSound();}} src={isOrangeActive ? "/cartridge-orange-on.png" : "/cartridge-orange-off.png"} style={{ width: "75px" }} />
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
          <div style={{ display: "flex", justifyContent: "space-between", gap: "5px", zIndex: 30, paddingBottom: "10px" }}>
            {TABS.map((label) => {
              const isActive = activeTab === label;
              const footerIcons: { [key: string]: string } = {
                "Tap": "/tap-butt.png", "Mine": "/mine-butt.png", "Fight": "/fight-butt.png", "Library": "/closet-butt.png", "Cards": "/cards-butt.png"
              };
              return (
                <button key={label} onClick={() => setActiveTab(label)} style={{ flex: 1, background: "none", border: "none" }}>
                  <img src={footerIcons[label]} style={{ width: "40px", filter: isActive ? "none" : "grayscale(100%)", opacity: isActive ? 1 : 0.6 }} />
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