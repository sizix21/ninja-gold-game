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
  const [isTapping, setIsTapping] = useState(false);
  const [isGreenOn, setIsGreenOn] = useState(true);
  const [isRedOn, setIsRedOn] = useState(false);
  const [isOrangeOn, setIsOrangeOn] = useState(false);
  const [isGreenActive, setIsGreenActive] = useState(false); // وضعیت فعالیت ماینر
  const [timeLeft, setTimeLeft] = useState(300); // ۵ دقیقه به ثانیه (5 * 60)
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
    localStorage.setItem("ninjaGreenActive", isGreenActive.toString()); // ذخیره وضعیت روشن/خاموش
    localStorage.setItem("lastExitTime", Date.now().toString());
    localStorage.setItem("ninjaRedCoins", redCoins.toString());
    localStorage.setItem("ninjaOrangeCoins", orangeCoins.toString());
    localStorage.setItem("ninjaEnergy", energy.toString());
    localStorage.setItem("ninjaSalad", saladToken.toString());
    localStorage.setItem("lastTime", Date.now().toString());
  }, [greenCoins, redCoins, orangeCoins, energy, saladToken]);

  // ۳. تایمر تولید ثانیه‌ای (آنلاین)
  useEffect(() => {
  let interval: NodeJS.Timeout | undefined;

  if (isGreenActive) {
    interval = setInterval(() => {
      // اضافه کردن سکه سبز (مادامی که یوزر در بازی است ادامه دارد)
      setGreenCoins((prev) => prev + greenProfit);
      
      // در زمان حضور در بازی، timeLeft را همیشه روی ۳۰۰ ثانیه نگه می‌داریم
      setTimeLeft(300); 
    }, 1000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isGreenActive, greenProfit]); // timeLeft را از دیپندنسی‌ها خارج کردیم
const handleGreenCartridgeClick = () => {
  setIsGreenActive(prev => !prev);
  };
  // --- Handlers ---
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (energy <= 0) return;
    
    // فعال کردن حالت تپ برای انیمیشن
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 100); // بعد از 100 میلی‌ثانیه به حالت اول برگرد

    setGreenCoins(prev => prev + 1);
    setEnergy(prev => Math.max(0, prev - 1));

    // بقیه کدهای قبلی (صدا و اعداد شناور)...
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
      
      

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", marginTop: "0px" }}>
        
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

        <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(0,0,0,0.4)", padding: "5px 12px", borderRadius: "20px", height: "35px" }}>
          <img src="/salad-butt.png" alt="Salad" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>{saladToken.toLocaleString()}</span>
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
    transform: isTapping ? "scale(0.92)" : "scale(1)" // افکت کوچک شدن
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
    padding: "0px", // پدینگ بالا را صفر کردیم (0 اول)
    position: "relative", 
    height: "100%", 
    overflow: "hidden",
    backgroundColor: "#1a1a1a" // رنگ پس‌زمینه رزرو 
          }}>
            {/* ۱. پنل آمار بالا - کاملاً چسبیده به سقف */}
    <div style={{ 
    width: "100%", 
    backgroundColor: "rgba(0,0,0,0.8)", 
    backdropFilter: "blur(12px)", 
    borderRadius: "0 0 30px 30px", 
    padding: "20px 15px", 
    zIndex: 10,
    borderBottom: "2px solid rgba(255,215,0,0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
}}>
    {/* ۱. ردیف سکه‌ها (آیکون و عدد در یک خط) */}
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 10px" }}>
        {/* سکه سبز */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img src="/currency-c.png" style={{width: "20px"}}/>
            <span style={{fontSize: "14px", fontWeight: "bold"}}>{greenCoins.toLocaleString()}</span>
        </div>
        {/* سکه قرمز */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img src="/currency-r.png" style={{width: "20px"}}/>
            <span style={{fontSize: "14px", fontWeight: "bold"}}>{redCoins.toLocaleString()}</span>
        </div>
        {/* سکه نارنجی */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img src="/currency-t.png" style={{width: "20px"}}/>
            <span style={{fontSize: "14px", fontWeight: "bold"}}>{orangeCoins.toLocaleString()}</span>
        </div>
    </div>

    {/* ۲. ردیف هم‌راستای پروفیت و زمان */}
    <div style={{ 
        width: "90%", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "10px"
    }}>
        <div style={{ color: "#ffd700", fontSize: "15px", fontWeight: "bold" }}>
            Profit: {greenProfit.toLocaleString()}
        </div>
        <div style={{ color: "#fff", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>🕒</span>
            <span>5min</span>
        </div>
    </div>

    {/* ۳. نمایش بزرگ موجودی سکه سبز */}
    <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "12px",
        backgroundColor: "rgba(255,215,0,0.1)",
        padding: "10px 30px",
        borderRadius: "20px",
        border: "1px solid rgba(255,215,0,0.2)",
        width: "fit-content"
    }}>
        <img src="/currency-c.png" style={{ width: "30px", height: "30px" }} />
        <span style={{ fontSize: "28px", fontWeight: "900", color: "#fff" }}>
            {greenCoins.toLocaleString()}
        </span>
    </div>
</div>
            {/* ۱. تصویر ربات به عنوان بک‌گراند بزرگ */}
            <div style={{
              position: "absolute",
              top: "0%",
              left: "0%",
              width: "100%",
              height: "100%",
              opacity: 0.7,   // کمی کمرنگ که نوشته‌ها خوانا باشند
              zIndex: 0,      // رفتن به پشت همه المان‌ها
              pointerEvents: "none"
            }}>
              <img src="/chef-robot.png" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>

            {/* ۳. فضای خالی منعطف (این بخش کارتریج‌ها را به پایین هل می‌دهد) */}
            <div style={{ flex: 1 }} /> 

            {/* ۴. بخش کارتریج‌ها - حالا کاملاً پایین قرار می‌گیرد */}
            <div style={{ 
              width: "90%", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "flex-end", // هم‌راستایی از پایین تصاویر
              gap: "15px", 
              zIndex: 5,
              marginBottom: "20px", // فاصله از لبه فوتر
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
  {/* اینجا قبلاً تایمر بود که طبق خواسته شما حذف شد */}
</div>

{/* سایر کارتریج‌ها که فعلاً غیرفعال هستند */}
<img src="/cartridge-red-free.png" style={{ width: "75px", height: "auto", opacity: 0.4 }} />
<img src="/cartridge-orange-free.png" style={{ width: "75px", height: "auto", opacity: 0.4 }} />
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
      transition: "none", // حذف هرگونه انیمیشن تغییر سایز
      transform: "none"   // اطمینان از عدم تغییر اسکیل
    }}
  >
    <img 
      src={footerIcons[label]} 
      alt={label} 
      style={{ 
        width: "40px", 
        height: "40px", // مقدار ثابت برای جلوگیری از دفرمه شدن
        objectFit: "contain",
        filter: isActive ? "none" : "grayscale(100%)",
        opacity: isActive ? 1 : 0.6,
        transition: "opacity 0.2s" // فقط کمرنگ و پررنگ شدن نرم
      }} 
    />
  </button>
)
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

      {floatingNumbers.map(num => (
  <div 
    key={num.id} 
    style={{ 
      position: "fixed", 
      left: num.x, 
      top: num.y, 
      color: "#ffd700", 
      fontSize: "32px",      // اندازه را از اینجا بزرگتر کردیم
      fontWeight: "bold", 
      textShadow: "0px 4px 10px rgba(0,0,0,0.8)", // سایه غلیظ‌تر برای دیده شدن روی نینجا
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