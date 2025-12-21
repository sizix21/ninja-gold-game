"use client";

import { useState, useEffect, useRef } from "react";

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
}
const CARDS_DATA = [
  {
    id: 1,
    name: "Industrial Blender",
    description: "افزایش سرعت تولید سکه سبز",
    cost: 500, // قیمت به سکه سبز
    target: "greenProfit", // متغیری که تغییر می‌کند
    boost: 2, // چقدر به سود اضافه شود
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
  const [isGreenOn, setIsGreenOn] = useState(true);
  const [isRedOn, setIsRedOn] = useState(false);
  const [isOrangeOn, setIsOrangeOn] = useState(false);
  const [isGreenActive, setIsGreenActive] = useState(false); // vaziate miner
  const [isRedActive, setIsRedActive] = useState(false); 
  const [isOrangeActive, setIsOrangeActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // tabdil be sanie
  const [greenProfit, setGreenProfit] = useState(1);
  const [redProfit, setRedProfit] = useState(0);
  const [orangeProfit, setOrangeProfit] = useState(0);
  const switchAudioRef = useRef<HTMLAudioElement | null>(null);
  const [totalProfit, setTotalProfit] = useState(0);
  const [isSaladPage, setIsSaladPage] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleBuyCard = (card: typeof CARDS_DATA[0]) => {
  // ۱. چک کردن موجودی (فعلاً همه با سکه سبز هستند طبق خواسته شما)
  if (greenCoins < card.cost) {
    alert("سکه سبز کافی نداری!");
    return;
  }

  // ۲. کسر هزینه
  setGreenCoins(prev => prev - card.cost);

  // ۳. اعمال تغییرات بر اساس هدف کارت
  if (card.target === "greenProfit") setGreenProfit(prev => prev + card.boost);
  if (card.target === "redProfit") setRedProfit(prev => prev + card.boost);
  if (card.target === "orangeProfit") setOrangeProfit(prev => prev + card.boost);

  // ۴. افزایش پروفیت کل (اعتبار اکانت)
  setTotalProfit(prev => prev + (card.boost * 10));
  
  alert(`${card.name} با موفقیت خریداری و ارتقا اعمال شد!`);
};

  
  useEffect(() => {
   
    audioRef.current = new Audio("/click.mp3");// sedaye tap kardan
  
    switchAudioRef.current = new Audio("/switch.mp3"); // sedaye kartrij
  switchAudioRef.current.volume = 0.5;

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
      
      // 5 min mine
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

  // zakhire sazi
  useEffect(() => {
    localStorage.setItem("ninjaGreenCoins", greenCoins.toString());
    localStorage.setItem("ninjaGreenActive", isGreenActive.toString());
    localStorage.setItem("lastExitTime", Date.now().toString());
    localStorage.setItem("ninjaRedCoins", redCoins.toString());
    localStorage.setItem("ninjaOrangeCoins", orangeCoins.toString());
    localStorage.setItem("ninjaEnergy", energy.toString());
    localStorage.setItem("ninjaSalad", saladToken.toString());
    localStorage.setItem("lastTime", Date.now().toString());
  }, [greenCoins, redCoins, orangeCoins, energy, saladToken]);

  // timer tolid sanieii (Mining & Energy Regen)
  useEffect(() => {
    const interval = setInterval(() => {
      
      setEnergy((prev) => Math.min(prev + 1, 2000));
      
      if (isGreenActive) setGreenCoins(prev => prev + greenProfit);
      if (isRedActive) setRedCoins(prev => prev + redProfit);
      if (isOrangeActive) setOrangeCoins(prev => prev + orangeProfit);
            
      if (isGreenActive || isRedActive || isOrangeActive) {
        setTimeLeft(300);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [isGreenActive, isRedActive, isOrangeActive, greenProfit, redProfit, orangeProfit]);
const handleGreenCartridgeClick = () => {
  setIsGreenActive(prev => {
    const newState = !prev;
    if (newState) { { setIsRedActive(false); setIsOrangeActive(false); } }
    return newState;
  });
  playSwitchSound();
};

const handleRedCartridgeClick = () => {
  setIsRedActive(prev => {
    const newState = !prev;
    if (newState) { { setIsGreenActive(false); setIsOrangeActive(false); } }
    return newState;
  });
  playSwitchSound();
};

const handleOrangeCartridgeClick = () => {
  setIsOrangeActive(prev => {
    const newState = !prev;
    if (newState) { { setIsGreenActive(false); setIsRedActive(false); } }
    return newState;
  });
  playSwitchSound();
};

// tebe komaki seda
const playSwitchSound = () => {
  if (switchAudioRef.current) {
    switchAudioRef.current.currentTime = 0;
    switchAudioRef.current.play().catch(() => {});
  }
};

  // --- Handlers ---
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (energy <= 0) return;
    
    // tap baraye animation
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 100); // bargasht be halate aval

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

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", marginTop: "0px" }}>
        {activeTab === "Cards" && (
  <div style={{ flex: 1, padding: "20px", overflowY: "auto", paddingBottom: "100px" }}>
    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Upgrades</h2>
    
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
      {CARDS_DATA.map((card) => (
        <div key={card.id} style={{ 
          background: "#222", 
          padding: "15px", 
          borderRadius: "20px", 
          border: "1px solid #333", 
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "35px" }}>{card.icon}</div>
          <div style={{ fontWeight: "bold", margin: "10px 0" }}>{card.name}</div>
          <div style={{ color: "#4CAF50", fontSize: "12px" }}>+{card.boost * 60}/m</div>
          
          <button 
            onClick={() => handleBuyCard(card)}
            style={{ 
              marginTop: "10px", 
              width: "100%", 
              padding: "8px", 
              borderRadius: "12px", 
              backgroundColor: greenCoins >= card.cost ? "#ffd700" : "#444", 
              border: "none", 
              fontWeight: "bold" 
            }}
          >
            {card.cost} 🟢
          </button>
        </div>
      ))}
    </div>
  </div>
)}
        {activeTab === "Tap" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: "40px" }}>
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

        {/* دکمه سالاد در صفحه اصلی (Tab) */}
<div 
  onClick={() => setIsSaladPage(true)} 
  style={{ 
    cursor: "pointer", 
    zIndex: 40,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(73, 73, 73, 0.5)", 
    padding: "5px 12px",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(5px)",
    flexDirection: "row" // اطمینان از چیدمان افقی
  }}
>
  {/* ابتدا عدد (سمت چپ) */}
  <span style={{ 
    fontSize: "14px", 
    fontWeight: "bold", 
    color: "#fff"
  }}>
    {saladToken.toLocaleString()}
  </span>

  {/* سپس آیکون (سمت راست) */}
  <img 
    src="/salad-token.png" 
    alt="Salad"
    style={{ 
      width: "35px", 
      height: "28px"
    }} 
  />
</div>
      </div>
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
            <div onClick={handleClick} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", marginTop: "-100px" }}>
              <img 
  src="/coin.png" 
  style={{ 
    width: "260px", 
    transition: "transform 0.05s", 
    transform: isTapping ? "scale(0.92)" : "scale(1)" // kochak shodan
  }} 
/>
            </div>
          </div>
        ) : activeTab === "Mine" ? (
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
            {/* panel amar balaye safhe*/}
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
            {/* tasvire robor*/}
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

            {/* hol dadne kartrij ha be paiin*/}
            <div style={{ flex: 1 }} /> 

            {/* kartrij ha*/}
            <div style={{ 
              width: "90%", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "flex-end",
              gap: "15px", 
              zIndex: 5,
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "20px"
              
            }}>
               <div 
  onClick={handleGreenCartridgeClick} 
  style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
>
  <img 
    src={isGreenActive ? "/cartridge-green-on.png" : "/cartridge-green-off.png"} 
    style={{ 
      width: "75px", 
      filter: isGreenActive ? "drop-shadow(0 0 10px #4CAF50)" : "none",
      transition: "all 0.3s"
    }} 
  />
  
</div>

{/* kartrij ghermez*/}
<div onClick={handleRedCartridgeClick} style={{ cursor: "pointer", transition: "all 0.3s" }}>
  <img 
    src={isRedActive ? "/cartridge-red-on.png" : "/cartridge-red-off.png"} 
    style={{ 
      width: "75px", 
      filter: isRedActive ? "drop-shadow(0 0 10px #f44336)" : "none",
      transition: "all 0.3s"
    }} 
  />
</div>

{/* kartrij narenji*/}
<div onClick={handleOrangeCartridgeClick} style={{ cursor: "pointer", transition: "all 0.3s" }}>
  <img 
    src={isOrangeActive ? "/cartridge-orange-on.png" : "/cartridge-orange-off.png"} 
    style={{ 
      width: "75px", 
      filter: isOrangeActive ? "drop-shadow(0 0 10px #ff9800)" : "none",
      transition: "all 0.3s"
    }} 
  />
</div>
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
  <button 
    key={label} 
    onClick={() => setActiveTab(label)} 
    style={{ 
      flex: 1, 
      background: "none", 
      border: "none", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "10px 0",
      transition: "none",
      transform: "none"
    }}
  >
    <img 
      src={footerIcons[label]} 
      alt={label} 
      style={{ 
        width: "40px", 
        height: "40px",
        objectFit: "contain",
        filter: isActive ? "none" : "grayscale(100%)",
        opacity: isActive ? 1 : 0.6,
        transition: "opacity 0.2s"
      }} 
    />
  </button>
)
        })}
      </div>
</>
) : (
  /* --- محتوای صفحه سالاد --- */
  <div style={{ 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    background: "#000" 
  }}>
    <button 
      onClick={() => setIsSaladPage(false)}
      style={{
        padding: "10px 20px",
        backgroundColor: "#ffd700",
        borderRadius: "10px",
        color: "black",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer"
      }}
    >
      🔙 Back
    </button>
    <h2 style={{ marginTop: "20px" }}>Salad Shop</h2>
  </div>
)}
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

      {floatingNumbers.map(num => (
  <div 
    key={num.id} 
    style={{ 
      position: "fixed", 
      left: num.x, 
      top: num.y, 
      color: "#ffd700", 
      fontSize: "32px",
      fontWeight: "bold", 
      textShadow: "0px 4px 10px rgba(0,0,0,0.8)",
      animation: "f 0.8s forwards", 
      pointerEvents: "none", 
      zIndex: 1000 
    }}
  >
    +1
  </div>
))}

      <style>{`@keyframes f { 0%{opacity:1; transform:translateY(0)} 100%{opacity:0; transform:translateY(-100px)} }`}</style>
    </div>
  );
}