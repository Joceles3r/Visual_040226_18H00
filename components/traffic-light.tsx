"use client"

import { useState, useEffect } from "react"

interface TrafficLightProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function TrafficLight({ size = "md", className = "" }: TrafficLightProps) {
  const [activeLight, setActiveLight] = useState(0) // 0=red, 1=yellow, 2=green

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLight((prev) => (prev + 1) % 3)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: { light: "w-2.5 h-2.5", gap: "gap-0.5", padding: "p-1", pole: "w-1 h-1.5" },
    md: { light: "w-4 h-4", gap: "gap-1", padding: "p-1.5", pole: "w-1.5 h-2" },
    lg: { light: "w-5 h-5", gap: "gap-1.5", padding: "p-2", pole: "w-2 h-3" },
  }

  const { light, gap, padding, pole } = sizeClasses[size]

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Boitier du feu tricolore */}
      <div 
        className={`relative flex flex-col ${gap} ${padding} rounded-lg bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 shadow-xl border border-slate-500/50`}
        style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        {/* Visiere du haut */}
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-slate-800 rounded-t-sm" />
        
        {/* Rouge */}
        <div 
          className={`${light} rounded-full transition-all duration-300 border-2 ${
            activeLight === 0 
              ? "bg-red-500 border-red-400 shadow-[0_0_12px_4px_rgba(239,68,68,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3)]" 
              : "bg-red-950 border-red-900/50 shadow-inner"
          }`}
          style={activeLight === 0 ? { animation: "pulse 0.8s ease-in-out infinite" } : {}}
        />
        
        {/* Jaune */}
        <div 
          className={`${light} rounded-full transition-all duration-300 border-2 ${
            activeLight === 1 
              ? "bg-yellow-400 border-yellow-300 shadow-[0_0_12px_4px_rgba(250,204,21,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3)]" 
              : "bg-yellow-950 border-yellow-900/50 shadow-inner"
          }`}
          style={activeLight === 1 ? { animation: "pulse 0.8s ease-in-out infinite" } : {}}
        />
        
        {/* Vert */}
        <div 
          className={`${light} rounded-full transition-all duration-300 border-2 ${
            activeLight === 2 
              ? "bg-emerald-400 border-emerald-300 shadow-[0_0_12px_4px_rgba(52,211,153,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3)]" 
              : "bg-emerald-950 border-emerald-900/50 shadow-inner"
          }`}
          style={activeLight === 2 ? { animation: "pulse 0.8s ease-in-out infinite" } : {}}
        />
      </div>
      
      {/* Pied/Poteau du feu */}
      <div className={`${pole} bg-gradient-to-b from-slate-500 to-slate-600 rounded-b-sm shadow-md`} />
    </div>
  )
}
