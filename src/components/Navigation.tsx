import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, User, Sparkles, Coins, Settings, Mic, Heart } from 'lucide-react';
import { AppTab } from '../types';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, voiceState, startVoiceListening, stopVoiceListening } = useApp();

  const handleCenterClick = () => {
    if (activeTab !== 'zara') {
      setActiveTab('zara');
      startVoiceListening();
    } else {
      if (voiceState === 'listening' || voiceState === 'speaking') {
        stopVoiceListening();
      } else {
        startVoiceListening();
      }
    }
  };

  const tabs: Array<{ id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'avatar', label: 'Avatar', icon: User },
    // Center is handled separately
    { id: 'coins', label: 'Coins', icon: Coins },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090814]/90 backdrop-blur-xl border-t border-pink-500/15 max-w-lg mx-auto pb-safe">
      <div className="relative flex items-center justify-around h-16 px-3">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`relative min-w-[56px] min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'home' ? 'text-pink-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 transition-transform active:scale-95" />
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
          {activeTab === 'home' && (
            <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/80" />
          )}
        </button>

        {/* Tab 2: Avatar */}
        <button
          onClick={() => setActiveTab('avatar')}
          className={`relative min-w-[56px] min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'avatar' ? 'text-pink-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Avatar"
        >
          <User className="w-5 h-5 transition-transform active:scale-95" />
          <span className="text-[10px] mt-1 tracking-tight">Avatar</span>
          {activeTab === 'avatar' && (
            <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/80" />
          )}
        </button>

        {/* Tab 3: Center Elevated Zara AI Button */}
        <div className="relative -top-5 flex flex-col items-center justify-center">
          <button
            onClick={handleCenterClick}
            className={`relative w-15 h-15 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
              voiceState === 'listening'
                ? 'bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 ring-4 ring-pink-500/40 glow-pink-lg animate-pulse'
                : voiceState === 'speaking'
                ? 'bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 ring-4 ring-purple-500/40 glow-purple animate-pulse'
                : voiceState === 'processing'
                ? 'bg-gradient-to-tr from-indigo-600 to-pink-500 ring-4 ring-indigo-500/40'
                : 'bg-gradient-to-tr from-pink-500 to-purple-600 ring-4 ring-pink-500/25 glow-pink-sm hover:scale-105'
            }`}
            aria-label="Zara AI Voice Assistant"
          >
            {/* Pulsing halo ring */}
            <span className="absolute -inset-1 rounded-full bg-pink-500/30 blur-sm animate-ping pointer-events-none" />

            {/* Inner Icon */}
            {voiceState === 'listening' ? (
              <Mic className="w-7 h-7 text-white animate-bounce" />
            ) : voiceState === 'speaking' ? (
              <Sparkles className="w-7 h-7 text-white animate-spin" />
            ) : (
              <Heart className="w-7 h-7 text-white fill-white/80" />
            )}
          </button>
          <span className="text-[10px] font-bold tracking-tight text-pink-300 mt-1">
            {voiceState === 'listening' ? 'Listening' : voiceState === 'speaking' ? 'Speaking' : 'ZARA'}
          </span>
        </div>

        {/* Tab 4: Coins */}
        <button
          onClick={() => setActiveTab('coins')}
          className={`relative min-w-[56px] min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'coins' ? 'text-pink-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Coins"
        >
          <Coins className="w-5 h-5 transition-transform active:scale-95" />
          <span className="text-[10px] mt-1 tracking-tight">Coins</span>
          {activeTab === 'coins' && (
            <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/80" />
          )}
        </button>

        {/* Tab 5: Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`relative min-w-[56px] min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'settings' ? 'text-pink-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 transition-transform active:scale-95" />
          <span className="text-[10px] mt-1 tracking-tight">Settings</span>
          {activeTab === 'settings' && (
            <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/80" />
          )}
        </button>
      </div>
    </nav>
  );
};
