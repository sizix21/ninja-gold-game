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
const wheelOptions = [
  { label: "prize1", degree: 72, amount: 72, type: "green" },
  { label: "prize2", degree: 8, amount: 8, type: "green" },
  { label: "prize3", degree: 22, amount: 22, type: "green" },
  { label: "prize4", degree: 28, amount: 28, type: "green" },
  { label: "prize5", degree: 15, amount: 15, type: "green" },
  { label: "prize6", degree: 18, amount: 18, type: "green" },
  { label: "prize7", degree: 47, amount: 47, type: "green" },
  { label: "prize8", degree: 28, amount: 28, type: "green" },
  { label: "prize9", degree: 18, amount: 18, type: "green" },
  { label: "prize10", degree: 39, amount: 39, type: "green" },
  { label: "prize11", degree: 29, amount: 29, type: "green" },
  { label: "prize12", degree: 36, amount: 36, type: "green" },
];
export default function Home() {
  // --- States ---
  const [showLibraryPage, setShowLibraryPage] = useState(false);
  const [showNinjaCodePage, setShowNinjaCodePage] = useState(false);
  const [giftCode, setGiftCode] = useState(""); // برای ذخیره کدی که کاربر تایپ می‌کند
  const [spinsUsedToday, setSpinsUsedToday] = useState<number>(0);
  const [maxSpinsPerDay, setMaxSpinsPerDay] = useState<number>(1); // پیش‌فرض ۱ بار در روز
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
  const [nitroCharges, setNitroCharges] = useState(3); //  تنظیمات نیترو . تعداد باقی‌مانده
  const [isNitroReady, setIsNitroReady] = useState(false);
  const [isNitroActive, setIsNitroActive] = useState(false);
  const [nitroMultiplier, setNitroMultiplier] = useState(1);
  const [energyCharges, setEnergyCharges] = useState(3);// انرژی فول
  const [spinTimer, setSpinTimer] = useState<string>("Ready to Spin!");
  const [canSpin, setCanSpin] = useState<boolean>(true);
  const [specialNitro, setSpecialNitro] = useState<number>(0);
  const [speedBoostActive, setSpeedBoostActive] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentDay, setCurrentDay] = useState(1); // روزی که کاربر در آن قرار دارد (۱ تا ۱۴)
  const [lastClaimTime, setLastClaimTime] = useState(0); // زمان آخرین کلیک موفق
  const [canClaim, setCanClaim] = useState(true); // آیا ۲۴ ساعت گذشته است؟
  const [showDailyPage, setShowDailyPage] = useState(false);// ریواردهای روزانه
  const [isMakingSalad, setIsMakingSalad] = useState(false); 
  const [saladStartTime, setSaladStartTime] = useState<number | null>(null); 
  const [progress, setProgress] = useState(0); 
  const [showCodePage, setShowCodePage] = useState(false);// صفحه دیلی کد
  const [showSpinPage, setShowSpinPage] = useState(false);// صفحه اسپین 
 
  const handleClaimReward = (dayIndex: number) => {
  const actualDay = dayIndex + 1;
 
  // ۳. تعریف خود تابع چرخیدن (چون سرچ کردی و نبود، الان این را بساز)
  

  // ۱. بررسی ترتیب (فقط روز جاری قابل کلیک است)
  if (actualDay !== currentDay) {
    if (actualDay < currentDay) alert("این جایزه را قبلاً دریافت کرده‌اید!");
    else alert("ابتدا باید جایزه‌های روزهای قبل را بگیرید!");
    return;
  }

  // ۲. بررسی زمان ۲۴ ساعت
  const now = Date.now();
  if (now - lastClaimTime < 86400000) {
    const timeLeft = 86400000 - (now - lastClaimTime);
    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    alert(`لطفاً ${hours} ساعت و ${minutes} دقیقه دیگر صبر کنید.`);
    return;
  }

  // ۳. لیست جوایز بر اساس دیتای شما
  const rewards = [
    { amount: 5000, type: "C" },    // Day 1
    { amount: 10000, type: "C" },   // Day 2
    { amount: 25000, type: "C" },   // Day 3
    { amount: 50000, type: "C" },   // Day 4
    { amount: 2000, type: "T" },    // Day 5
    { amount: 200000, type: "C" },  // Day 6
    { amount: 500000, type: "C" },  // Day 7
    { amount: 5000, type: "T" },    // Day 8
    { amount: 10000, type: "T" },   // Day 9
    { amount: 100000, type: "C" },  // Day 10
    { amount: 50000, type: "R" },   // Day 11
    { amount: 500000, type: "C" },  // Day 12
    { amount: 30000, type: "T" },   // Day 13
    { amount: 1000000, type: "C" }  // Day 14
  ];

  const reward = rewards[dayIndex];

  // ۴. واریز سکه به موجودی
  if (reward.type === "C") setGreenCoins(prev => prev + reward.amount);
  else if (reward.type === "R") setRedCoins(prev => prev + reward.amount);
  else if (reward.type === "T") setOrangeCoins(prev => prev + reward.amount);

  // ۵. به‌روزرسانی استیت و ذخیره در حافظه
  let nextDay = actualDay + 1;
  if (actualDay === 14) nextDay = 1; // ریست شدن بعد از ۱۴ روز

  setCurrentDay(nextDay);
  setLastClaimTime(now);
  setCanClaim(false);

  localStorage.setItem("dailyDay", nextDay.toString());
  localStorage.setItem("lastClaimTime", now.toString());

  alert(`تبریک! روز ${actualDay} باز شد و جایزه واریز شد.`);
};
const spinTheWheel = () => {
  if (isSpinning) return;

  const randomDegree = Math.floor(Math.random() * 360);
  const newRotation = rotation + 1800 + randomDegree;
  
  setIsSpinning(true);
  setRotation(newRotation);

  setTimeout(() => {
    setIsSpinning(false);
    
    // محاسبه زاویه واقعی توقف (بین 0 تا 359)
    const stopDegree = (360 - (randomDegree % 360)) % 360;
    
    // پیدا کردن جایزه بر اساس بازه درجات
    let currentLimit = 0;
    let wonReward = wheelOptions[0]; // پیش‌فرض

    for (let i = 0; i < wheelOptions.length; i++) {
      currentLimit += wheelOptions[i].degree;
      if (stopDegree < currentLimit) {
        wonReward = wheelOptions[i];
        break;
      }
    }
    
    applyReward(wonReward);
    alert(`🎉 شما برنده شدید: ${wonReward.label}`);
  }, 4000);
};
// ۲. تعریف تابع اعمال جایزه (applyReward)
  const applyReward = (reward: any) => {
    if (!reward) return;
    if (reward.type === "green") {
      setGreenCoins(prev => prev + reward.amount);
    } else if (reward.type === "nitro") {
      setSpecialNitro(prev => prev + 1);
      alert("You won a Special Nitro! 🔥");
    }
  };
  // سیستم ذخیره هوشمند: 
useEffect(() => {
    
  if (greenCoins === 0 && redCoins === 0 && totalProfit === 0) return;

  localStorage.setItem("greenCoins", greenCoins.toString());
  localStorage.setItem("redCoins", redCoins.toString());
  localStorage.setItem("orangeCoins", orangeCoins.toString());
  localStorage.setItem("saladToken", saladToken.toString());
  localStorage.setItem("totalProfit", totalProfit.toString());
  localStorage.setItem("purchasedCards", JSON.stringify(purchasedCards));
  localStorage.setItem("energyCharges", energyCharges.toString());
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
  const savedDay = localStorage.getItem("dailyDay");
  const savedTime = localStorage.getItem("lastClaimTime");
  
  if (savedDay) setCurrentDay(Number(savedDay));
  if (savedTime) {
    const lastTime = Number(savedTime);
    setLastClaimTime(lastTime);
    
    // چک کردن اینکه آیا ۲۴ ساعت گذشته؟ (۸۶۴۰۰۰۰۰ میلی‌ثانیه)
    const now = Date.now();
    if (now - lastTime < 86400000) {
      setCanClaim(false);
    } else {
      setCanClaim(true);
    }
  }
  // ۱. تنظیم صداها
  audioRef.current = new Audio("/click.mp3");
  switchAudioRef.current = new Audio("/switch.mp3");
  // لود انرژی
  const sEnergyCh = localStorage.getItem("energyCharges");
  if (sEnergyCh) setEnergyCharges(Number(sEnergyCh));
  // ۲. لود کردن با اطمینان بالا
  const getSaved = (key: string) => localStorage.getItem(key);

  const sGreen = getSaved("greenCoins");
  const sRed = getSaved("redCoins");
  const sOrange = getSaved("orangeCoins");
  const sSalad = getSaved("saladToken");
  const sProfit = getSaved("totalProfit");
  const sCards = getSaved("purchasedCards");

  if (sGreen !== null) setGreenCoins(Number(sGreen));
  if (sRed !== null) setRedCoins(Number(sRed));
  if (sOrange !== null) setOrangeCoins(Number(sOrange));
  if (sSalad !== null) setSaladToken(Number(sSalad));
  if (sProfit !== null) setTotalProfit(Number(sProfit));
  if (sCards !== null) {
    try {
      setPurchasedCards(JSON.parse(sCards));
    } catch (e) {
      console.error("Error parsing cards", e);
    }
  }
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

  

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // ایجاد اثر ضربه (Squeeze Effect)
  setIsTapping(true);
  setTimeout(() => setIsTapping(false), 50); // بعد از ۵۰ میلی‌ثانیه به حالت عادی برگرد
  if (energy <= 0) return;

  // محاسبه مقدار سکه بر اساس نیترو
  let gain = 1;
  if (isNitroActive) {
    // انتخاب ضریب شانس بین 2، 3 یا 4
    const randomMultiplier = Math.floor(Math.random() * 3) + 2; 
    gain = randomMultiplier;
  }

  setGreenCoins(prev => prev + gain);
  setEnergy(prev => Math.max(0, prev - 1));

  // نمایش عدد شناور (Floating Number) با مقدار جدید
  const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
  const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
  const newNum = { id: Date.now(), x: clientX, y: clientY, value: gain };
  
  // بقیه کدهای مربوط به انیمیشن و صدا...
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
  <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: "40px", position: "relative" }}>
    
    {/* ۱. هدر (نام کاربری و سالاد) */}
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

    {/* ۲. مقدار سکه‌ها */}
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" }}>
      <img src="/currency-c.png" style={{ width: "50px" }} />
      <span style={{ fontSize: "40px", fontWeight: "bold" }}>{greenCoins.toLocaleString()}</span>
    </div>

    {/* ۳. نوار انرژی */}
    <div style={{ padding: "10px" }}>
      <span style={{ fontSize: "12px" }}>🔋 {energy} / 2000</span>
      <div style={{ width: "100px", height: "5px", backgroundColor: "#333", borderRadius: "3px", marginTop: "5px" }}>
        <div style={{ width: `${(energy / 2000) * 100}%`, height: "100%", backgroundColor: "#4caf50", borderRadius: "3px" }}></div>
      </div>
    </div>

    {/* سکه مرکزی برای تپ کردن */}
<div 
  onClick={handleClick} 
  style={{ 
    flex: 1, 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    cursor: "pointer", 
    marginTop: "-100px",
    WebkitTapHighlightColor: "transparent" // حذف هاله آبی در موبایل هنگام کلیک
  }}
>
  <img 
    src="/coin.png" 
    style={{ 
      width: "260px", 
      /* تغییر مقیاس بر اساس وضعیت تپ کردن */
      transform: isTapping ? "scale(0.92) translateY(5px)" : "scale(1) translateY(0)", 
      transition: "all 0.05s ease-out", // سرعت بسیار بالا برای حس بهتر
      filter: isTapping ? "brightness(1.1)" : "none" // کمی روشن‌تر شدن موقع ضربه
    }} 
  />
</div>

   

    {/* دکمه‌های QR و Boost */}
      <button onClick={() => setActiveTab("QR")} style={{ position: "absolute", bottom: "100px", left: "12%", background: "none", border: "none" }}>
        <img src="/qr-butt.png" style={{ width: "35px" }} />
      </button>
      <button onClick={() => setActiveTab("Boost")} style={{ position: "absolute", bottom: "100px", right: "12%", background: "none", border: "none" }}>
        <img src="/boost-butt.png" style={{ width: "35px" }} />
      </button>

      
      {isNitroReady && (
        <div
          onClick={() => {
            setIsNitroReady(false);
            setIsNitroActive(true);
            const randomMultiplier = Math.floor(Math.random() * 3) + 2; 
            setNitroMultiplier(randomMultiplier);
            setTimeout(() => {
              setIsNitroActive(false);
              setNitroMultiplier(1);
            }, 10000);
          }}
          style={{
            position: "absolute",
            bottom: "160px", 
            right: "20px",
            zIndex: 100,
            cursor: "pointer",
            fontSize: "50px",
            animation: "floatNitro 2s ease-in-out infinite",
            filter: "drop-shadow(0 0 15px #ff4444)"
          }}
        >
          🔥
        </div>
      )}
    </div> 
  )}

{/* نمایش زمان باقی‌مانده نیترو (اختیاری) */}

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

      {/* --- ردیف جدید برای شارژ نیترو --- */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
        <span style={{ color: "#ff4444", fontWeight: "bold" }}>Nitro (🔥 {nitroCharges}/3)</span>
        <button 
          onClick={() => {
            setNitroCharges(3);
            alert("نیترو با موفقیت شارژ شد!");
          }} 
          style={{ background: "#ff4444", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 15px", fontWeight: "bold", cursor: "pointer" }}
        >
          Refill Nitro
        </button>
      </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
  <span style={{ color: "#2196F3", fontWeight: "bold" }}>Energy (⚡ {energyCharges}/3)</span>
  <button 
    onClick={() => setEnergyCharges(3)} 
    style={{ background: "#2196F3", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 15px", fontWeight: "bold" }}
  >
    Refill Energy Charges
  </button>
</div>
      {/* دکمه اسپین زیاد کن */}
      <button 
  onClick={() => {
    setGreenCoins(999999);
    setMaxSpinsPerDay(999);
    setSpinsUsedToday(0);
    alert("Test Mode Activated!");
  }}
   style={{
    padding: "15px 25px",
    backgroundColor: "#4CAF50",
    color: "white",
    borderRadius: "12px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  Activate Test Mode
</button>
    </div>
  </div>
)}

{activeTab === "Boost" && (
  <div style={{ 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    padding: "20px", 
    color: "white", // تغییر رنگ متن به سفید چون معمولاً بک‌گراندها تیره هستند
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('/boost-back.jpg')", // تصویر پس‌زمینه شما
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflowY: "auto",
    paddingBottom: "100px",
    width: "100%",
    height: "100vh"
  }}>
    {/* دکمه بازگشت  */}
<button 
  onClick={() => setActiveTab("Tap")} // یا هر تبی که می‌خواهی به آن برگردد
  style={{ 
    position: "absolute", 
    top: "20px", 
    left: "20px", 
    background: "none", 
    border: "none", 
    zIndex: 110, 
    padding: 0,
    cursor: "pointer"
  }}
>
  <img src="/back-butt.png" style={{ width: "7px", height: "auto" }} />
</button>
    <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "30px" }}>Boost</h2>

    {/* بخش آیکون‌های بالایی */}
<div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
  {/* دکمه نیترو (آتش) */}
  <div 
  onClick={() => {
    // چک کردن زمان برای ریست شدن شارژها (هر ۲۴ ساعت)
    const lastUsed = localStorage.getItem("lastNitroReset");
    const now = Date.now();
    if (!lastUsed || now - Number(lastUsed) > 24 * 60 * 60 * 1000) {
      setNitroCharges(3);
      localStorage.setItem("lastNitroReset", now.toString());
    }

    // فعال‌سازی سریع بدون Alert
    if (nitroCharges > 0 && !isNitroReady && !isNitroActive) {
      setNitroCharges(prev => prev - 1);
      setIsNitroReady(true);
      playSwitchSound(); // پخش صدا به جای پیام متنی
    }
  }}
  style={{ 
    display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", 
    fontWeight: "bold", cursor: "pointer",
    opacity: (nitroCharges === 0) ? 0.5 : 1
  }}
>
  <span style={{ fontSize: "24px" }}>🔥</span>
  <span>{nitroCharges}/3</span>
</div>
  
  <div 
  onClick={() => {
    // چک کردن ریست ۲۴ ساعته (مشابه نیترو)
    const lastReset = localStorage.getItem("lastEnergyReset");
    const now = Date.now();
    if (!lastReset || now - Number(lastReset) > 86400000) {
      setEnergyCharges(3);
      localStorage.setItem("lastEnergyReset", now.toString());
    }

    if (energyCharges > 0) {
      setEnergy(2000); // پر کردن نوار انرژی
      setEnergyCharges(prev => prev - 1); // کم کردن یک شارژ
      // اگر افکت صوتی داری اینجا پخش کن
    } else {
      alert("شارژ انرژی امروز تمام شده است!");
    }
  }}
  style={{ 
    display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", 
    fontWeight: "bold", cursor: "pointer",
    opacity: energyCharges === 0 ? 0.5 : 1
  }}
>
  <span style={{ fontSize: "24px" }}>⚡</span>
  <span>{energyCharges}/3</span>
</div>
</div>

    {/* لیست ارتقاها (Stats) */}
    <div style={{ width: "100%", maxWidth: "300px", marginBottom: "40px" }}>
      {[
        { label: "Multi tap", value: "x1", icon: "🔥" },
        { label: "Energy limit", value: "2000", icon: "🔋" },
        { label: "Recharging speed", value: "60/m", icon: "🕒" },
      ].map((stat, index) => (
        <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "18px", color: "#ffffffff" }}>
          <span style={{ fontWeight: "bold" }}>{stat.icon} {stat.label}</span>
          <span style={{ fontWeight: "bold" }}>{stat.value}</span>
        </div>
      ))}
    </div>

    {/* دکمه‌های شبکه‌ای (Grid Buttons) */}
    {/* این لایه تمام فضای خالی بالای دکمه‌ها را پر می‌کند تا آن‌ها را به پایین فشار دهد */}
<div style={{ flex: 1 }} />

<div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(3, 1fr)", 
      gap: "10px", 
      width: "100%",
      marginBottom: "100px" // این مقدار دکمه‌ها را از لبه پایین و منو فاصله می‌دهد
    }}>
      {["Daily", "Task", "Rank", "Squad", "", "State"].map((label, index) => (
        label ? (
          <button
           key={index} 
           onClick={() => {
        if (label === "Daily") {
          setShowDailyPage(true);
        }
      }}
           style={{
            padding: "10px",
            border: "1px solid #9b9b9bc0", 
            borderRadius: "8px",
            background: "#36363681",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#ffffffff",
            backdropFilter: "blur(2px)", 
            WebkitBackdropFilter: "blur(8px)", // برای پشتیبانی در آیفون و سافاری
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)", // کمی سایه برای عمق بیشتر
            cursor: "pointer"
          }}>
            {label}
          </button>
        ) : <div key={index}></div>
      ))}
    </div>
  </div>
)}
{/* Daily Rewards Page */}

{showDailyPage && (
  <div style={{ 
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
    backgroundImage: "url('/daily-back.jpg')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 10000, 
    display: "flex", 
    flexDirection: "column",
    color: "white" 
  }}>
    
    {/* هدر */}
    <div style={{ display: "flex", alignItems: "center", padding: "20px 15px", position: "relative" }}>
      <button onClick={() => setShowDailyPage(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px", zIndex: 11 }}>
        <img src="/back-butt.png" style={{ width: "7px" }} />
      </button>

      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{ fontSize: "14px", fontWeight: "bold", opacity: 0.8 }}>Ninja Potato</div>
        <h2 style={{ margin: 0, fontSize: "26px", fontWeight: "900", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>Daily Rewards</h2>
      </div>
      <div style={{ width: "27px" }}></div> 
    </div>

    <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}>
      
      {/* دکمه‌های بالایی در صفحه Daily Rewards */}
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
  
  {/* دکمه Spin Wheel */}
  <div 
    onClick={() => setShowSpinPage(true)} 
    style={{ 
      width: "85%", padding: "12px", borderRadius: "12px",
      background: "#36363681",
      border: canSpin ? "1px solid #4CAF50" : "1px solid #9b9b9bc0",
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      textAlign: "center", cursor: "pointer"
    }}
  >
    <div style={{ fontSize: "18px", fontWeight: "bold" }}>Spin Wheel</div>
    <div style={{ fontSize: "13px", color: canSpin ? "#4CAF50" : "#ffd700", fontWeight: "bold" }}>
      {spinTimer}
    </div>
  </div>

  {/* دکمه Daily Ninja Code */}
<div 
  onClick={() => setShowNinjaCodePage(true)} // تغییر به صفحه نینجا کد
  style={{
    width: "85%", padding: "12px", borderRadius: "12px",
    background: "#36363681", border: "1px solid #9b9b9bc0",
    textAlign: "center", cursor: "pointer"
  }}
>
  <div style={{ fontSize: "18px", fontWeight: "bold" }}>Daily Ninja Code</div>
  <div style={{ fontSize: "13px", color: "#ffd700" }}>Enter Code to Claim Reward</div>
</div>
</div>

      {/* شبکه کادوها با مرز (Border) مشخص */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(5, 1fr)", 
        gap: "12px", 
        paddingBottom: "40px" 
      }}>
       {[...Array(14)].map((_, i) => {
  const dayNumber = i + 1;
  const isClaimed = dayNumber < currentDay;
  const isCurrent = dayNumber === currentDay;
  const isLocked = dayNumber > currentDay;
  const showAsLocked = isLocked || (isCurrent && !canClaim);

  return (
    <div 
      key={i} 
      onClick={() => handleClaimReward(i)}
      style={{ 
        aspectRatio: "1/1",
        // رنگ سفید برای پس‌زمینه با شفافیت بسیار کم
        background: isCurrent && canClaim ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.3)", 
        backdropFilter: "blur(1.5px)",
        borderRadius: "10px", 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        // مرز سفید ضخیم‌تر و روشن‌تر
        border: isCurrent && canClaim ? "2px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.4)", 
         
        cursor: showAsLocked ? "not-allowed" : "pointer",
        position: "relative",
        boxShadow: isCurrent && canClaim ? "0 0 15px rgba(255, 255, 255, 0.3)" : "none"
      }}
    >
      
      
      {/* آیکون‌ها */}
      <span style={{ fontSize: "24px", filter: isCurrent && canClaim ? "drop-shadow(0 0 5px white)" : "none" }}>
        {isClaimed ? "✅" : (showAsLocked ? "🔒" : "🎁")}
      </span>

    
    </div>
  );
})}
      </div>
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

 
 </motion.div>

 {/* Footer Navigation (Fixed) */}
 <div style={{ 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center",
  width: "100%",
  gap: "20px", 
  zIndex: 9999, 
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
       onClick={() => {
  setActiveTab(label);
  playSwitchSound();
  
  // اضافه کردن این شرط برای باز شدن صفحه لایبرری
  if (label === "Library") {
    setShowLibraryPage(true);
  } else {
    setShowLibraryPage(false);
  }
}} 
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
          <img src="/back-butt.png" style={{ width: "7px" }} />
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
 {/* صفحه گردونه شانس */}
{showSpinPage && (
  <div style={{ 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100vw", 
    height: "100vh", 
    backgroundColor: "rgba(0,0,0,0.95)", // پس‌زمینه تیره برای کل صفحه
    zIndex: 99999, // بالاترین لایه
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }}>
    
    {/* دکمه بازگشت در بالا */}
    <div style={{ position: "absolute", top: "20px", left: "20px" }}>
      <button 
  onClick={() => {
    // ۱. اول مقدار چرخش را صفر کن
    setRotation(0); 
    // ۲. حالا صفحه را ببند
    setShowSpinPage(false); 
  }} 
  style={{ background: "none", border: "none" }}
>
  <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
</button>
    </div>

    {/* محتوای وسط صفحه (فعلاً خالی برای طراحی گردونه) */}
    <div style={{ position: "relative", width: "280px", height: "280px", display: "flex", justifyContent: "center", alignItems: "center" }}>
  {/* نشانگر ثابت بالای گردونه (فلش راهنما) */}
  <div style={{ 
    position: "absolute", top: "-10px", zIndex: 10,
    width: 0, height: 0, borderLeft: "15px solid transparent",
    borderRight: "15px solid transparent", borderTop: "30px solid #ff4444"
  }}></div>

  {/* دایره اصلی که می‌چرخد */}
  <div style={{ 
    width: "100%", 
    height: "100%", 
    borderRadius: "50%", 
    position: "relative",
    transition: "transform 4s cubic-bezier(0.15, 0, 0.15, 1)",
    transform: `rotate(${rotation}deg)`,
    //  تصویر 'گردونه
    backgroundImage: "url('/spinwheel.png')", 
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}>
   
  </div>

  {/* دکمه وسط برای شروع (اختیاری) */}
  <div 
    onClick={spinTheWheel}
    style={{ 
      position: "absolute", width: "60px", height: "60px", borderRadius: "50%", 
      backgroundColor: "white", color: "black", fontWeight: "bold",
      display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer",
      zIndex: 5, boxShadow: "0 0 10px rgba(0,0,0,0.5)"
    }}
  >
    SPIN
  </div>
</div>
  </div>
)}
{/* صفحه نینجا کد */}
{showNinjaCodePage && (
  <div style={{
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "#121212", zIndex: 30000, display: "flex",
    flexDirection: "column", alignItems: "center", justifyContent: "center"
  }}>
    {/* دکمه بازگشت */}
    <div style={{ position: "absolute", top: "20px", left: "20px" }}>
      <button onClick={() => setShowNinjaCodePage(false)} style={{ background: "none", border: "none" }}>
        <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
      </button>
    </div>

    <h2 style={{ color: "white", marginBottom: "20px" }}>Enter Ninja Code</h2>
    
    <input 
      type="text" 
      value={giftCode}
      onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
      placeholder="CODE HERE..."
      style={{
        padding: "15px", borderRadius: "10px", border: "none",
        width: "70%", textAlign: "center", fontSize: "18px", marginBottom: "20px"
      }}
    />

    <button 
      onClick={() => {
        if (giftCode === "NINJA2025") {
          setGreenCoins(prev => prev + 10000);
          alert("🎉 10,000 Coins added!");
          setShowNinjaCodePage(false);
          setGiftCode("");
        } else {
          alert("❌ Invalid Code!");
        }
      }}
      style={{
        padding: "15px 40px", backgroundColor: "#ffd700",
        borderRadius: "10px", border: "none", fontWeight: "bold"
      }}
    >
      REDEEM
    </button>
  </div>
)}
 {floatingNumbers.map(num => (
    <div key={num.id} style={{ 
      position: "fixed", 
      left: num.x, 
      top: num.y, 
      color: isNitroActive ? "#ff4444" : "#ffd700", // تغییر رنگ عدد به قرمز در حالت نیترو برای جذابیت
      fontSize: "32px", 
      fontWeight: "bold", 
      animation: "f 0.8s forwards", 
      pointerEvents: "none", 
      zIndex: 1000 
    }}>
      +{num.value}
    </div>
  ))}
  
  <style>{`
    @keyframes f { 
      0% { opacity: 1; transform: translateY(0); } 
      100% { opacity: 0; transform: translateY(-100px); } 
    }

    @keyframes floatNitro {
      0% { transform: translateY(0px) scale(1) rotate(0deg); }
      50% { transform: translateY(-20px) scale(1.2) rotate(10deg); }
      100% { transform: translateY(0px) scale(1) rotate(0deg); }
    }
  `}</style>
  {showLibraryPage && (
  <div style={{
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundImage: "url('/closet-back.jpg')", // تصویر پس‌زمینه از فایل شما
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 100, // لایه‌ای بالاتر از محتوای اصلی اما پایین‌تر از فوتر
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // شروع از بالا
    paddingBottom: "80px", // فضای خالی برای فوتر
    boxSizing: "border-box", // padding به width/height اضافه نشود
    overflowY: "auto" // اسکرول برای محتوای بیشتر
  }}>

    {/* Header با دکمه SHOP و دکمه Back */}
    <div style={{ 
      width: "100%", 
      display: "flex", 
      justifyContent: "flex-end", 
      alignItems: "center", 
      padding: "20px", 
      boxSizing: "border-box" 
    }}>
      

      {/* دکمه SHOP در بالا سمت راست */}
      <button 
        onClick={() => alert("Shop will open soon!")} // فانکشن موقتی
        style={{
          backgroundColor: "#ffc107", // رنگ طلایی/زرد
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        SHOP
      </button>
    </div>

    {/* عنوان صفحه */}
    <h2 style={{ color: "white", marginBottom: "30px", fontSize: "24px" }}>My NFTs</h2>

    {/* بخش بالایی: ۳ ستون */}
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(3, 1fr)", // ۳ ستون مساوی
      gap: "10px", 
      width: "90%", 
      maxWidth: "600px", // برای صفحه های بزرگتر
      marginBottom: "30px" 
    }}>
      {/* کادر خالی NFT (مثال) */}
      {[...Array(3)].map((_, index) => (
        <div 
          key={index} 
          style={{ 
            width: "100%", 
            paddingTop: "100%", // نسبت ابعاد ۱:۱ برای کادر
            backgroundColor: "rgba(255,255,255,0.1)", 
            borderRadius: "10px", 
            border: "1px dashed rgba(255,255,255,0.3)",
            display: "flex", // برای وسط چین کردن آینده
            justifyContent: "center",
            alignItems: "center",
            color: "rgba(255,255,255,0.5)",
            fontSize: "12px",
            position: "relative"
          }}
        >
          {/* اگر تصویر NFT داشتی، اینجا قرار می‌گیرد */}
          <span style={{ position: "absolute" }}>NFT {index + 1}</span>
        </div>
      ))}
    </div>

    {/* بخش پایینی: ۴ ستون */}
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(4, 1fr)", // ۴ ستون مساوی
      gap: "8px", 
      width: "90%", 
      maxWidth: "600px", 
      marginBottom: "20px" 
    }}>
      {/* کادر خالی NFT (مثال) */}
      {[...Array(5)].map((_, index) => (
        <div 
          key={index} 
          style={{ 
            width: "100%", 
            paddingTop: "100%", // نسبت ابعاد ۱:۱ برای کادر
            backgroundColor: "rgba(255,255,255,0.1)", 
            borderRadius: "8px", 
            border: "1px dashed rgba(255,255,255,0.3)",
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            color: "rgba(255,255,255,0.5)",
            fontSize: "10px",
            position: "relative"
          }}
        >
          <span style={{ position: "absolute" }}>NFT {index + 4}</span>
        </div>
      ))}
    </div>
  </div>
)}
</div>
    
  );
}


