/**
 * Zara AI - "Your Smart AI Voice Assistant"
 * Core Application Entry
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Splash } from './components/Splash';
import { Onboarding } from './components/Onboarding';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { VoiceExperience } from './components/VoiceExperience';
import { ChatScreen } from './components/ChatScreen';
import { AvatarScreen } from './components/AvatarScreen';
import { CoinsScreen } from './components/CoinsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { NotificationModal } from './components/NotificationModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';

const AppContent: React.FC = () => {
  const { showSplash, showOnboarding, activeTab } = useApp();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  if (showSplash) {
    return <Splash />;
  }

  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-[#06060c] text-white flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {/* App Header (Shown on tabs except immersive voice) */}
      {activeTab !== 'zara' && activeTab !== 'chat' && <Header />}

      {/* Main Screen View Router */}
      <main className="flex-1 w-full max-w-lg mx-auto overflow-x-hidden">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'avatar' && <AvatarScreen />}
        {activeTab === 'zara' && <VoiceExperience />}
        {activeTab === 'chat' && <ChatScreen />}
        {activeTab === 'coins' && <CoinsScreen />}
        {activeTab === 'settings' && (
          <SettingsScreen onOpenAdmin={() => setShowAdminPanel(true)} />
        )}
      </main>

      {/* Persistent Bottom Tab Navigation */}
      <Navigation />

      {/* Notification Drawer Modal */}
      <NotificationModal />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
