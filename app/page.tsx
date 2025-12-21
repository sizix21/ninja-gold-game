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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", marginTop: "40px" }}>
        
        {activeTab === "Tap" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
    padding: "0 10px 10px 10px", // پدینگ بالا را صفر کردیم (0 اول)
    position: "relative", 
    height: "100%", 
    overflow: "hidden" 
          }}>
            
            {/* ۱. تصویر ربات به عنوان بک‌گراند بزرگ */}
            <div style={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%", // بزرگتر از عرض صفحه برای جلوه بیشتر
              opacity: 0.7,   // کمی کمرنگ که نوشته‌ها خوانا باشند
              zIndex: 0,      // رفتن به پشت همه المان‌ها
              pointerEvents: "none"
            }}>
              <img src="/chef-robot.png" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>

            {/* ۱. پنل آمار بالا - کاملاً چسبیده به سقف */}
    <div style={{ 
      width: "100%", 
      backgroundColor: "rgba(0,0,0,0.7)", // کمی تیره‌تر برای تضاد بهتر
      backdropFilter: "blur(10px)", 
      borderRadius: "0 0 25px 25px", // لبه‌های پایین گرد، لبه‌های بالا صاف
      padding: "20px 15px", 
      zIndex: 2,
      borderBottom: "1px solid rgba(255,215,0,0.3)" // یک خط طلایی ظریف زیر باکس
    }}>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>
           <div style={{textAlign: "center"}}><img src="/currency-c.png" style={{width: "22px"}}/><p style={{margin:0, fontSize: "14px"}}>{greenCoins.toLocaleString()}</p></div>
           <div style={{textAlign: "center"}}><img src="/currency-r.png" style={{width: "22px"}}/><p style={{margin:0, fontSize: "14px"}}>{redCoins.toLocaleString()}</p></div>
           <div style={{textAlign: "center"}}><img src="/currency-t.png" style={{width: "22px"}}/><p style={{margin:0, fontSize: "14px"}}>{orangeCoins.toLocaleString()}</p></div>
        </div>
        <div style={{ 
          textAlign: "center", 
          color: "#ffd700", 
          fontWeight: "bold", 
          fontSize: "20px",
          textShadow: "0 0 10px rgba(255,215,0,0.2)" 
        }}>
          Profit: {(greenProfit + redProfit + orangeProfit).toLocaleString()} / s
        </div>
    </div>

            {/* ۳. فضای خالی منعطف (این بخش کارتریج‌ها را به پایین هل می‌دهد) */}
            <div style={{ flex: 1 }} /> 

            {/* ۴. بخش کارتریج‌ها - حالا کاملاً پایین قرار می‌گیرد */}
            <div style={{ 
              width: "100%", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "flex-end", // هم‌راستایی از پایین تصاویر
              gap: "12px", 
              zIndex: 2,
              marginBottom: "10px", // فاصله از لبه فوتر
              padding: "15px",
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "25px"
            }}>
               <img src={isGreenOn ? "/cartridge-green-on.png" : "/cartridge-green-off.png"} style={{ width: "75px", height: "auto" }} />
               <img src="/cartridge-red-free.png" style={{ width: "75px", height: "auto" }} />
               <img src="/cartridge-orange-free.png" style={{ width: "75px", height: "auto" }} />
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