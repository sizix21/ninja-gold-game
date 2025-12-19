"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [score, setScore] = useState(0);

  // ۱. وقتی بازی لود می‌شود، امتیاز قبلی را از حافظه بخوان
  useEffect(() => {
    const savedScore = localStorage.getItem("ninjaScore");
    if (savedScore) {
      setScore(parseInt(savedScore));
    }
  }, []);

  // ۲. هر بار که امتیاز تغییر می‌کند، آن را در حافظه ذخیره کن
  useEffect(() => {
    localStorage.setItem("ninjaScore", score.toString());
  }, [score]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#1a1a1a", color: "white", fontFamily: "sans-serif" }}>
      <h1>SCORE</h1>
      <h2 style={{ fontSize: "3rem", margin: "0" }}>{score}</h2>
      
      <div 
        onClick={() => setScore(score + 1)}
        style={{ cursor: "pointer", marginTop: "20px", transition: "transform 0.1s" }}
        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <img 
          src="/coin.png" 
  alt="Ninja" 
  style={{ 
    width: "300px",       // ۱. اندازه را از ۲۰۰ به ۳۰۰ بزرگتر کردیم
    height: "auto",       // ۲. ارتفاع خودکار باشد تا تصویر کشیده نشود
    borderRadius: "0",    // ۳. این همان خطی است که دایره را حذف می‌کند (مقدار را ۰ کردیم)
    boxShadow: "none",    // ۴. سایه طلایی دور سکه را هم حذف کردیم تا نینجا طبیعی باشد
    userSelect: "none",   // جلوگیری از انتخاب شدن عکس موقع کلیک سریع
    WebkitTapHighlightColor: "transparent" // حذف هاله آبی موقع لمس در گوشی
    transition: "transform 0.1s"
  }}
        />
      </div>
      
      <p style={{ marginTop: "20px", color: "#888" }}>Ninja Potato Game</p>
    </div>
  );
}