import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ShieldCheck, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    userProfile,
    setShowAuthModal,
    setShowNotificationDrawer,
    notifications,
    isAdmin,
    setActiveTab,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = userProfile?.displayName || (user?.displayName ? user.displayName.split(' ')[0] : 'Explorer');

  return (
    <header className="sticky top-0 z-30 w-full bg-[#07070e]/85 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
      {/* Left Greeting & Subtitle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('avatar')}
          className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-purple-500 glow-pink-sm overflow-hidden flex-shrink-0"
          aria-label="View Zara Avatar"
        >
          <img
            src={userProfile?.photoURL || ''}
            alt="User avatar"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </button>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-white tracking-tight font-display">
              {getGreeting()}, {displayName}
            </h2>
            {isAdmin && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 text-[9px] font-bold border border-pink-500/30">
                <ShieldCheck className="w-2.5 h-2.5" />
                ADMIN
              </span>
            )}
          </div>
          <p className="text-[11px] text-pink-300/70 font-medium">
            What can I help you with today?
          </p>
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        {/* Notifications Icon */}
        <button
          onClick={() => setShowNotificationDrawer(true)}
          className="relative min-w-[40px] min-h-[40px] rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-pink-500/30 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#07070e]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Auth / Profile Button */}
        {!user ? (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-3 py-1.5 rounded-xl bg-pink-500/15 border border-pink-500/40 text-pink-300 text-xs font-semibold hover:bg-pink-500/25 transition-all"
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('settings')}
            className="px-2.5 py-1.5 rounded-xl glass-card text-slate-300 text-xs font-medium border border-white/10 hover:border-pink-500/30 transition-all flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px]">Synced</span>
          </button>
        )}
      </div>
    </header>
  );
};
