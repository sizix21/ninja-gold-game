"use client";

// داخل بخش مربوط به نمایش Library
<div style={{ marginTop: "20px" }}>
  <button style={{
    backgroundColor: "#0098ea", // رنگ آبی استاندارد تون
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer"
  }}>
       Connect Wallet
  </button>
</div>


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
interface FightBtnProps {
  text: string;
  color: string;
  textColor: string;
  fontSize?: string;
}

const FightButton = ({ text, color, textColor, fontSize }: { text: string, color: string, textColor: string, fontSize?: string }) => (
  <button style={{
    width: "100%", padding: "10px 10px",  marginBottom: "12px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.33)",
    // تبدیل رنگ ورودی به حالتی که کمی شفاف باشد برای افکت شیشه‌ای
    backgroundColor: `${color}90`,
    // افکت مات شدن پشت دکمه
    backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
    // بوردر شیشه‌ای و درخشان
    border: `1px solid ${color}88`, borderRadius: "15px",
    // تنظیمات متن
    color: textColor, fontSize: fontSize || "16px", fontWeight: "bold",
    textTransform: "uppercase", cursor: "pointer",
    // سایه برای عمق دادن به حالت شیشه‌ای
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    // افکت‌های بصری
    transition: "all 0.3s ease",  display: "flex",
    alignItems: "center", justifyContent: "center", textAlign: "center"
  }}>
    {text}
  </button>
);
export default function Home() {
  // --- States ---
  // مقادیر ممکن: 'home', 'library', 'fight', 'shop'
  const [activePage, setActivePage] = useState('home');

  const [isMakingSalad, setIsMakingSalad] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // ۳۶۰۰ ثانیه = ۱ ساعت
  const [isFakeConnected, setIsFakeConnected] = useState(false);
  // --- Helper Functions ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- Timer Logic ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMakingSalad && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMakingSalad, timeLeft]);
  // مربوط به صفحه استیت
const statBoxStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.05)", padding: "20px",
  borderRadius: "15px", display: "flex", flexDirection: "column", 
  alignItems: "center", border: "1px solid rgba(255, 255, 255, 0.1)"
};
  const [showStatePage, setShowStatePage] = useState(false);
  const [showRankPage, setShowRankPage] = useState(false);
  const [showSquadPage, setShowSquadPage] = useState(false);
  const [showTaskPage, setShowTaskPage] = useState(false);// صفحه Task
  const [showFightPage, setShowFightPage] = useState(false);// Fight صفحه
  const renderSymbol = (type: string) => {
  const baseStyle = { width: 0, height: 0, borderStyle: "solid" };
  switch (type) {
    case "circle":
      return <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#ff0000", boxShadow: "0 0 10px #ff0000" }} />;
    case "right":
      return <div style={{ ...baseStyle, borderWidth: "12px 0 12px 20px", borderColor: "transparent transparent transparent #ff0000", filter: "drop-shadow(0 0 5px #ff0000)" }} />;
    case "left":
      return <div style={{ ...baseStyle, borderWidth: "12px 20px 12px 0", borderColor: "transparent #ff0000 transparent transparent", filter: "drop-shadow(0 0 5px #ff0000)" }} />;
    case "up":
      return <div style={{ ...baseStyle, borderWidth: "0 12px 20px 12px", borderColor: "transparent transparent #ff0000 transparent", filter: "drop-shadow(0 0 5px #ff0000)" }} />;
    case "down":
      return <div style={{ ...baseStyle, borderWidth: "20px 12px 0 12px", borderColor: "#ff0000 transparent transparent transparent", filter: "drop-shadow(0 0 5px #ff0000)" }} />;
    default:
      return null;
  }
};
  const circlePositions = [
  { id: 1, top: "50vh", left: "50vw" }, // وسط دقیق گوشی
  { id: 2, top: "50vh", left: "80vw" }, // راست
  { id: 3, top: "50vh", left: "20vw" }, // چپ
  { id: 4, top: "30vh", left: "50vw" }, // بالا
  { id: 5, top: "70vh", left: "50vw" }, // پایین
];
  const [showCodeListPage, setShowCodeListPage] = useState(false);//صفخه کدها
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
  const [energy, setEnergy] = useState(500);
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
   
  const [saladStartTime, setSaladStartTime] = useState<number | null>(null); 
  const [progress, setProgress] = useState(0); 
  const [showCodePage, setShowCodePage] = useState(false);// صفحه دیلی کد
  const [showSpinPage, setShowSpinPage] = useState(false);// صفحه اسپین 
 
  // تابع سالاد سازی
useEffect(() => {
  if (isMakingSalad && timeLeft > 0) {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }
}, [isMakingSalad, timeLeft]);

  const handleClaimReward = (dayIndex: number) => {
  const actualDay = dayIndex + 1;
 
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
  
// تابع تبدیل ثانیه به فرمت 00:00
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
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
      case 'energy': setEnergy(prev => Math.max(0, Math.min(500, prev + amount))); break;
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
      setEnergy((prev) => Math.min(prev + 1, 500));
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
// ریترن اصلی بازی
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#1a1a1a", color: "white", fontFamily: "sans-serif", padding: "20px", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
      {/* لایه اصلی: Home */}
    <div style={{ display: activePage === 'home' ? 'block' : 'none' }}>
    </div>
<>
          {/* Main Container with Swipe */}
          <motion.div 
            key={activeTab}
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
{/* Tap Tab تپ*/}
{activeTab === "Tap" && (
<div style={{ 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    minHeight: "100vh", // این خط باعث می‌شود قدِ لایه همیشه اندازه کل صفحه باشد
    paddingBottom: "100px" // این فضا را برای اینکه محتوا زیر فوتر نرود اضافه کن
  }}>    
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
      {/* تغییر اصلی: استفاده از سیستم setActiveTab برای رفتن به صفحه سالاد */}
      <div onClick={() => setActiveTab("Salad")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(73, 73, 73, 0.5)", padding: "5px 12px", borderRadius: "15px" }}>
        <span>{saladToken.toLocaleString()}</span>
        <img src="/salad-token.png" style={{ width: "35px", height: "28px" }} />
      </div>
    </div>

    {/* ۲. مقدار سکه‌ها */}
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "50px" }}>
      <img src="/currency-c.png" style={{ width: "50px" }} />
      <span style={{ fontSize: "40px", fontWeight: "bold" }}>{greenCoins.toLocaleString()}</span>
    </div>

    {/* ۳. نوار انرژی */}
    <div style={{ 
  width: "100%", 
  display: "flex", 
  flexDirection: "column", 
  alignItems: "flex-start", // تغییر از center به flex-start برای رفتن به چپ
  paddingLeft: "20px",      // فاصله از لبه سمت چپ گوشی
  marginTop: "10px" 
}}>
      <span style={{ fontSize: "12px" }}>🔋 {energy} / 500</span>
      <div style={{ width: "100px", height: "5px", backgroundColor: "#333", borderRadius: "3px", marginTop: "5px" }}>
        <div style={{ width: `${(energy / 500) * 100}%`, height: "100%", backgroundColor: "#4caf50", borderRadius: "3px" }}></div>
      </div>
    </div>

    {/* سکه مرکزی برای تپ کردن */}
    <div 
      onClick={handleClick} 
      style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
    >
      <img 
        src="/coin.png" 
        style={{ 
          width: "280px", 
          transform: isTapping ? "scale(0.92) translateY(5px)" : "scale(1) translateY(0)", 
          transition: "all 0.05s ease-out", 
          filter: isTapping ? "brightness(1.1)" : "none" 
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
          position: "absolute", bottom: "160px", right: "20px", cursor: "pointer", fontSize: "50px",
          zIndex: 100,
          animation: "floatNitro 2s ease-in-out infinite",
          filter: "drop-shadow(0 0 15px #ff4444)"
        }}
      >
        🔥
      </div>
    )}
  </div> 
)} {/* پایان تپ */}
{/* صفحه ماین */}
{activeTab === "Mine" && (
  <div style={{  position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", padding: "0px", height: "100%", overflow: "hidden", backgroundColor: "#1a1a1a", zIndex: 500  }}>
    {/* ۱. بخش موجودی‌ها (بالا) */}
    <div style={{  width: "90%", backgroundColor: "rgba(0,0,0,0.8)",  backdropFilter: "blur(12px)", borderRadius: "0 0 30px 30px", padding: "15px 15px", opacity: 0.8, zIndex: 10, borderBottom: "2px solid rgba(255,215,0,0.3)", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
    <div style={{  width: "90%",  display: "flex", justifyContent: "space-between", alignItems: "center",  borderTop: "1px solid rgba(255,255,255,0.1)",  paddingTop: "10px"  }}>
        <div style={{ color: "#ffd700", fontSize: "15px", fontWeight: "bold" }}>
    Profit: {totalProfit.toLocaleString()}
</div>
        <div style={{ color: "#fff", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>🕒</span>
            <span>5min</span>
        </div>
    </div>

    {/* namayeshgare bozorge hoshmand*/}
<div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(255,215,0,0.1)", padding: "4px 30px", borderRadius: "20px",  border: `1px solid ${isRedActive ? "#f44336" : isOrangeActive ? "#ff9800" : "#4CAF50"}`, width: "fit-content" }}>
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
    <div style={{  position: "absolute", top: "0%", left: "0%", width: "100%",  height: "100%",  opacity: 0.8,  zIndex: 0,  pointerEvents: "none"   }}>
              <img src="/chef-robot.jpg" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>

    {/* ۳. بخش کارتریج‌ها (قفل شده به پایین صفحه) */}
            <div style={{ flex: 1 }} /> 

    {/* kartrij ha*/}
<div style={{  width: "90%",  display: "flex",   justifyContent: "center",  alignItems: "flex-end",  gap: "25px",  zIndex: 5,  marginBottom: "60px",  padding: "15px", borderRadius: "20px" }}>
  {/* کارتریج سبز */}
  <img 
    onClick={() => {setIsGreenActive(!isGreenActive); setIsRedActive(false); setIsOrangeActive(false); playSwitchSound();}} 
    src={isGreenActive ? "/cartridge-green-on.png" : "/cartridge-green-off.png"} 
    style={{  width: "75px",  cursor: "pointer",  filter: isGreenActive ? "drop-shadow(0 0 15px rgba(76, 175, 80, 0.8))" : "none", transition: "0.3s"  }} 
  />

  {/* کارتریج قرمز */}
  <img 
    onClick={() => {setIsRedActive(!isRedActive); setIsGreenActive(false); setIsOrangeActive(false); playSwitchSound();}} 
    src={isRedActive ? "/cartridge-red-on.png" : "/cartridge-red-off.png"} 
    style={{  width: "75px",  cursor: "pointer",  filter: isRedActive ? "drop-shadow(0 0 15px rgba(244, 67, 54, 0.8))" : "none",  transition: "0.3s"  }} 
  />

  {/* کارتریج نارنجی */}
  <img 
    onClick={() => {setIsOrangeActive(!isOrangeActive); setIsGreenActive(false); setIsRedActive(false); playSwitchSound();}} 
    src={isOrangeActive ? "/cartridge-orange-on.png" : "/cartridge-orange-off.png"} 
    style={{  width: "75px",  cursor: "pointer", filter: isOrangeActive ? "drop-shadow(0 0 15px rgba(255, 152, 0, 0.8))" : "none",  transition: "0.3s"   }} 
  />
</div>
  </div>
)} {/* پایان ماین */}
{/* صفحه فایت */}
{activeTab === "Fight" && (
  <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%",    
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)), url('/fight-back.jpg')`,
    backgroundSize: "cover", backgroundPosition: "center", zIndex: 9000, display: "flex",  flexDirection: "column",  alignItems: "center", padding: "20px 20px 140px 20px",  overflowY: "auto", boxSizing: "border-box"  }}>
    
    {/* محتوای دکمه‌ها */}
    <div style={{
       width: "90%", 
       maxWidth: "400px", 
       display: "flex", 
       flexDirection: "column",
       marginTop: "50px"
       
       }}>
      <FightButton text="INVITE A FRIEND TO FIGHT" color="#4a6fa5" textColor="#f0db4f" />
      <FightButton text="RANDOM FIGHT" color="#2ecc71" textColor="#e26557ff" fontSize="20px" />
      <FightButton text="MAKE A FIGHT" color="#f1c40f" textColor="#e7549bff" fontSize="25px" />
      <FightButton text="DAILY LEAGUES" color="#e67e22" textColor="#82989eff" fontSize="20px"/>
      <FightButton text="CHAMPION" color="#e74c3c" textColor="white" fontSize="45px" />
      
      <div style={{ height: "40px" }} />
      
      <FightButton text="SHOW MY FIGHTS" color="#9b59b6" textColor="#2ecc71" />
      <FightButton text="MAKE A LEAGUE" color="#ffffff" textColor="#77d4e0ff"/>
    </div>
  </div>
)} {/* پایان فایت */}
{/* صفحه لایبرری */}
{activeTab === "Library" && (
  <div style={{ position: "fixed", top: 0, left: 0, width: "100%",  height: "100%", backgroundImage: "url('/closet-back.jpg')", backgroundSize: "cover", zIndex: 1500, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px"  }}>

    {/* Header دو ردیفه */}
    <div style={{ width: "100%", display: "flex", flexDirection: "column",  alignItems: "center", marginBottom: "30px",  gap: "20px"  }}>
      
      {/* ردیف عنوان و دکمه بازگشت */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", position: "relative" }}>
       

        <h1 style={{  textAlign: "center",  color: "white",  fontSize: "24px", fontWeight: "900", margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
          LIBRARY
        </h1>
      </div>

      {/* ردیف دوم: دکمه‌های والت و شاپ */}
      <div style={{  width: "100%", display: "flex",  justifyContent: "space-between", alignItems: "center",  padding: "0 10px" }}>
        
        {/* دکمه والت (ماکت) */}
        <div style={{ transform: "scale(0.9)" }}>
          <button 
            onClick={() => setIsFakeConnected(!isFakeConnected)}
            style={{  backgroundColor: "#0098ea",  color: "white",  border: "none", padding: "10px 18px", borderRadius: "12px", fontWeight: "bold",  fontSize: "14px",  cursor: "pointer",  display: "flex",  alignItems: "center", gap: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
          >
            <div style={{ width: 8, height: 8, backgroundColor: isFakeConnected ? "#4CAF50" : "#FF5252", borderRadius: "50%"  }} />
            {isFakeConnected ? "UQAr...420j" : "Connect"}
          </button>
        </div>

        {/* دکمه شاپ */}
        <button 
          onClick={() => alert("Shop will open soon!")}
          style={{ backgroundColor: "#ffc107", color: "black", padding: "10px 22px", borderRadius: "14px", fontWeight: "bold", border: "none", fontSize: "14px",  boxShadow: "0 4px 10px rgba(255, 193, 7, 0.4)" }}
        >
          SHOP
        </button>
      </div>
    </div>
    {/* بخش بالایی: ۳ ستون (NFTs) */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)",  gap: "10px", width: "90%", maxWidth: "600px", marginBottom: "30px" }}>
      {[...Array(3)].map((_, index) => (
        <div 
          key={index} 
          style={{ width: "100%",  paddingTop: "100%", backgroundColor: "rgba(255,255,255,0.1)",  borderRadius: "10px",  border: "1px dashed rgba(255,255,255,0.3)",  position: "relative" }}
        >
          <span style={{  position: "absolute",  top: "50%",  left: "50%",  transform: "translate(-50%, -50%)",  color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: "bold",  whiteSpace: "nowrap"  }}>
            NFT {index + 1}
          </span>
        </div>
      ))}
    </div>
    {/* بخش پایینی: ۴ ستون (Items) */}
    <div style={{  display: "grid",  gridTemplateColumns: "repeat(4, 1fr)",  gap: "8px",  width: "90%",  maxWidth: "600px",  marginBottom: "20px"  }}>
      {[...Array(5)].map((_, index) => (
        <div 
          key={index} 
          style={{  width: "100%", paddingTop: "100%",  backgroundColor: "rgba(255,255,255,0.1)",  borderRadius: "8px",  border: "1px dashed rgba(255,255,255,0.3)",  position: "relative"  }}
        >
          <span style={{  position: "absolute",  top: "50%", left: "50%", transform: "translate(-50%, -50%)",  color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: "bold", whiteSpace: "nowrap"  }}>
            NFT {index + 1}
          </span>
        </div>
      ))}
    </div>
  </div>
)} {/* پایان لایبرری */}
      {/* صفحه کارت */}
{activeTab === "Cards" && (
  <div style={{ position: "fixed", inset: 0, zIndex: 2000,  backgroundColor: "#121212", display: "flex", flexDirection: "column"  }}>
          {/* لیست کارت‌ها با اسکرول عمودی */}
    <div style={{ flex: 1, overflowY: "auto", padding: "20px",  display: "grid", gridTemplateColumns: "1fr 1fr",  gap: "15px", paddingBottom: "100px"  }}>
      {CARDS_DATA.filter(card => 
        card.visibleAfter === null || purchasedCards.includes(card.visibleAfter)
      ).map(card => {
        const alreadyBought = purchasedCards.includes(card.id);
        const isLocked = !!(card.requireToBuy && !purchasedCards.includes(card.requireToBuy));

        return (
          <div key={card.id} style={{  background: "#222",  borderRadius: "15px", padding: "10px", opacity: alreadyBought ? 0.6 : 1,  filter: isLocked ? "grayscale(1)" : "none", textAlign: "center",  border: isLocked ? "1px solid #444" : "1px solid #333"  }}>
            <img src={card.image} style={{ width: "100%", borderRadius: "10px" }} alt={card.name} />
            <h4 style={{ margin: "10px 0 5px 0", fontSize: "14px" }}>{card.name}</h4>
            <p style={{ fontSize: "12px", color: "#4CAF50", marginBottom: "10px" }}>+{card.profitBoost} P/h</p>
            
            <button 
              disabled={alreadyBought || isLocked}
              onClick={() => handleBuyCard(card)}
              style={{  width: "100%",  padding: "10px", backgroundColor: alreadyBought ? "#444" : isLocked ? "#333" : "#ffd700",
                color: alreadyBought ? "#888" : "#000",  borderRadius: "10px",  border: "none", fontWeight: "bold", fontSize: "12px" }}
            >
              {alreadyBought ? "Owned" : isLocked ? "Locked 🔒" : `${card.cost.toLocaleString()} 🟢`}
            </button>
          </div>
        );
      })}
    </div>
  </div>
)} {/* پایان کاردز */}


{/* صفحه کیو آر*/}
{activeTab === "QR" && (
  <div style={{ position: "fixed", inset: 0, zIndex: 2500,  backgroundColor: "#121212", display: "flex",  flexDirection: "column",  color: "white"  }}>
    
    {/* هدر صفحه دیباگ */}
    <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #333" }}>
         <h2 style={{ margin: 0, fontSize: "20px" }}>🛠 Test & Debug</h2>
      <button 
        onClick={() => setActiveTab('Tap')} 
        style={{ backgroundColor: "#ff4757", color: "white", border: "none", padding: "8px 15px", borderRadius: "10px", fontWeight: "bold" }}
          >
        Close ✕
      </button>
    </div>
    {/* محتوای تنظیمات */}
    <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
      <div style={{  background: "rgba(255, 255, 255, 0.05)", padding: "20px", borderRadius: "20px",  border: "1px solid rgba(255,255,255,0.1)"   }}>
          {/* ردیف‌های تنظیم مقادیر سکه‌ها و انرژی */}
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
        <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "15px 0" }} />
        {/* شارژ نیترو */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
          <span style={{ color: "#ff4444", fontWeight: "bold" }}>Nitro (🔥 {nitroCharges}/3)</span>
          <button 
            onClick={() => {
              setNitroCharges(3);
              alert("نیترو شارژ شد!");
            }} 
            style={{ background: "#ff4444", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 15px", fontWeight: "bold" }}
          >
            Refill Nitro
          </button>
        </div>
        {/* شارژ انرژی */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
          <span style={{ color: "#2196F3", fontWeight: "bold" }}>Energy (⚡ {energyCharges}/3)</span>
          <button 
            onClick={() => {
              setEnergyCharges(3);
              alert("انرژی شارژ شد!");
            }} 
            style={{ background: "#2196F3", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 15px", fontWeight: "bold" }}
          >
            Refill Energy
          </button>
        </div>
        {/* دکمه حالت تست کلی */}
        <button 
          onClick={() => {
            setGreenCoins(999999);
            setMaxSpinsPerDay(999);
            setSpinsUsedToday(0);
            alert("Test Mode Activated!");
          }}
          style={{  width: "100%", padding: "15px", backgroundColor: "#4CAF50", color: "white", borderRadius: "12px", border: "none", fontWeight: "bold",    
            marginTop: "15px"
          }}
        >
          Activate Test Mode (Max All)
        </button>
      </div>
    </div>
  </div>
)} {/* پایان صفحه QR  */}


 {/* صفحه boost */}
{activeTab === "Boost" && (
  <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", color: "white", backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/boost-back.jpg')", backgroundSize: "cover", backgroundPosition: "center", overflowY: "auto",  paddingBottom: "120px", zIndex: 1000  }}>
    
    <h2 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "30px", marginTop: "20px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>BOOST</h2>

    {/* بخش آیکون‌های بالایی: شارژ نیترو و انرژی */}
    <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
      {/* دکمه نیترو */}
      <div 
        onClick={() => {
          const lastUsed = localStorage.getItem("lastNitroReset");
          const now = Date.now();
          if (!lastUsed || now - Number(lastUsed) > 24 * 60 * 60 * 1000) {
            setNitroCharges(3);
            localStorage.setItem("lastNitroReset", now.toString());
          }
          if (nitroCharges > 0 && !isNitroReady && !isNitroActive) {
            setNitroCharges(prev => prev - 1);
            setIsNitroReady(true);
            // playSwitchSound(); // در صورت داشتن فایل صوتی فعال کنید
          }
        }}
        style={{ 
          display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", 
          fontWeight: "bold", cursor: "pointer",
          opacity: (nitroCharges === 0) ? 0.5 : 1,
          background: "rgba(255,255,255,0.1)", padding: "10px 20px", borderRadius: "15px"
        }}
      >
        <span style={{ fontSize: "24px" }}>🔥</span>
        <span>{nitroCharges}/3</span>
      </div>
            {/* دکمه پر کردن انرژی */}
      <div 
        onClick={() => {
          const lastReset = localStorage.getItem("lastEnergyReset");
          const now = Date.now();
          if (!lastReset || now - Number(lastReset) > 86400000) {
            setEnergyCharges(3);
            localStorage.setItem("lastEnergyReset", now.toString());
          }
          if (energyCharges > 0) {
            setEnergy(500);
            setEnergyCharges(prev => prev - 1);
          } else {
            alert("Daily energy limit reached!");
          }
        }}
        style={{ 
          display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", 
          fontWeight: "bold", cursor: "pointer",
          opacity: energyCharges === 0 ? 0.5 : 1,
          background: "rgba(255,255,255,0.1)", padding: "10px 20px", borderRadius: "15px"
        }}
      >
        <span style={{ fontSize: "24px" }}>⚡</span>
        <span>{energyCharges}/3</span>
      </div>
    </div>
    {/* لیست وضعیت ارتقاها (Stats) */}
    <div style={{ width: "100%", maxWidth: "300px", marginBottom: "40px", background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "20px" }}>
      {[
        { label: "Multi tap", value: "x1", icon: "👆" },
        { label: "Energy limit", value: "500", icon: "🔋" },
        { label: "Recharge speed", value: "60/m", icon: "🕒" },
      ].map((stat, index) => (
        <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "16px" }}>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{stat.icon} {stat.label}</span>
          <span style={{ fontWeight: "bold" }}>{stat.value}</span>
        </div>
      ))}
    </div>
    {/* فضای خالی برای هل دادن دکمه‌ها به پایین */}
    <div style={{ flex: 1 }} />
    {/* دکمه‌های شبکه‌ای (منوهای فرعی) */}
    <div style={{  display: "grid",  gridTemplateColumns: "repeat(3, 1fr)",  gap: "10px",  width: "90%", maxWidth: "400px", marginBottom: "20px"   }}>
      {["Daily", "Task", "Rank", "Squad", "State"].map((label, index) => (
        <button
          key={index} 
          onClick={() => setActiveTab(label)} 
          style={{    padding: "11px 10px",  border: "1px solid rgba(255,255,255,0.2)",  borderRadius: "12px",   background: "rgba(54, 54, 54, 0.6)",   fontSize: "14px",   fontWeight: "bold",  color: "white", backdropFilter: "blur(10px)", cursor: "pointer", transition: "transform 0.1s"  }}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
)} {/* پایان بوست */}


{/* Daily Rewards Page - New Navigation System */}
{activeTab === "Daily" && (
  <div style={{  position: "fixed",  top: 0,  left: 0,  width: "100%",  height: "100%",  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/daily-back.jpg')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 2000,  display: "flex",  flexDirection: "column", color: "white" }}>
        {/* هدر صفحه */}
    <div style={{ display: "flex", alignItems: "center", padding: "20px 20px", position: "relative" }}>
      <button 
        onClick={() => setActiveTab("Boost")} // بازگشت به منوی قبلی
        >
        <img src="/back-butt.png" style={{ width: "7px" }} />
      </button>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{ fontSize: "12px", fontWeight: "bold", opacity: 0.7, letterSpacing: "1px" }}>NINJA POTATO</div>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "900", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>Daily Rewards</h2>
      </div>
      <div style={{ width: "30px" }}></div> 
    </div>

    <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}>
      
      {/* دکمه‌های Spin و Ninja Code */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
        
        {/* دکمه Spin Wheel */}
        <div 
          onClick={() => setActiveTab("Spin")} // هماهنگ با سیستم تب‌ها
          style={{   width: "90%", padding: "10px", borderRadius: "15px",  background: "rgba(54, 54, 54, 0.7)",  border: canSpin ? "1px solid #4CAF50" : "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            textAlign: "center", cursor: "pointer"
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>🎡 Spin Wheel</div>
          <div style={{ fontSize: "13px", color: canSpin ? "#4CAF50" : "#ffd700", fontWeight: "bold", marginTop: "4px" }}>
            {spinTimer}
          </div>
        </div>

        {/* دکمه Daily Ninja Code */}
        <div 
          onClick={() => setActiveTab("NinjaCode")} 
          style={{   width: "90%", padding: "10px", borderRadius: "15px",   background: "rgba(54, 54, 54, 0.7)",   border: "1px solid rgba(255,255,255,0.2)",  backdropFilter: "blur(10px)",  textAlign: "center", cursor: "pointer"  }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>㊙️ Daily Ninja Code</div>
          <div style={{ fontSize: "13px", color: "#ffd700", marginTop: "4px" }}>Enter Code to Claim Reward</div>
        </div>
      </div>

      {/* شبکه پاداش‌های روزانه */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4, 1fr)", // تغییر به ۴ ستون برای نمایش بهتر در موبایل
        gap: "15px", 
        paddingBottom: "100px" 
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
              onClick={() => !showAsLocked && handleClaimReward(i)}
              style={{ 
                aspectRatio: "1/1",
                background: isCurrent && canClaim ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.1)", 
                backdropFilter: "blur(5px)",   borderRadius: "12px",   display: "flex",   flexDirection: "column",   alignItems: "center",  justifyContent: "center",  border: isCurrent && canClaim ? "2px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.2)", 
                cursor: showAsLocked ? "not-allowed" : "pointer",  boxShadow: isCurrent && canClaim ? "0 0 15px rgba(255, 255, 255, 0.4)" : "none",
                transition: "transform 0.2s"  }}
            >
              <span style={{ fontSize: "12px", fontWeight: "bold", position: "absolute", top: "5px", left: "8px", opacity: 0.6 }}>
                {dayNumber}
              </span>
              <span style={{ fontSize: "28px", filter: isCurrent && canClaim ? "drop-shadow(0 0 5px white)" : "none" }}>
                {isClaimed ? "✅" : (showAsLocked ? "🔒" : "🎁")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)} {/* پایان دیلی */}

 {/* صفحه گردونه شانس - New Navigation System */}
{activeTab === "Spin" && (
  <div style={{  position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url('/spin-back.jpg')`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 20000,  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"  }}>
    
    {/* دکمه بازگشت در بالا با سایز 7px */}
    <div style={{ position: "absolute", top: "25px", left: "20px" }}>
      <button 
        onClick={() => {
          setRotation(0); // ریست کردن چرخش
          setActiveTab("Daily"); // بازگشت به صفحه جوایز روزانه
        }} 
        style={{ background: "none", border: "none", cursor: "pointer", padding: "10px" }}
      >
        <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
      </button>
    </div>

    {/* محتوای گردونه */}
    <div style={{ position: "relative", width: "280px", height: "280px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      
      {/* نشانگر ثابت (فلش نارنجی بالای گردونه) */}
      <div style={{  position: "absolute", top: "-15px", zIndex: 10, width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderTop: "30px solid #e98f28"  }}>
      </div>

      {/* نور نئون آبی زیرین (Glow Effect) */}
      <div style={{  position: "absolute", width: "260px", height: "260px", borderRadius: "50%", backgroundColor: "rgba(0, 183, 255, 0.4)",  filter: "blur(60px)",  boxShadow: "0 0 20px 10px rgba(0, 150, 255, 0.3)", zIndex: 1  }} />

      {/* بدنه گردونه که می‌چرخد */}
      <div style={{ width: "100%", height: "100%", borderRadius: "50%",  position: "relative", transition: "transform 4s cubic-bezier(0.15, 0, 0.15, 1)", transform: `rotate(${rotation}deg)`, backgroundImage: "url('/spinwheel.png')",  backgroundSize: "cover",  backgroundPosition: "center",  zIndex: 2,  border: "4px solid rgba(255,255,255,0.1)"  }}>
      </div>

      {/* دکمه مرکزی SPIN */}
      <div 
        onClick={spinTheWheel}
        style={{  position: "absolute",  width: "65px", height: "65px", borderRadius: "50%", backgroundColor: "#fff", color: "#000",  fontWeight: "900",  fontSize: "14px", display: "flex",  justifyContent: "center", alignItems: "center",  cursor: "pointer", zIndex: 5, boxShadow: "0 4px 15px rgba(0,0,0,0.5)",  border: "none",  userSelect: "none"  }}
      >
        SPIN
      </div>
    </div>
    {/* نمایش تعداد اسپین‌های باقی‌مانده (اختیاری برای راهنمایی کاربر) */}
    <div style={{ marginTop: "40px", color: "white", backgroundColor: "rgba(0,0,0,0.5)", padding: "8px 20px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
      Spins left: {maxSpinsPerDay - spinsUsedToday}
    </div>
  </div>
)} {/* پایان اسپین ویل */}

{/* صفحه نینجا کد */}
{activeTab === "NinjaCode" && (
  <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/ninjacode-back.jpg')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 20000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "40px 20px 60px 20px", boxSizing: "border-box"  }}>
    
    {/* دکمه بازگشت در بالا سمت چپ با سایز 7p */}
    <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 20110 }}>
      <button 
        onClick={() => setActiveTab("Daily")} // بازگشت به صفحه جوایز روزانه
        style={{ background: "none", border: "none", cursor: "pointer", padding: "10px" }}
      >
        <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
      </button>
    </div>

    {/* نوار راهنمای کد (سمبل‌ها) */}
    <div style={{  position: "absolute",  top: "100px",  width: "100%",  display: "flex",  justifyContent: "center",  gap: "15px",  zIndex: 20100  }}>
      {["circle", "right", "left", "up", "down"].map((symbolType, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ 
            times: [0, 0.05, 0.85, 1], 
            duration: 4, 
            delay: 1 + index * 0.65, 
            ease: "easeOut"
          }}
          style={{ filter: "drop-shadow(0 0 8px rgba(255, 0, 0, 0.8))" }}
        >
          {renderSymbol(symbolType)}
        </motion.div>
      ))}
    </div>

    {/* انیمیشن حلقه‌های قرمز روی صفحه */}
    {circlePositions.map((pos, index) => (
      <motion.div
        key={pos.id}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }}
        transition={{ 
          duration: 0.8, 
          delay: 1 + index * 0.6, 
          ease: "easeOut" 
        }}
        style={{  position: "fixed", top: pos.top, left: pos.left, x: "-50%",  y: "-50%",  width: "70px", height: "70px",  borderRadius: "50%",  border: "3px solid #ff0000",  boxShadow: "0 0 20px rgba(255, 0, 0, 0.7)",  zIndex: 20005,  pointerEvents: "none"  }}
      />
    ))}

    {/* محتوای وسط (عنوان صفحه) */}
    <div style={{ marginTop: "100px", textAlign: "center", zIndex: 10 }}>
        <h2 style={{ color: "white", fontSize: "22px", fontWeight: "900", textShadow: "0 0 15px red" }}>NINJA SENSE</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>Follow the pattern to unlock</p>
    </div>

    {/* دکمه Code Library در پایین صفحه */}
    <button 
      onClick={() => setActiveTab("CodeList")} // تغییر به سیستم جدید
      style={{ width: "60%", padding: "15px", borderRadius: "15px", background: "rgba(41, 40, 40, 0.8)",  border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",  WebkitBackdropFilter: "blur(10px)",  color: "white", cursor: "pointer",  textAlign: "center",  boxShadow: "0 4px 15px rgba(0,0,0,0.3)", zIndex: 20100 }}
    >
      <div style={{ fontSize: "16px", fontWeight: "bold" }}>📜 Code Library</div>
    </button>
  </div>
)} {/* پایان نینجا کد */}

{/* صفحه کد لایبرری */}
{activeTab === "CodeList" && (
  <div style={{  position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "url('/codelibrary-back.jpg')", backgroundSize: "cover", backgroundPosition: "center",  zIndex: 21000,  display: "flex", flexDirection: "column", alignItems: "center", padding: "20px"  }}>
    {/* دکمه بازگشت با سایز 7px */}
    <div style={{ width: "100%", display: "flex", justifyContent: "flex-start", marginTop: "10px" }}>
      <button 
        onClick={() => setActiveTab("NinjaCode")} // بازگشت به صفحه قبلی
        style={{ background: "none", border: "none", cursor: "pointer", padding: "10px" }}
      >
        <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
      </button>
    </div>

    {/* محتوا (فعلاً خالی برای کدهای آینده) */}
    <div style={{ marginTop: "50px", textAlign: "center" }}>
      <h2 style={{ color: "white", textShadow: "0 0 10px rgba(0,0,0,0.5)" }}>
        CODE ARCHIVE
      </h2>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
        Your discovered codes will appear here...
      </p>
    </div>
  </div>
)} {/* پایان کد لایبرری */}

{/* Task Page - Unified System */}
{activeTab === "Task" && (
  <div style={{
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%",
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/task-back.jpg')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 2010, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    padding: "20px 20px 140px 20px", // پدینگ پایین برای نرفتن زیر منو
    boxSizing: "border-box"
  }}>
    
    {/* نوار بالایی: دکمه بازگشت و عنوان */}
    <div style={{ 
      width: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      marginBottom: "20px",
      marginTop: "10px"
    }}>
      <button 
        onClick={() => setActiveTab("Boost")} // بازگشت به منوی بوست
        style={{ background: "none", border: "none", cursor: "pointer", padding: "10px" }}
      >
        <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
      </button>
      
      <h1 style={{ 
        color: "white", 
        fontSize: "24px", 
        fontWeight: "900", 
        margin: 0, 
        flex: 1, 
        textAlign: "center", 
        marginRight: "30px",
        textShadow: "0 2px 10px rgba(0,0,0,0.8)",
        letterSpacing: "1px"
      }}>
        TASKS
      </h1>
    </div>

    {/* بخش نمایش سکه‌های قرمز (Red Coins) */}
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "rgba(0, 0, 0, 0.75)",
      padding: "10px 25px",
      borderRadius: "25px",
      border: "1px solid rgba(255, 0, 0, 0.4)",
      marginBottom: "30px",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 15px rgba(255, 0, 0, 0.2)"
    }}>
      <img src="/currency-r.png" style={{ width: "22px", height: "22px" }} alt="Red Coin" />
      <span style={{ 
        color: "#ffffff", 
        fontSize: "22px", 
        fontWeight: "900",
        textShadow: "0 0 8px rgba(255, 0, 0, 0.6)" 
      }}>
        {redCoins?.toLocaleString() || 0}
      </span>
    </div>

    {/* لیست تسک‌ها */}
    <div style={{ 
      width: "100%", 
      maxWidth: "400px",
      display: "flex", 
      flexDirection: "column", 
      gap: "12px",
      overflowY: "auto",
      paddingBottom: "20px"
    }}>
      {/* محفظه خالی برای تسک‌های آینده */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "20px",
        padding: "40px 20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        textAlign: "center",
        backdropFilter: "blur(5px)"
      }}>
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>📜</div>
        <p style={{ color: "white", fontSize: "16px", fontWeight: "bold", margin: "0" }}>
          New Tasks Loading...
        </p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "10px" }}>
          Complete daily challenges to earn more Red Coins!
        </p>
      </div>
    </div>

  </div>
)} {/* پایان تسک */}
{/* صفحه اسکواد */}
{activeTab === "Squad" && (
  <div style={{
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%",
    backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('/squad-back.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 2000, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    padding: "20px 20px 140px 20px",
    boxSizing: "border-box",
    overflowY: "auto"
  }}>
    
    {/* نوار بالایی: دکمه بازگشت و عنوان */}
    <div style={{ 
      width: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      marginBottom: "20px",
      marginTop: "10px"
    }}>
      <button 
        onClick={() => setActiveTab("Boost")} // بازگشت به منوی بوست
        style={{ background: "none", border: "none", cursor: "pointer", padding: "10px" }}
      >
        <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
      </button>
      
      <h1 style={{ 
        color: "white", 
        fontSize: "24px", 
        fontWeight: "900", 
        margin: 0, 
        flex: 1, 
        textAlign: "center", 
        marginRight: "30px",
        textShadow: "2px 2px 10px rgba(0,0,0,0.8)",
        letterSpacing: "1px"
      }}>
        SQUAD
      </h1>
    </div>

    {/* نمایش سکه‌های نارنجی */}
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "rgba(0, 0, 0, 0.75)",
      padding: "10px 25px",
      borderRadius: "25px",
      border: "1px solid rgba(255, 165, 0, 0.5)", 
      marginBottom: "40px",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 15px rgba(255, 165, 0, 0.2)"
    }}>
      <img src="/currency-t.png" style={{ width: "24px", height: "24px" }} alt="Orange Coin" />
      <span style={{ 
        color: "#ffa500", 
        fontSize: "24px", 
        fontWeight: "900",
        textShadow: "0 0 10px rgba(255, 165, 0, 0.5)" 
      }}>
        {orangeCoins?.toLocaleString() || 0}
      </span>
    </div>

    {/* محتوای صفحه اسکواد */}
    <div style={{ 
      width: "100%", 
      maxWidth: "400px", 
      textAlign: "center",
      background: "rgba(255,255,255,0.05)",
      padding: "30px 20px",
      borderRadius: "20px",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(5px)"
    }}>
       <p style={{ color: "white", fontSize: "18px", fontWeight: "bold", margin: "0 0 10px 0" }}>
         Join a Squad to play together!
       </p>
       <div style={{ width: "40px", height: "2px", background: "#ffa500", margin: "15px auto" }} />
       <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: "1.6" }}>
         The Squad system is currently under development.<br/>
         Stay tuned for epic team battles!
       </p>
    </div>

  </div>
)} {/* پایان اسکواد */}
{/* صفحه رنکینگ */}
{activeTab === "Rank" && (
  <div style={{
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%",
    backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('/rank-back.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 2000, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    padding: "20px 20px 140px 20px",
    boxSizing: "border-box", 
    overflowY: "auto"
  }}>
    
    {/* هدر صفحه رنکینگ */}
    <div style={{ 
      width: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      marginBottom: "20px",
      marginTop: "10px"
    }}>
      <button 
        onClick={() => setActiveTab("Boost")} // بازگشت به منوی بوست
        style={{ background: "none", border: "none", cursor: "pointer", padding: "10px" }}
      >
        <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
      </button>
      <h1 style={{ 
        color: "white", 
        fontSize: "24px", 
        fontWeight: "900", 
        margin: 0, 
        flex: 1, 
        textAlign: "center", 
        marginRight: "30px", 
        textShadow: "2px 2px 10px rgba(0,0,0,0.8)",
        letterSpacing: "1px"
      }}>
        LEADERBOARD
      </h1>
    </div>

    {/* کادر رتبه شخصی کاربر */}
    <div style={{
      width: "100%", 
      maxWidth: "400px", 
      background: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(12px)", 
      borderRadius: "18px", 
      padding: "18px",
      border: "1px solid rgba(255, 255, 255, 0.2)", 
      marginBottom: "25px",
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ color: "#ffd700", fontWeight: "900", fontSize: "22px" }}>#128</span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>Your Rank</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>Global Ninja</span>
        </div>
      </div>
      <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>{(0).toLocaleString()} 🪙</span>
    </div>

    {/* لیست برترین‌ها */}
    <div style={{ 
      width: "100%", 
      maxWidth: "400px", 
      display: "flex", 
      flexDirection: "column", 
      gap: "10px" 
    }}>
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} style={{
          width: "100%", 
          background: i <= 3 ? "rgba(255, 215, 0, 0.1)" : "rgba(0, 0, 0, 0.4)", 
          padding: "14px",
          borderRadius: "15px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          border: i <= 3 ? "1px solid rgba(255, 215, 0, 0.3)" : "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ 
              color: i === 1 ? "#ffd700" : i === 2 ? "#c0c0c0" : i === 3 ? "#cd7f32" : "#888", 
              fontWeight: "900",
              fontSize: "18px",
              width: "25px"
            }}>
              {i}
            </span>
            <span style={{ color: "white", fontWeight: "500" }}>Player_{i}42</span>
          </div>
          <span style={{ color: "#4db8ff", fontWeight: "bold" }}>1.{8-i}M</span>
        </div>
      ))}
    </div>

  </div>
)} {/* پایان رنکینگ */}
{/* صفحه استیت (State) - Unified System */}
{activeTab === "State" && (
  <div style={{
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%",
    backgroundColor: "#16181d", 
    zIndex: 2000, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    padding: "20px 20px 140px 20px",
    boxSizing: "border-box", 
    overflowY: "auto"
  }}>
    
    {/* هدر صفحه استیت */}
    <div style={{ 
      width: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      marginBottom: "30px",
      marginTop: "10px"
    }}>
      <button 
        onClick={() => setActiveTab("Boost")} // بازگشت به صفحه بوست
        style={{ background: "none", border: "none", cursor: "pointer", padding: "10px" }}
      >
        <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
      </button>
      <h1 style={{ color: "white", fontSize: "24px", fontWeight: "900", margin: 0, flex: 1, textAlign: "center", marginRight: "30px", letterSpacing: "1px" }}>
        STATISTICS
      </h1>
    </div>

    {/* کارت‌های اطلاعاتی */}
    <div style={{ 
      width: "100%", 
      maxWidth: "400px", 
      display: "grid", 
      gridTemplateColumns: "1fr 1fr", 
      gap: "15px" 
    }}>
      {[
        { label: "Total Taps", value: "1.2M", color: "#ffffff" },
        { label: "Fights Won", value: "42", color: "#2ecc71" },
        { label: "Friends Invited", value: "12", color: "#f1c40f" },
        { label: "Daily Streak", value: "5 Days", color: "#e74c3c" }
      ].map((stat, index) => (
        <div 
          key={index}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            padding: "20px 15px",
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <span style={{ color: "#888", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>{stat.label}</span>
          <span style={{ color: stat.color, fontSize: "20px", fontWeight: "900" }}>{stat.value}</span>
        </div>
      ))}
    </div>

    {/* بخش اضافی برای جزئیات بیشتر (اختیاری) */}
    <div style={{
      width: "100%",
      maxWidth: "400px",
      marginTop: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      borderRadius: "15px",
      padding: "15px",
      border: "1px solid rgba(255, 255, 255, 0.05)"
    }}>
       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ color: "#aaa", fontSize: "14px" }}>Account Age</span>
          <span style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>14 Days</span>
       </div>
       <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#aaa", fontSize: "14px" }}>Ninja Rank</span>
          <span style={{ color: "#ffd700", fontSize: "14px", fontWeight: "bold" }}>Gold Warrior</span>
       </div>
    </div>

  </div>
)} {/* پایان استیت */}
     
        
          </motion.div>
 </>
   
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#000" }}>
    
    {/* --- و حالا صفحه سالاد (دقیقاً مثل بقیه) --- */}
  {activeTab === "Salad" && (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/salad-back.jpg')",
      backgroundSize: "cover", backgroundPosition: "center",
      zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center"
    }}>
      {/* دکمه بازگشت با سایز 7px */}
      <button 
        onClick={() => setActiveTab("Tap")} 
        style={{ position: "absolute", top: "20px", left: "20px", background: "none", border: "none" }}
      >
        <img src="/back-butt.png" style={{ width: "7px" }} alt="Back" />
      </button>
        {/* ۱. بخش تعداد سالاد */}
        <div style={{  marginTop: "100px", display: "flex", backgroundColor: "rgba(0,0,0,0.5)",  padding: "10px 20px",   borderRadius: "15px",  flexDirection: "row-reverse",  alignItems: "center",  gap: "10px"  }}>
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
    onClick={() => setIsMakingSalad(true)} 
    style={{  width: "120px", cursor: "pointer", filter: "drop-shadow(0px 8px 10px rgba(0,0,0,0.4))", transform: isMakingSalad ? "scale(1)" : "scale(1.1)",  transition: "0.3s"  }}
  />

  {/* Progress Bar */}
  <div style={{ width: "250px", height: "12px", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "6px", overflow: "hidden", marginTop: "20px" }}>
    <div style={{ 
      width: isMakingSalad ? `${((3600 - timeLeft) / 3600) * 100}%` : "0%", 
      height: "100%", 
      backgroundColor: "#0098ea", 
      transition: "width 1s linear" 
    }} />
  </div>

  {/* Timer Text */}
  <span style={{ marginTop: "8px", fontSize: "14px", fontWeight: "bold", color: "white" }}>
    {isMakingSalad ? `Ready in: ${formatTime(timeLeft)}` : "Tap to start making salad"}
  </span>
</div>
      </div>
    )}
  </div>

{/* Footer Navigation (Fixed) */}
 <div style={{  display: "flex", justifyContent: "center",  alignItems: "center", width: "100%", gap: "20px", zIndex: 9999, paddingBottom: "15px", position: "absolute", bottom: 0, left: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", paddingTop: "20px" }}>

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
    setActiveTab(label); // فقط همین یک خط کافی است
    playSwitchSound();
     }}
        style={{ background: "none",  border: "none",  display: "flex", justifyContent: "center",  alignItems: "center",  padding: "5px", cursor: "pointer" }}
      >
        <img 
          src={footerIcons[label]} 
          style={{  height: "40px",  filter: isActive ? "none" : "grayscale(100%)",  opacity: isActive ? 1 : 0.6,  transform: isActive ? "scale(1.1)" : "scale(1)",  transition: "0.2s"  }} 
        />
      </button>
    );
  })}
 </div>
 {floatingNumbers.map(num => (
    <div key={num.id} style={{ 
      position: "fixed", left: num.x, top: num.y, 
      color: isNitroActive ? "#ff4444" : "#ffd700", // تغییر رنگ عدد به قرمز در حالت نیترو برای جذابیت
      fontSize: "32px", fontWeight: "bold", animation: "f 0.8s forwards", pointerEvents: "none", zIndex: 1000  }}>
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
  

</div>
 );
}


