import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, Sparkles, BookOpen, PenTool, Lightbulb, Compass, ArrowRight, Check } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { setShowOnboarding, setShowAuthModal, assets } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const handleFinish = (openLogin: boolean = false) => {
    localStorage.setItem('zara_onboarding_completed', 'true');
    setShowOnboarding(false);
    if (openLogin) {
      setShowAuthModal(true);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#07070e] text-white overflow-y-auto">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header bar */}
      <div className="w-full flex items-center justify-between px-6 py-6 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          <span className="text-sm font-bold tracking-wider font-display bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            ZARA AI
          </span>
        </div>
        {currentStep < 3 && (
          <button
            onClick={() => handleFinish(false)}
            className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full text-center z-10 py-4">
        {/* Step 1: Meet Zara AI */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-float">
            <div className="relative mx-auto w-64 h-64 rounded-3xl overflow-hidden p-1.5 bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 glow-pink-lg">
              <img
                src={assets.avatarMain}
                alt="Meet Zara AI"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-pink-300">
                Hi, I'm Zara!
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold font-display bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent">
                Meet Zara AI
              </h2>
              <p className="text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
                Your intelligent AI assistant, always ready to help you with voice, learning, and daily productivity.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Talk Naturally */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="relative mx-auto w-64 h-64 rounded-3xl bg-slate-900/60 border border-pink-500/30 flex flex-col items-center justify-center p-6 glow-pink-sm">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
                <Mic className="w-12 h-12 text-white" />
              </div>

              {/* Sound Waveform */}
              <div className="flex items-center gap-1.5 mt-6">
                {[12, 28, 48, 20, 60, 36, 18, 50, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-pink-500 to-cyan-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold font-display bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent">
                Talk Naturally
              </h2>
              <p className="text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
                Speak with Zara using real natural voice conversations. Tap to talk, ask questions, or interrupt anytime.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Learn. Create. Explore. */}
        {currentStep === 2 && (
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {[
                { icon: Sparkles, label: 'Instant Answers', color: 'text-pink-400', bg: 'bg-pink-500/10' },
                { icon: PenTool, label: 'Creative Writing', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { icon: BookOpen, label: 'STEM & Learning', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                { icon: Lightbulb, label: 'Idea Brainstorm', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 border border-white/5 hover:border-pink-500/30 transition-all"
                  >
                    <div className={`p-2.5 rounded-xl ${feat.bg}`}>
                      <Icon className={`w-5 h-5 ${feat.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">{feat.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold font-display bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent">
                Learn. Create. Explore.
              </h2>
              <p className="text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
                Empower your day with smart explanations, multi-language translations, content drafting, and productivity tools.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Always With You */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 glow-pink-lg">
              <img
                src={assets.avatarSpeaking}
                alt="Always With You"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold font-display bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent">
                Always With You
              </h2>
              <p className="text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
                One intelligent voice companion for everyday life, work, and discovery. Ready whenever you are.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation & Controls */}
      <div className="w-full px-6 py-8 max-w-md mx-auto z-10 space-y-5">
        {/* Indicator dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2, 3].map((idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep === idx
                  ? 'w-7 bg-pink-500 shadow-sm shadow-pink-500/50'
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 active:scale-[0.98] transition-transform"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => handleFinish(false)}
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-transform"
            >
              <span>Get Started</span>
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFinish(true)}
              className="w-full h-12 rounded-2xl glass-card text-slate-200 hover:text-white font-medium text-xs flex items-center justify-center border border-white/10 active:scale-[0.98] transition-all"
            >
              Sign In to Sync Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
