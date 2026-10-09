import React, { useState, useEffect } from 'react';
import { useApp, LANGUAGE_OPTIONS, VOICE_OPTIONS } from '../context/AppContext';
import {
  User,
  Shield,
  Sliders,
  Cpu,
  Lock,
  Mic,
  Camera,
  Bell,
  HardDrive,
  LogOut,
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Volume2,
  Sparkles,
} from 'lucide-react';

export const SettingsScreen: React.FC<{ onOpenAdmin?: () => void }> = ({ onOpenAdmin }) => {
  const {
    user,
    userProfile,
    logout,
    settings,
    updateSettings,
    selectedVoice,
    setSelectedVoice,
    selectedLanguage,
    setSelectedLanguage,
    memories,
    clearAllMemories,
    conversations,
    isAdmin,
    setShowAuthModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'account' | 'permissions' | 'controls' | 'api' | 'privacy'>('account');
  const [micPerm, setMicPerm] = useState<'granted' | 'prompt' | 'denied'>('prompt');
  const [notifPerm, setNotifPerm] = useState<'granted' | 'default' | 'denied'>('default');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check browser permissions
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as any }).then((status) => {
        setMicPerm(status.state as any);
      }).catch(() => {});
    }
    if ('Notification' in window) {
      setNotifPerm(Notification.permission);
    }
  }, []);

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicPerm('granted');
      showToast('Microphone permission granted!');
    } catch {
      setMicPerm('denied');
      showToast('Microphone permission denied.');
    }
  };

  const requestNotif = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setNotifPerm(res);
      showToast(res === 'granted' ? 'Notifications enabled!' : 'Notifications not granted.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportData = () => {
    const data = {
      profile: userProfile,
      conversations,
      memories,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zara_ai_data_export_${Date.now()}.json`;
    a.click();
    showToast('Data exported successfully!');
  };

  return (
    <div className="space-y-6 pb-24 px-4 sm:px-6 pt-2 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black font-display text-white">Settings & Controls</h1>
        <p className="text-xs text-slate-400">Configure Zara's behavior, voice, and system privacy</p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/5 overflow-x-auto">
        {[
          { id: 'account', label: 'Account', icon: User },
          { id: 'permissions', label: 'Permissions', icon: Shield },
          { id: 'controls', label: 'Controls', icon: Sliders },
          { id: 'api', label: 'AI System', icon: Cpu },
          { id: 'privacy', label: 'Privacy', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm shadow-pink-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-200 text-xs text-center font-semibold animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* TAB 1: ACCOUNT */}
      {activeTab === 'account' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-card border border-white/5 flex items-center gap-3">
            <img
              src={userProfile?.photoURL || ''}
              alt="Profile"
              className="w-14 h-14 rounded-2xl object-cover p-0.5 bg-gradient-to-tr from-pink-500 to-purple-500"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white font-display truncate">
                {userProfile?.displayName || 'Guest User'}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || 'Local session (Not signed in)'}
              </p>
              <span className="inline-block mt-1 text-[10px] font-mono font-bold text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">
                {userProfile?.role === 'admin' || isAdmin ? 'ADMINISTRATOR' : 'STANDARD USER'}
              </span>
            </div>
            {!user ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1.5 rounded-xl bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-500/30"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={logout}
                className="p-2 rounded-xl glass-card text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language Preference */}
          <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold text-white">Default Response Language</span>
              </div>
              <span className="text-xs text-pink-300 font-semibold">{selectedLanguage.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {LANGUAGE_OPTIONS.slice(0, 6).map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLanguage(l)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-left truncate transition-colors ${
                    selectedLanguage.code === l.code
                      ? 'border-pink-500 bg-pink-500/15 text-pink-200'
                      : 'border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Model Preference */}
          <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">Selected Voice Persona</span>
              </div>
              <span className="text-xs text-purple-300 font-semibold">{selectedVoice.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {VOICE_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-colors ${
                    selectedVoice.id === v.id
                      ? 'border-purple-500 bg-purple-500/15 text-purple-200'
                      : 'border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{v.name}</div>
                  <div className="text-[10px] opacity-70">{v.gender} · {v.accent}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Admin link if user is administrator */}
          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
            >
              <Cpu className="w-4 h-4" />
              <span>Open Zara AI Admin Dashboard</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 2: PERMISSIONS */}
      {activeTab === 'permissions' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Zara AI requests permissions only when genuinely needed for natural voice input and system notifications.
          </p>

          {/* Microphone */}
          <div className="p-4 rounded-2xl glass-card border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Microphone</h4>
                <p className="text-[11px] text-slate-400">Required for real-time voice speech</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase font-mono ${
                micPerm === 'granted' ? 'text-emerald-400' : micPerm === 'denied' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {micPerm}
              </span>
              {micPerm !== 'granted' && (
                <button
                  onClick={requestMic}
                  className="px-2.5 py-1 rounded-lg bg-pink-500 text-white text-[11px] font-bold"
                >
                  Grant
                </button>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 rounded-2xl glass-card border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Notifications</h4>
                <p className="text-[11px] text-slate-400">Daily summaries & morning briefings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase font-mono ${
                notifPerm === 'granted' ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {notifPerm}
              </span>
              {notifPerm !== 'granted' && (
                <button
                  onClick={requestNotif}
                  className="px-2.5 py-1 rounded-lg bg-purple-500 text-white text-[11px] font-bold"
                >
                  Grant
                </button>
              )}
            </div>
          </div>

          {/* Camera / Vision */}
          <div className="p-4 rounded-2xl glass-card border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Camera</h4>
                <p className="text-[11px] text-slate-400">Vision questions & document scanning</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">On Demand</span>
          </div>

          {/* Storage */}
          <div className="p-4 rounded-2xl glass-card border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Storage & Cache</h4>
                <p className="text-[11px] text-slate-400">Local offline cache & session history</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Granted</span>
          </div>
        </div>
      )}

      {/* TAB 3: CONTROLS */}
      {activeTab === 'controls' && (
        <div className="space-y-2.5">
          {[
            {
              id: 'autoListen',
              title: 'Auto-Listen Loop',
              desc: 'Automatically listen again after Zara finishes speaking',
              val: settings.autoListen,
            },
            {
              id: 'voiceResponses',
              title: 'Voice Responses in Text Chat',
              desc: 'Speak Zara responses aloud automatically in chat mode',
              val: settings.voiceResponses,
            },
            {
              id: 'streamingResponses',
              title: 'Streaming Word-by-Word',
              desc: 'Stream AI output progressively in real-time',
              val: settings.streamingResponses,
            },
            {
              id: 'memoryEnabled',
              title: 'AI Memory & Preferences',
              desc: 'Allow Zara to recall non-sensitive preferences and topics',
              val: settings.memoryEnabled,
            },
            {
              id: 'hapticFeedback',
              title: 'Haptic Feedback',
              desc: 'Gentle vibration on key voice and mic button taps',
              val: settings.hapticFeedback,
            },
          ].map((ctrl) => (
            <div
              key={ctrl.id}
              className="p-3.5 rounded-2xl glass-card border border-white/5 flex items-center justify-between"
            >
              <div className="pr-4">
                <h4 className="text-xs font-bold text-white">{ctrl.title}</h4>
                <p className="text-[11px] text-slate-400">{ctrl.desc}</p>
              </div>
              <button
                onClick={() => updateSettings({ [ctrl.id]: !ctrl.val } as any)}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                  ctrl.val ? 'bg-pink-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: AI SYSTEM */}
      {activeTab === 'api' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-pink-400" />
              <h3 className="text-xs font-bold text-white font-display">Active AI Engine Architecture</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Language Model:</span>
                <span className="font-mono text-cyan-300">gemini-3.8-flash</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Text-to-Speech Model:</span>
                <span className="font-mono text-purple-300">gemini-3.8-flash-lite-tts</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Database Engine:</span>
                <span className="font-mono text-pink-300">Google Cloud Firestore</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Security Rules:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Deployed & Verified
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-white">Security & API Keys</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All Gemini API calls are securely authenticated via server-side proxy routes. No secret keys or private credentials are ever exposed in client code.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: PRIVACY */}
      {activeTab === 'privacy' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-white">Privacy Center</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              You have complete ownership over your data. Conversations and memories are isolated to your authenticated account with strict security rules.
            </p>
          </div>

          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="w-full p-3.5 rounded-2xl glass-card border border-white/5 flex items-center justify-between text-left hover:border-pink-500/30 transition-colors"
          >
            <div>
              <h4 className="text-xs font-bold text-white">Export My Data (JSON)</h4>
              <p className="text-[11px] text-slate-400">Download your chat history and profile memories</p>
            </div>
            <Download className="w-4 h-4 text-pink-400" />
          </button>

          {/* Clear Memories */}
          <button
            onClick={() => {
              if (confirm('Clear all stored AI memories?')) {
                clearAllMemories();
                showToast('AI memories cleared.');
              }
            }}
            className="w-full p-3.5 rounded-2xl glass-card border border-white/5 flex items-center justify-between text-left hover:border-rose-500/30 transition-colors text-rose-300"
          >
            <div>
              <h4 className="text-xs font-bold">Clear Stored AI Memory ({memories.length})</h4>
              <p className="text-[11px] text-slate-400">Erase personalized context notes Zara has learned</p>
            </div>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
