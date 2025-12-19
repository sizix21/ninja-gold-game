"use client";

import { useState, useEffect } from "react";

// یک رابط (interface) برای تعریف ساختار هر عدد شناور
interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
}

export default function Home() {
  const [score, setScore] = useState(0);
  // حالت جدید برای نگهداری لیست اعداد شناور
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

  // بارگذاری امتیاز ذخیره شده
  useEffect(() => {
    const savedScore = localStorage.getItem("ninjaScore");
    if (savedScore) setScore(parseInt(savedScore));
  }, []);

  // ذخیره امتیاز هر بار که تغییر می‌کند
  useEffect(() => {
    localStorage.setItem("ninjaScore", score.toString());
  }, [score]);

  // تابع برای مدیریت کلیک و نمایش عدد شناور
  const handleClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setScore(prevScore => prevScore + 1);

    // گرفتن موقعیت کلیک/تاچ
    let clientX: number;
    let clientY: number;

    if ('touches' in e) { // اگر رویداد تاچ باشد
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else { // اگر رویداد کلیک ماوس باشد
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // ایجاد یک عدد شناور جدید
    const newFloatingNumber: FloatingNumber = {
      id: Date.now(), // یک ID یکتا بر اساس زمان
      x: clientX,
      y: clientY,
      value: 1, // فعلاً همیشه +1
    };

    setFloatingNumbers(prevNumbers => [...prevNumbers, newFloatingNumber]);

    // حذف عدد شناور بعد از مدتی
    setTimeout(() => {
      setFloatingNumbers(prevNumbers => prevNumbers.filter(num => num.id !== newFloatingNumber.id));
    }, 1000); // 1000 میلی‌ثانیه = 1 ثانیه
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#1a1a1a", color: "white", fontFamily: "sans-serif", overflow: "hidden", position: "relative" }}>
      <h1>SCORE</h1>
      <h2 style={{ fontSize: "3rem", margin: "0" }}>{score}</h2>
      
      <div 
        onClick={handleClick} // حالا handleClick را صدا می‌زنیم
        style={{ 
          cursor: "pointer", 
          marginTop: "20px", 
          transition: "transform 0.1s ease-in-out", 
          touchAction: "manipulation", 
          WebkitTapHighlightColor: "transparent"
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.95)"} 
        onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}    
      >
        <img 
          src="/coin.png" 
          alt="Ninja" 
          style={{ 
            width: "300px", 
            height: "auto", 
            borderRadius: "0", 
            userSelect: "none",
            pointerEvents: "none" 
          }} 
        />
      </div>
      
      <p style={{ marginTop: "20px", color: "#888" }}>Ninja Potato Game</p>

      {/* بخش نمایش اعداد شناور */}
      {floatingNumbers.map(num => (
        <div
          key={num.id}
          style={{
            position: "fixed", // ثابت روی صفحه
            left: num.x,
            top: num.y,
            transform: "translate(-50%, -100%)", // برای قرار گرفتن درست بالای انگشت
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#FFD700", // رنگ طلایی
            textShadow: "0 0 5px rgba(255, 215, 0, 0.7)",
            opacity: 0, // شروع با شفافیت 0
            animation: "floatUpAndFade 1s forwards", // انیمیشن بالا رفتن و محو شدن
            pointerEvents: "none", // برای اینکه روی کلیک تداخل نداشته باشد
            zIndex: 100 // بالاتر از بقیه عناصر
          }}
        >
          +{num.value}
        </div>
      ))}

      {/* تعریف انیمیشن CSS (همیشه بعد از return و قبل از بستن div اصلی) */}
      <style jsx>{`
        @keyframes floatUpAndFade {
          0% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -100px); /* 100px به سمت بالا */
          }
        }
      `}</style>
    </div>
  );
}