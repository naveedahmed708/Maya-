import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart } from 'lucide-react';

export const Splash: React.FC = () => {
  const { setShowSplash, showOnboarding, assets } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, [setShowSplash]);

  return (
    <div
      onClick={() => setShowSplash(false)}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07070e] text-white cursor-pointer select-none overflow-hidden"
    >
      {/* Background radial glowing gradients */}
      <div className="absolute w-[450px] h-[450px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Futuristic Orbit Rings */}
      <div className="relative flex items-center justify-center w-48 h-48 mb-8">
        <div className="absolute inset-0 rounded-full border border-pink-500/30 animate-spin-slow" />
        <div className="absolute inset-3 rounded-full border border-purple-500/40 animate-spin-slow [animation-direction:reverse]" />
        <div className="absolute inset-6 rounded-full border border-cyan-400/20 animate-pulse" />

        {/* Center Glowing AI Core / Symbol */}
        <div className="relative z-10 w-28 h-28 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 glow-pink-lg animate-pulse-glow">
          <img
            src={assets.splashSymbol}
            alt="Zara AI Core"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Brand Title & Tagline */}
      <div className="text-center z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
          <span>NEURAL AI VOICE COMPANION</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent font-display">
          ZARA AI
        </h1>

        <p className="text-sm sm:text-base text-pink-200/80 font-medium tracking-wide">
          Your Smart AI Voice Assistant
        </p>

        <p className="text-xs text-purple-400/70 uppercase tracking-widest font-mono pt-1">
          Always With You
        </p>
      </div>

      {/* Waveform Animation */}
      <div className="flex items-center gap-1.5 mt-10 z-10">
        {[40, 75, 25, 90, 60, 30, 80, 45, 95, 35].map((height, i) => (
          <span
            key={i}
            className="w-1 bg-gradient-to-t from-pink-500 to-purple-400 rounded-full animate-pulse"
            style={{
              height: `${height * 0.35}px`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Tap to continue indicator */}
      <div className="absolute bottom-8 text-[11px] text-slate-500 font-medium">
        Tap anywhere to enter
      </div>
    </div>
  );
};
