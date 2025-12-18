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
          alt="Gold Coin" 
          style={{ width: "200px", height: "200px", borderRadius: "50%", boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }} 
        />
      </div>
      
      <p style={{ marginTop: "20px", color: "#888" }}>Ninja Potato Game</p>
    </div>
  );
}