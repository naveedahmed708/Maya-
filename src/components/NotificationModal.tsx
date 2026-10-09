import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, CheckCircle2, Sparkles, Gift } from 'lucide-react';

export const NotificationModal: React.FC = () => {
  const {
    showNotificationDrawer,
    setShowNotificationDrawer,
    notifications,
    markNotificationRead,
  } = useApp();

  if (!showNotificationDrawer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm h-full bg-[#0c0a1a] border-l border-white/10 flex flex-col p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-pink-400" />
            <h2 className="text-base font-bold text-white font-display">Notification Center</h2>
          </div>
          <button
            onClick={() => setShowNotificationDrawer(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">No notifications.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl glass-card border transition-all cursor-pointer ${
                  n.read ? 'border-white/5 opacity-70' : 'border-pink-500/30 bg-pink-500/5 glow-pink-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{n.createdAt}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                {!n.read && (
                  <span className="inline-block mt-2 text-[9px] font-bold text-pink-400 uppercase tracking-wider">
                    ● UNREAD
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/5">
          <button
            onClick={() => {
              notifications.forEach((n) => markNotificationRead(n.id));
              setShowNotificationDrawer(false);
            }}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
          >
            Mark all as read & Close
          </button>
        </div>
      </div>
    </div>
  );
};
