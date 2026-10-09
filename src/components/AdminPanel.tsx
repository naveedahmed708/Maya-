import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Activity,
  Cpu,
  Sliders,
  DollarSign,
  TrendingUp,
  Shield,
  X,
  Save,
  CheckCircle2,
  RefreshCw,
  Search,
  MessageSquare,
  Volume2,
} from 'lucide-react';

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useApp();
  const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'models' | 'prompts' | 'coins'>('dashboard');

  const [systemPrompt, setSystemPrompt] = useState(
    `You are Zara AI, "Your Smart AI Voice Assistant". You are an intelligent, friendly, confident, helpful, natural, emotionally aware, and lightly playful AI companion. Never robotic.`
  );
  const [temperature, setTemperature] = useState(0.8);
  const [modelChoice, setModelChoice] = useState('gemini-3.8-flash');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock telemetry data for admin monitoring
  const stats = {
    totalUsers: '12,480',
    activeUsers: '4,210',
    aiRequests: '98,340',
    voiceMinutes: '14,200',
    tokenUsage: '48.2M',
    revenue: '$14,890',
  };

  const sampleUsers = [
    { id: 'u_1', name: 'Naveed Ahmed Memon', email: 'naveedahmedmemon.com450@gmail.com', role: 'Super Admin', status: 'Active', plan: 'Pro Plus' },
    { id: 'u_2', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'User', status: 'Active', plan: 'Pro Plus' },
    { id: 'u_3', name: 'Alex Rivera', email: 'alex.rivera@example.com', role: 'User', status: 'Active', plan: 'Free' },
    { id: 'u_4', name: 'Fatima Zahra', email: 'fatima.z@example.com', role: 'User', status: 'Active', plan: 'Free' },
  ];

  const handleSaveConfig = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07070e] text-white overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-30 px-6 py-4 bg-[#0a0818]/95 backdrop-blur-md border-b border-pink-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display flex items-center gap-2">
              <span>Zara AI Enterprise Console</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Admin Account: {user?.email || 'Authorized Engineer'}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl glass-card hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Close admin console"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="px-6 pt-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
          {[
            { id: 'dashboard', label: 'Metrics & Health', icon: Activity },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'models', label: 'AI Models', icon: Cpu },
            { id: 'prompts', label: 'Persona Prompts', icon: Sliders },
            { id: 'coins', label: 'Economy Rules', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  adminTab === tab.id
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                    : 'glass-card text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-4xl mx-auto w-full flex-1">
        {/* TAB 1: METRICS */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Total App Users', val: stats.totalUsers, change: '+14% this month', icon: Users, color: 'text-pink-400' },
                { label: 'Daily Active Users', val: stats.activeUsers, change: 'Peak at 2:00 PM', icon: Activity, color: 'text-purple-400' },
                { label: 'Total AI Requests', val: stats.aiRequests, change: '99.98% success', icon: Cpu, color: 'text-cyan-400' },
                { label: 'Voice Minutes', val: stats.voiceMinutes, change: 'Gemini Live TTS', icon: Volume2, color: 'text-amber-400' },
                { label: 'Token Consumption', val: stats.tokenUsage, change: 'Avg 420 t/req', icon: TrendingUp, color: 'text-emerald-400' },
                { label: 'Estimated Revenue', val: stats.revenue, change: 'Subscriptions & Coins', icon: DollarSign, color: 'text-rose-400' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl glass-card border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{s.label}</span>
                      <Icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div className="text-2xl font-black font-display text-white">{s.val}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{s.change}</span>
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Usage Graph */}
            <div className="p-5 rounded-2xl glass-card border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Hourly AI Traffic & Voice Streams</h3>
                  <p className="text-xs text-slate-400">Real-time load across Asia East 1 region</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                  Latency: 18ms
                </span>
              </div>

              {/* Bar visualization */}
              <div className="h-32 flex items-end gap-2 pt-4 px-2">
                {[35, 48, 65, 82, 55, 40, 70, 95, 88, 60, 78, 90, 68, 85, 92].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-purple-600 to-pink-500 group-hover:from-cyan-400 group-hover:to-pink-400 transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[8px] text-slate-600 font-mono hidden sm:block">{i * 2}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {adminTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter users by email or role..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <button className="px-3 py-2 rounded-xl glass-card text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync</span>
              </button>
            </div>

            <div className="rounded-2xl glass-card border border-white/5 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/5 text-slate-400 font-mono text-[11px]">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sampleUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-pink-300 font-semibold">{u.plan}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AI MODELS */}
        {adminTab === 'models' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl glass-card border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white font-display">Gemini Model Routing</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Primary Conversational Model
                  </label>
                  <select
                    value={modelChoice}
                    onChange={(e) => setModelChoice(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended Default)</option>
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex STEM & Reasoning)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Low Latency)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Sampling Temperature ({temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>Precise (0.0)</span>
                    <span>Balanced (0.7)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveConfig}
                className="px-5 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/25"
              >
                <Save className="w-4 h-4" />
                <span>Save Model Parameters</span>
              </button>
              {saveSuccess && (
                <p className="text-xs text-emerald-400 font-medium animate-fadeIn">
                  ✓ Parameters updated in server memory!
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PERSONA PROMPTS */}
        {adminTab === 'prompts' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl glass-card border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Zara Core System Prompt</h3>
                  <p className="text-xs text-slate-400">Controls assistant persona, safety constraints, and conversational guidelines</p>
                </div>
                <span className="text-[10px] font-mono bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">v2.4 Production</span>
              </div>

              <textarea
                rows={6}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-pink-500"
              />

              <button
                onClick={handleSaveConfig}
                className="px-5 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/25"
              >
                <Save className="w-4 h-4" />
                <span>Deploy System Prompt</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: COIN ECONOMY */}
        {adminTab === 'coins' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl glass-card border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white font-display">Coin Economy & Daily Rewards</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span>Daily Reward Amount</span>
                  <span className="font-mono font-bold text-amber-400">50 Coins / day</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span>Welcome Signup Bonus</span>
                  <span className="font-mono font-bold text-amber-400">200 Coins</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span>Pro Plus Unlimited Bypass</span>
                  <span className="font-mono font-bold text-emerald-400">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
