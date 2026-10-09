import React, { useState } from 'react';
import { useApp, LANGUAGE_OPTIONS } from '../context/AppContext';
import { Mic, MicOff, Volume2, Sparkles, X, MessageSquare, RotateCcw, Globe, Flame } from 'lucide-react';
import { LanguageOption } from '../types';

export const VoiceExperience: React.FC = () => {
  const {
    voiceState,
    voiceTranscript,
    zaraVoiceReply,
    startVoiceListening,
    stopVoiceListening,
    interruptZara,
    setActiveTab,
    selectedAvatar,
    selectedVoice,
    selectedLanguage,
    setSelectedLanguage,
    settings,
    updateSettings,
  } = useApp();

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const getStatusText = () => {
    switch (voiceState) {
      case 'listening':
        return 'Listening... Speak naturally';
      case 'processing':
        return 'Thinking & processing...';
      case 'speaking':
        return 'Zara is speaking...';
      case 'error':
        return 'Tap microphone to retry';
      default:
        return 'Tap to talk with Zara';
    }
  };

  const handleMicToggle = () => {
    if (voiceState === 'listening') {
      stopVoiceListening();
    } else if (voiceState === 'speaking') {
      interruptZara();
    } else {
      startVoiceListening();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] p-4 sm:p-6 text-center overflow-hidden">
      {/* Background glowing neural aura */}
      <div className="absolute top-1/4 w-[380px] h-[380px] bg-gradient-to-tr from-pink-600/25 via-purple-600/25 to-cyan-500/15 rounded-full blur-[110px] pointer-events-none animate-pulse-glow" />

      {/* Top action bar: Language selector, Auto-listen toggle, Switch to Text Chat */}
      <div className="w-full flex items-center justify-between z-20 max-w-md mx-auto pt-2">
        {/* Language selector chip */}
        <div className="relative">
          <button
            onClick={() => setShowLanguagePicker(!showLanguagePicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs font-semibold text-pink-300 hover:border-pink-500/40 transition-all border border-pink-500/20"
          >
            <Globe className="w-3.5 h-3.5 text-pink-400" />
            <span>{selectedLanguage.flag} {selectedLanguage.name}</span>
          </button>

          {showLanguagePicker && (
            <div className="absolute top-10 left-0 z-50 w-48 p-2 rounded-2xl glass-panel shadow-2xl border border-pink-500/30 max-h-56 overflow-y-auto space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Select Language</p>
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguagePicker(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                    selectedLanguage.code === lang.code
                      ? 'bg-pink-500 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  <span className="text-[10px] opacity-70 font-mono">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side buttons: Auto-listen toggle & Chat Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateSettings({ autoListen: !settings.autoListen })}
            className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              settings.autoListen
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                : 'glass-card text-slate-400 border-white/10'
            }`}
            title="Auto-listen after response"
          >
            <Flame className="w-3 h-3 text-purple-400" />
            <span>Auto-Listen {settings.autoListen ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className="p-2 rounded-full glass-card hover:border-pink-500/40 text-slate-300 hover:text-white transition-colors"
            title="Switch to Chat view"
            aria-label="Switch to Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center 3D Holographic AI Avatar & Pulsing Sound Waves */}
      <div className="relative my-auto flex flex-col items-center justify-center z-10 w-full max-w-sm">
        {/* Animated Sound Wave Rings */}
        <div className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
          {/* Outermost pulsing ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${
              voiceState === 'listening'
                ? 'border-pink-500/40 scale-110 animate-ping'
                : voiceState === 'speaking'
                ? 'border-purple-500/40 scale-105 animate-pulse'
                : 'border-pink-500/10'
            }`}
          />

          {/* Middle rotating ring */}
          <div
            className={`absolute inset-4 rounded-full border border-dashed transition-all duration-500 ${
              voiceState === 'processing'
                ? 'border-cyan-400/60 animate-spin'
                : 'border-purple-500/30 animate-spin-slow'
            }`}
          />

          {/* Core Avatar Image Container with soft rim light */}
          <div
            className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden p-1.5 transition-all duration-500 ${
              voiceState === 'listening'
                ? 'bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 glow-pink-lg scale-105'
                : voiceState === 'speaking'
                ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 glow-purple scale-105'
                : voiceState === 'processing'
                ? 'bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 glow-cyan'
                : 'bg-gradient-to-tr from-pink-500/80 to-purple-600/80 glow-pink-sm'
            }`}
          >
            <img
              src={selectedAvatar.imageSrc}
              alt="Zara AI Companion"
              className="w-full h-full object-cover rounded-full select-none"
              referrerPolicy="no-referrer"
            />

            {/* Speaking visualizer overlay */}
            {voiceState === 'speaking' && (
              <div className="absolute inset-0 bg-purple-900/25 flex items-center justify-center backdrop-blur-[1px]">
                <div className="flex items-center gap-1">
                  {[24, 40, 60, 35, 55, 30].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-white/90 rounded-full animate-pulse"
                      style={{ height: `${h * 0.4}px`, animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real-time speech transcript & Zara voice response */}
        <div className="mt-4 w-full px-4 min-h-[90px] flex flex-col items-center justify-center">
          {voiceTranscript ? (
            <div className="p-3 rounded-2xl bg-white/5 border border-pink-500/20 backdrop-blur-sm max-w-xs text-xs text-slate-200 animate-fadeIn">
              <span className="text-[10px] uppercase font-bold text-pink-400 block mb-0.5">You said:</span>
              "{voiceTranscript}"
            </div>
          ) : zaraVoiceReply ? (
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm max-w-xs text-xs text-purple-100 max-h-24 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-purple-300 block mb-0.5">Zara:</span>
              "{zaraVoiceReply}"
            </div>
          ) : (
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold font-display text-white">Zara AI</h3>
              <p className="text-xs text-slate-400">
                Voice Assistant · Voice: {selectedVoice.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls Area: Status text, Large Mic Button, Interrupt affordance */}
      <div className="w-full max-w-sm z-20 flex flex-col items-center space-y-4 pb-20">
        {/* Status Pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121024]/80 border border-white/10 text-xs font-medium text-slate-300">
          <span
            className={`w-2 h-2 rounded-full ${
              voiceState === 'listening'
                ? 'bg-rose-500 animate-ping'
                : voiceState === 'speaking'
                ? 'bg-purple-400 animate-pulse'
                : voiceState === 'processing'
                ? 'bg-cyan-400 animate-spin'
                : 'bg-emerald-400'
            }`}
          />
          <span>{getStatusText()}</span>
        </div>

        {/* Central Giant Voice Button */}
        <div className="flex items-center gap-6">
          {/* Interrupt / Reset Button */}
          {voiceState === 'speaking' && (
            <button
              onClick={interruptZara}
              className="min-w-[44px] min-h-[44px] p-3 rounded-full glass-card hover:bg-rose-500/20 text-rose-300 transition-colors flex items-center justify-center border border-rose-500/30"
              title="Interrupt Zara"
              aria-label="Interrupt Zara"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          {/* Large Main Microphone Trigger */}
          <button
            onClick={handleMicToggle}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform active:scale-90 ${
              voiceState === 'listening'
                ? 'bg-gradient-to-tr from-rose-500 to-pink-500 glow-pink-lg ring-8 ring-pink-500/30 animate-pulse'
                : voiceState === 'speaking'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-500 glow-purple ring-8 ring-purple-500/30'
                : voiceState === 'processing'
                ? 'bg-indigo-600 ring-8 ring-indigo-500/30 animate-pulse'
                : 'bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 glow-pink-sm hover:scale-105'
            }`}
            aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start talking to Zara'}
          >
            {voiceState === 'listening' ? (
              <MicOff className="w-8 h-8 animate-bounce" />
            ) : voiceState === 'speaking' ? (
              <Volume2 className="w-8 h-8 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Helpful Tip */}
        <p className="text-[11px] text-slate-500 font-medium">
          {voiceState === 'listening'
            ? 'Tap mic again to send voice'
            : voiceState === 'speaking'
            ? 'Tap to interrupt Zara anytime'
            : 'Speak naturally in any supported language'}
        </p>
      </div>
    </div>
  );
};
