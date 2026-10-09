export type AppTab = 'home' | 'avatar' | 'zara' | 'coins' | 'settings' | 'chat';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  coins: number;
  selectedVoice: string;
  selectedPersonality: string;
  selectedLanguage: string;
  createdAt: string;
  updatedAt: string;
  role?: 'user' | 'admin';
}

export interface UserSettings {
  autoListen: boolean;
  voiceActivation: boolean;
  voiceResponses: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  memoryEnabled: boolean;
  streamingResponses: boolean;
  theme: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  category: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  sender: 'user' | 'zara';
  text: string;
  audioUrl?: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface AIMemory {
  id: string;
  userId: string;
  key: string;
  value: string;
  category: string;
  createdAt: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'daily_reward' | 'chat_bonus' | 'premium_feature' | 'referral';
  description: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'briefing' | 'reminder' | 'system' | 'reward';
  read: boolean;
  createdAt: string;
}

export interface AvatarStyle {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  outfit: string;
  ambientColor: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  provider: 'Gemini' | 'WebSpeech';
  gender: 'Female' | 'Neutral' | 'Male';
  sampleText: string;
  accent: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}
