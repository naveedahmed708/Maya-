import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  Gift,
  Sparkles,
  Zap,
  Check,
  Crown,
  History,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const CoinsScreen: React.FC = () => {
  const { coins, claimDailyReward, hasClaimedToday, transactions } = useApp();
  const [claimCelebration, setClaimCelebration] = useState(false);

  const handleClaim = async () => {
    const success = await claimDailyReward();
    if (success) {
      setClaimCelebration(true);
      setTimeout(() => setClaimCelebration(false), 3000);
    }
  };

  const coinTasks = [
    { title: 'Complete 5-minute Voice Chat', reward: '+30 Coins', desc: 'Have a natural voice session with Zara' },
    { title: 'Practice a New Language', reward: '+25 Coins', desc: 'Ask Zara to translate and teach phrases' },
    { title: 'Create Daily Productivity Plan', reward: '+20 Coins', desc: 'Use the daily assistant briefing' },
  ];

  return (
    <div className="space-y-6 pb-24 px-4 sm:px-6 pt-2 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black font-display text-white">Your Coins & Rewards</h1>
        <p className="text-xs text-slate-400">Earn coins through daily interaction & unlock premium features</p>
      </div>

      {/* Main Coin Balance Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#241334] via-[#160f27] to-[#0a0818] border border-amber-500/30 glow-pink-sm text-center">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Coins className="w-7 h-7 text-white" />
          </div>

          <div className="text-4xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
            {coins}
          </div>

          <p className="text-xs text-amber-200/80 font-medium">Available Zara Coins</p>

          <span className="text-[10px] text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            Basic chat is always 100% free
          </span>
        </div>
      </div>

      {/* Daily Reward Claim Card */}
      <div className="rounded-2xl p-4.5 glass-card border border-pink-500/25 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-pink-500/20">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-display">Daily Reward</h3>
            <p className="text-[11px] text-pink-300 font-medium">+50 Coins every 24 hours</p>
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={hasClaimedToday}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            hasClaimedToday
              ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30 hover:scale-105 active:scale-95'
          }`}
        >
          {hasClaimedToday ? 'Claimed' : 'Claim +50'}
        </button>
      </div>

      {claimCelebration && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center font-semibold animate-bounce">
          🎉 +50 Zara Coins credited to your account!
        </div>
      )}

      {/* Earn More Coins Tasks */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Earn More Coins
        </h2>

        <div className="space-y-2">
          {coinTasks.map((task, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl glass-card border border-white/5 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-200">{task.title}</h4>
                <p className="text-[10px] text-slate-400">{task.desc}</p>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                {task.reward}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription / Membership Tiers */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Membership Tiers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Free Tier */}
          <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Starter</span>
              <h3 className="text-base font-bold text-white font-display">Zara Free</h3>
              <p className="text-lg font-extrabold text-white mt-1">$0 <span className="text-xs text-slate-400 font-normal">/ forever</span></p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unlimited standard text chat</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voice conversation mode</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-language support</span>
              </li>
            </ul>
            <button className="w-full py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-medium border border-white/10">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#241235] to-[#120a1f] border border-pink-500/40 glow-pink-sm space-y-3 relative">
            <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider bg-pink-500 text-white px-2 py-0.5 rounded-full">
              POPULAR
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-pink-300 font-mono">Advanced AI</span>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-1">
                <span>Zara Pro Plus</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-lg font-extrabold text-white mt-1">$9.99 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-pink-100/90">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Unlimited high-fidelity voice</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-pink-400" />
                <span>Priority response speeds</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom 3D avatar unlocked</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                <span>Continuous persistent memory</span>
              </li>
            </ul>
            <button
              onClick={() => alert('Subscription flow integration: In production, connects via secure payment provider (Stripe/Google Play).')}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-pink-500/30 hover:opacity-95"
            >
              Upgrade to Pro Plus
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Recent Activity</span>
          </h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-4 rounded-2xl glass-card text-center text-xs text-slate-400 border border-white/5">
            Initial bonus +150 Zara Coins credited upon registration.
          </div>
        ) : (
          <div className="space-y-1.5">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl glass-card border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200">{tx.description}</span>
                  <p className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="font-mono font-bold text-emerald-400 flex items-center">
                  +{tx.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
