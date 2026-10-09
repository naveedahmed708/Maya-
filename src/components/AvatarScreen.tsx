import React, { useState } from 'react';
import { useApp, AVATAR_STYLES, VOICE_OPTIONS } from '../context/AppContext';
import {
  Sparkles,
  Volume2,
  Check,
  Palette,
  Mic,
  Smile,
  Shield,
  Heart,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { speakText, stopSpeech } from '../services/gemini';

export const AvatarScreen: React.FC = () => {
  const {
    selectedAvatar,
    setSelectedAvatar,
    selectedVoice,
    setSelectedVoice,
    userProfile,
    updateProfileData,
  } = useApp();

  const [emotionState, setEmotionState] = useState<'happy' | 'thinking' | 'calm' | 'excited' | 'talking'>('calm');
  const [activeVoicePreview, setActiveVoicePreview] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const personalities = [
    { id: 'Empathetic & Warm', desc: 'Supportive, thoughtful, compassionate voice companion' },
    { id: 'Confident Executive', desc: 'Sharp, concise, analytical productivity copilot' },
    { id: 'Playful & Witty', desc: 'Creative, humor-friendly, conversational partner' },
    { id: 'Zen Mentor', desc: 'Calm, focused, mindful guidance for learning and life' },
  ];

  const [selectedPersonality, setSelectedPersonality] = useState(
    userProfile?.selectedPersonality || personalities[0].id
  );

  const handlePreviewVoice = async (voice: typeof VOICE_OPTIONS[0]) => {
    if (activeVoicePreview === voice.id) {
      stopSpeech();
      setActiveVoicePreview(null);
    } else {
      setActiveVoicePreview(voice.id);
      await speakText(
        `Hi! I'm speaking in the ${voice.name} voice. How can I assist you today?`,
        voice.id,
        () => setActiveVoicePreview(voice.id),
        () => setActiveVoicePreview(null)
      );
    }
  };

  const handleSaveAvatar = async () => {
    await updateProfileData({
      photoURL: selectedAvatar.imageSrc,
      selectedVoice: selectedVoice.id,
      selectedPersonality,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6 pb-24 px-4 sm:px-6 pt-2 max-w-lg mx-auto">
      {/* Header title */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MEET YOUR AI COMPANION</span>
        </div>
        <h1 className="text-3xl font-extrabold font-display bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent">
          Meet Zara
        </h1>
        <p className="text-xs text-slate-300">
          Beautiful. Intelligent. Always by your side.
        </p>
      </div>

      {/* Large 3D Avatar Interactive Stage */}
      <div className="relative rounded-3xl p-6 glass-panel-glow border border-pink-500/30 flex flex-col items-center justify-center overflow-hidden">
        {/* Glow ambient background */}
        <div
          className="absolute inset-0 opacity-40 blur-3xl pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: selectedAvatar.ambientColor }}
        />

        {/* Emotion Switcher Chips */}
        <div className="flex items-center gap-1.5 mb-4 z-10 overflow-x-auto pb-1 max-w-full">
          {(['calm', 'happy', 'thinking', 'excited', 'talking'] as const).map((emo) => (
            <button
              key={emo}
              onClick={() => setEmotionState(emo)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold capitalize transition-all ${
                emotionState === emo
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/50'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {emo}
            </button>
          ))}
        </div>

        {/* Avatar Visual with reactive float & breathing motion */}
        <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1.5 bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 glow-pink-lg animate-float">
          <img
            src={selectedAvatar.imageSrc}
            alt="Zara Avatar"
            className={`w-full h-full object-cover rounded-full select-none transition-transform duration-500 ${
              emotionState === 'thinking'
                ? 'scale-102 rotate-1'
                : emotionState === 'excited'
                ? 'scale-105'
                : emotionState === 'talking'
                ? 'scale-103'
                : 'scale-100'
            }`}
            referrerPolicy="no-referrer"
          />

          {/* Interactive State badge */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-pink-300 capitalize flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
            <span>State: {emotionState}</span>
          </div>
        </div>

        <div className="mt-4 text-center z-10 space-y-0.5">
          <h3 className="text-base font-bold text-white font-display">{selectedAvatar.name}</h3>
          <p className="text-xs text-slate-400">{selectedAvatar.description}</p>
          <span className="inline-block mt-1 text-[11px] font-mono text-cyan-300">
            Outfit: {selectedAvatar.outfit}
          </span>
        </div>
      </div>

      {/* Outfit & Visual Style Customizer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Avatar Model Style
          </h2>
          <span className="text-[11px] text-pink-400">3 Presets</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {AVATAR_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedAvatar(style)}
              className={`p-2 rounded-2xl glass-card border transition-all flex flex-col items-center text-center space-y-1.5 ${
                selectedAvatar.id === style.id
                  ? 'border-pink-500 bg-pink-500/10 glow-pink-sm'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-pink-500 to-purple-500">
                <img
                  src={style.imageSrc}
                  alt={style.name}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[11px] font-bold text-white leading-tight truncate w-full">
                {style.name.replace('Zara ', '')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Voice Synthesis Model
          </h2>
          <span className="text-[11px] text-purple-400">Gemini Live TTS</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {VOICE_OPTIONS.map((voice) => (
            <div
              key={voice.id}
              className={`p-3 rounded-2xl glass-card border transition-all flex flex-col justify-between space-y-2 ${
                selectedVoice.id === voice.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{voice.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{voice.gender}</span>
                </div>
                <p className="text-[11px] text-slate-400">{voice.accent}</p>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => setSelectedVoice(voice)}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-colors ${
                    selectedVoice.id === voice.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {selectedVoice.id === voice.id ? 'Selected' : 'Select'}
                </button>

                <button
                  onClick={() => handlePreviewVoice(voice)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Preview Voice"
                  aria-label="Preview Voice"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${activeVoicePreview === voice.id ? 'text-pink-400 animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personality Selector */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Zara's Personality & Demeanor
        </h2>

        <div className="space-y-2">
          {personalities.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersonality(p.id)}
              className={`w-full text-left p-3 rounded-2xl glass-card border transition-all flex items-center justify-between ${
                selectedPersonality === p.id
                  ? 'border-pink-500/60 bg-pink-500/10'
                  : 'border-white/5 hover:border-white/15'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-white">{p.id}</h4>
                <p className="text-[11px] text-slate-400">{p.desc}</p>
              </div>
              {selectedPersonality === p.id && (
                <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSaveAvatar}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 active:scale-[0.98] transition-all"
        >
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>Save Avatar Configuration</span>
        </button>
        {saveToast && (
          <p className="text-xs text-emerald-400 font-medium text-center mt-2 animate-fadeIn">
            ✓ Avatar, voice & personality saved successfully!
          </p>
        )}
      </div>
    </div>
  );
};
