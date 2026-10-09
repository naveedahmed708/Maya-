import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  User,
  handleFirestoreError,
  OperationType,
} from '../services/firebase';
import {
  AppTab,
  VoiceState,
  UserProfile,
  UserSettings,
  Conversation,
  ChatMessage,
  AIMemory,
  CoinTransaction,
  NotificationItem,
  AvatarStyle,
  VoiceOption,
  LanguageOption,
} from '../types';
import { sendZaraMessage, speakText, stopSpeech } from '../services/gemini';

// Generated assets
import zaraAvatarMain from '../assets/images/zara_avatar_main_1791458006551.jpg';
import zaraAvatarSpeaking from '../assets/images/zara_avatar_speaking_1791458024501.jpg';
import zaraAvatarCyber from '../assets/images/zara_avatar_cyber_1791458041093.jpg';
import zaraSplashSymbol from '../assets/images/zara_splash_symbol_1791458060063.jpg';

export const AVATAR_STYLES: AvatarStyle[] = [
  {
    id: 'classic_violet',
    name: 'Zara Violet Core',
    description: 'Signature intelligent assistant with sleek dark violet style & cybernetic accents',
    imageSrc: zaraAvatarMain,
    outfit: 'Signature Neural Suit',
    ambientColor: 'rgba(236, 72, 153, 0.4)',
  },
  {
    id: 'speaking_glow',
    name: 'Zara Holographic Glow',
    description: 'High-energy expressive form with soundwave resonance rings',
    imageSrc: zaraAvatarSpeaking,
    outfit: 'Harmonic Pulse Armor',
    ambientColor: 'rgba(168, 85, 247, 0.4)',
  },
  {
    id: 'cyber_street',
    name: 'Zara Cyber Street',
    description: 'Modern cyberpunk jacket with neon trim & focused intelligence',
    imageSrc: zaraAvatarCyber,
    outfit: 'Cyber Streetwear Tech',
    ambientColor: 'rgba(6, 182, 212, 0.4)',
  },
];

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'Kore', name: 'Kore (Default)', provider: 'Gemini', gender: 'Female', sampleText: "Hi there! I'm Zara, ready whenever you are.", accent: 'Natural Warm' },
  { id: 'Zephyr', name: 'Zephyr', provider: 'Gemini', gender: 'Female', sampleText: "Hello! Let's explore ideas and plan your day.", accent: 'Confident Clear' },
  { id: 'Puck', name: 'Puck', provider: 'Gemini', gender: 'Male', sampleText: "Hey! Ready to learn and create together.", accent: 'Energetic' },
  { id: 'Fenrir', name: 'Fenrir', provider: 'Gemini', gender: 'Male', sampleText: "Greetings. How may I assist your workflow today?", accent: 'Deep Resonant' },
];

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
];

const ADMIN_EMAIL = 'naveedahmedmemon.com450@gmail.com';

interface AppContextType {
  // Navigation & Screen State
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showNotificationDrawer: boolean;
  setShowNotificationDrawer: (show: boolean) => void;

  // Auth & Profile
  user: User | null;
  userProfile: UserProfile | null;
  isLoadingAuth: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;

  // Voice State & Engine
  voiceState: VoiceState;
  setVoiceState: (state: VoiceState) => void;
  voiceTranscript: string;
  setVoiceTranscript: (t: string) => void;
  zaraVoiceReply: string;
  startVoiceListening: () => void;
  stopVoiceListening: () => void;
  interruptZara: () => void;

  // Chat & History
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  createNewConversation: (title?: string) => Promise<string>;
  deleteConversation: (id: string) => Promise<void>;

  // Settings & Customization
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  selectedAvatar: AvatarStyle;
  setSelectedAvatar: (avatar: AvatarStyle) => void;
  selectedVoice: VoiceOption;
  setSelectedVoice: (voice: VoiceOption) => void;
  selectedLanguage: LanguageOption;
  setSelectedLanguage: (lang: LanguageOption) => void;

  // Economy & Coins
  coins: number;
  transactions: CoinTransaction[];
  claimDailyReward: () => Promise<boolean>;
  hasClaimedToday: boolean;

  // Memories & Notifications
  memories: AIMemory[];
  addMemory: (key: string, value: string, category?: string) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  clearAllMemories: () => Promise<void>;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;

  // Assets
  assets: {
    avatarMain: string;
    avatarSpeaking: string;
    avatarCyber: string;
    splashSymbol: string;
  };
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Splash & Onboarding
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('zara_onboarding_completed') !== 'true';
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Voice State
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [zaraVoiceReply, setZaraVoiceReply] = useState('');

  // Customization
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarStyle>(AVATAR_STYLES[0]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICE_OPTIONS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(LANGUAGE_OPTIONS[0]);

  // Settings
  const [settings, setSettings] = useState<UserSettings>({
    autoListen: true,
    voiceActivation: true,
    voiceResponses: true,
    soundEffects: true,
    hapticFeedback: true,
    memoryEnabled: true,
    streamingResponses: true,
    theme: 'futuristic-dark',
    updatedAt: new Date().toISOString(),
  });

  // Data Collections
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [memories, setMemories] = useState<AIMemory[]>([]);
  const [coins, setCoins] = useState(150);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Zara AI Connected',
      message: 'Your neural voice assistant is online and ready with full multi-language capabilities.',
      category: 'system',
      read: false,
      createdAt: 'Just now',
    },
    {
      id: 'notif_2',
      title: 'Daily Morning Briefing Ready',
      message: 'Zara prepared your schedule and high-priority productivity tasks.',
      category: 'briefing',
      read: false,
      createdAt: 'Today, 8:00 AM',
    },
    {
      id: 'notif_3',
      title: 'Daily Coin Reward Available',
      message: 'Tap in the Coins tab to claim your daily +50 Zara Coins bonus.',
      category: 'reward',
      read: false,
      createdAt: 'Today, 9:00 AM',
    },
  ]);

  // Assets
  const assets = {
    avatarMain: zaraAvatarMain,
    avatarSpeaking: zaraAvatarSpeaking,
    avatarCyber: zaraAvatarCyber,
    splashSymbol: zaraSplashSymbol,
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);

      if (currentUser) {
        // Fetch or create user profile
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
            if (data.coins !== undefined) setCoins(data.coins);
          } else {
            const newProfile: UserProfile = {
              userId: currentUser.uid,
              displayName: currentUser.displayName || 'Zara Explorer',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || zaraAvatarMain,
              coins: 200,
              selectedVoice: 'Kore',
              selectedPersonality: 'Empathetic & Warm',
              selectedLanguage: 'en',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              role: currentUser.email === ADMIN_EMAIL ? 'admin' : 'user',
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            setCoins(200);
          }
        } catch (err) {
          console.warn('Could not sync Firestore profile:', err);
        }
      } else {
        // Guest Profile
        setUserProfile({
          userId: 'guest_user',
          displayName: 'Guest Explorer',
          email: '',
          photoURL: zaraAvatarMain,
          coins: 150,
          selectedVoice: 'Kore',
          selectedPersonality: 'Friendly & Intelligent',
          selectedLanguage: 'en',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          role: 'user',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    user?.email === ADMIN_EMAIL || userProfile?.role === 'admin'
  );

  // Firestore Snapshot for Conversations & Messages when logged in
  useEffect(() => {
    if (!user) {
      // Local fallback conversations
      const localConvs: Conversation[] = [
        {
          id: 'demo_welcome',
          userId: 'guest_user',
          title: 'Welcome to Zara AI',
          category: 'General',
          lastMessage: 'Hello! I am Zara, your smart AI voice companion. What can we do today?',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setConversations(localConvs);
      if (!activeConversationId) {
        setActiveConversationId('demo_welcome');
        setMessages([
          {
            id: 'm_welcome_1',
            conversationId: 'demo_welcome',
            userId: 'guest_user',
            sender: 'zara',
            text: 'Hello! I am Zara AI, your smart voice assistant. You can tap the center microphone button to speak with me directly or type your questions here!',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      return;
    }

    try {
      const convsRef = collection(db, 'users', user.uid, 'conversations');
      const q = query(convsRef, orderBy('updatedAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const convList: Conversation[] = [];
        snapshot.forEach((docSnap) => {
          convList.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setConversations(convList);
        if (convList.length > 0 && !activeConversationId) {
          setActiveConversationId(convList[0].id);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/conversations`);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore conversations query:', err);
    }
  }, [user]);

  // Messages listener for active conversation
  useEffect(() => {
    if (!user || !activeConversationId || activeConversationId === 'demo_welcome') return;

    try {
      const msgsRef = collection(db, 'users', user.uid, 'conversations', activeConversationId, 'messages');
      const q = query(msgsRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgList: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          msgList.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setMessages(msgList);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/conversations/${activeConversationId}/messages`);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore messages query:', err);
    }
  }, [user, activeConversationId]);

  // Auth Functions
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (userProfile) {
      const updated = { ...userProfile, ...data, updatedAt: new Date().toISOString() };
      setUserProfile(updated);
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
        } catch (err) {
          console.warn('Could not save profile to firestore:', err);
        }
      }
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings, updatedAt: new Date().toISOString() };
    setSettings(updated);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'settings', 'app'), updated, { merge: true });
      } catch (err) {
        console.warn('Could not save settings to firestore:', err);
      }
    }
  };

  // Create new conversation
  const createNewConversation = async (title: string = 'New Conversation'): Promise<string> => {
    const id = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id,
      userId: user?.uid || 'guest_user',
      title,
      category: 'General',
      lastMessage: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'conversations', id), newConv);
      } catch (e) {
        console.warn('Failed to save conversation:', e);
      }
    }

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(id);
    setMessages([]);
    return id;
  };

  // Delete conversation
  const deleteConversation = async (id: string) => {
    if (user) {
      try {
        const { deleteDoc } = await import('../services/firebase');
        await deleteDoc(doc(db, 'users', user.uid, 'conversations', id));
      } catch (e) {
        console.warn('Delete conversation failed:', e);
      }
    }
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining[0]?.id || null);
    }
  };

  // Send message
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = await createNewConversation(text.slice(0, 30));
    }

    const userMsgId = `msg_${Date.now()}_u`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      conversationId: convId,
      userId: user?.uid || 'guest_user',
      sender: 'user',
      text: text.trim(),
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMsg]);

    // Zara message placeholder
    const zaraMsgId = `msg_${Date.now()}_z`;
    const zaraPlaceholder: ChatMessage = {
      id: zaraMsgId,
      conversationId: convId,
      userId: user?.uid || 'guest_user',
      sender: 'zara',
      text: '',
      createdAt: new Date().toISOString(),
      status: 'sending',
    };
    setMessages((prev) => [...prev, zaraPlaceholder]);

    try {
      let accumulated = '';
      const reply = await sendZaraMessage(
        {
          prompt: text,
          history: messages.slice(-8).map((m) => ({ sender: m.sender, text: m.text })),
          personality: userProfile?.selectedPersonality || 'Friendly & Intelligent',
          language: selectedLanguage.name,
          memories: memories.map((m) => ({ key: m.key, value: m.value })),
          stream: settings.streamingResponses,
        },
        (chunk) => {
          accumulated += chunk;
          setMessages((prev) =>
            prev.map((m) => (m.id === zaraMsgId ? { ...m, text: accumulated } : m))
          );
        }
      );

      const finalReply = reply || accumulated;
      setMessages((prev) =>
        prev.map((m) => (m.id === zaraMsgId ? { ...m, text: finalReply, status: 'sent' } : m))
      );

      // Save to Firestore if authenticated
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid, 'conversations', convId, 'messages', userMsgId), userMsg);
          await setDoc(doc(db, 'users', user.uid, 'conversations', convId, 'messages', zaraMsgId), {
            ...zaraPlaceholder,
            text: finalReply,
            status: 'sent',
          });
          // Update conversation lastMessage
          await setDoc(
            doc(db, 'users', user.uid, 'conversations', convId),
            { lastMessage: finalReply.slice(0, 80), updatedAt: new Date().toISOString() },
            { merge: true }
          );
        } catch (e) {
          console.warn('Error saving messages to firestore:', e);
        }
      }

      // Voice response if enabled
      if (settings.voiceResponses) {
        speakText(
          finalReply,
          selectedVoice.id,
          () => setVoiceState('speaking'),
          () => setVoiceState('idle')
        );
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === zaraMsgId
            ? { ...m, text: "Zara couldn't complete that request. Please try again.", status: 'error' }
            : m
        )
      );
    }
  };

  // Voice Interaction Pipeline
  const startVoiceListening = useCallback(() => {
    stopSpeech();
    setVoiceState('listening');
    setVoiceTranscript('');
    setZaraVoiceReply('');

    // Check SpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceTranscript("Voice recognition not supported in this browser. Please type or use Chrome.");
      setVoiceState('error');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage.code === 'ur' ? 'ur-PK' : selectedLanguage.code === 'hi' ? 'hi-IN' : selectedLanguage.code === 'ar' ? 'ar-SA' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceTranscript('Microphone permission was denied. Please allow microphone access.');
        }
        setVoiceState('error');
      };

      recognition.onend = async () => {
        // When speech recognition ends, process query if transcript exists
        setVoiceTranscript((latest) => {
          if (latest && latest.trim().length > 0) {
            handleVoicePrompt(latest.trim());
          } else {
            setVoiceState('idle');
          }
          return latest;
        });
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      setVoiceState('error');
    }
  }, [selectedLanguage, selectedVoice, settings]);

  const handleVoicePrompt = async (transcript: string) => {
    setVoiceState('processing');
    try {
      const reply = await sendZaraMessage({
        prompt: transcript,
        personality: userProfile?.selectedPersonality || 'Friendly & Intelligent',
        language: selectedLanguage.name,
        memories: memories.map((m) => ({ key: m.key, value: m.value })),
      });

      setZaraVoiceReply(reply);
      setVoiceState('speaking');

      // Speak back
      await speakText(
        reply,
        selectedVoice.id,
        () => setVoiceState('speaking'),
        () => {
          setVoiceState('idle');
          if (settings.autoListen) {
            // Auto listen after finishing speaking if user keeps conversation flowing
            setTimeout(() => {
              startVoiceListening();
            }, 600);
          }
        }
      );
    } catch (err) {
      console.error('Voice processing error:', err);
      setZaraVoiceReply("Zara couldn't process that voice request. Please try again.");
      setVoiceState('error');
    }
  };

  const stopVoiceListening = useCallback(() => {
    setVoiceState('idle');
    stopSpeech();
  }, []);

  const interruptZara = useCallback(() => {
    stopSpeech();
    setVoiceState('idle');
    if (settings.autoListen) {
      startVoiceListening();
    }
  }, [settings.autoListen, startVoiceListening]);

  // Coins economy
  const claimDailyReward = async (): Promise<boolean> => {
    if (hasClaimedToday) return false;
    const reward = 50;
    const newTotal = coins + reward;
    setCoins(newTotal);
    setHasClaimedToday(true);

    const tx: CoinTransaction = {
      id: `tx_${Date.now()}`,
      userId: user?.uid || 'guest_user',
      amount: reward,
      type: 'daily_reward',
      description: 'Daily login bonus',
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { coins: newTotal }, { merge: true });
        await setDoc(doc(db, 'users', user.uid, 'coinTransactions', tx.id), tx);
      } catch (e) {
        console.warn('Could not persist coins reward:', e);
      }
    }
    return true;
  };

  // Memories
  const addMemory = async (key: string, value: string, category: string = 'Preference') => {
    const mem: AIMemory = {
      id: `mem_${Date.now()}`,
      userId: user?.uid || 'guest_user',
      key,
      value,
      category,
      createdAt: new Date().toISOString(),
    };
    setMemories((prev) => [mem, ...prev]);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'memories', mem.id), mem);
      } catch (e) {
        console.warn('Could not persist memory:', e);
      }
    }
  };

  const deleteMemory = async (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (user) {
      try {
        const { deleteDoc } = await import('../services/firebase');
        await deleteDoc(doc(db, 'users', user.uid, 'memories', id));
      } catch (e) {
        console.warn('Could not delete memory:', e);
      }
    }
  };

  const clearAllMemories = async () => {
    setMemories([]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        showSplash,
        setShowSplash,
        showOnboarding,
        setShowOnboarding,
        showAuthModal,
        setShowAuthModal,
        showNotificationDrawer,
        setShowNotificationDrawer,
        user,
        userProfile,
        isLoadingAuth,
        isAdmin,
        loginWithGoogle,
        logout,
        updateProfileData,
        voiceState,
        setVoiceState,
        voiceTranscript,
        setVoiceTranscript,
        zaraVoiceReply,
        startVoiceListening,
        stopVoiceListening,
        interruptZara,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        createNewConversation,
        deleteConversation,
        settings,
        updateSettings,
        selectedAvatar,
        setSelectedAvatar,
        selectedVoice,
        setSelectedVoice,
        selectedLanguage,
        setSelectedLanguage,
        coins,
        transactions,
        claimDailyReward,
        hasClaimedToday,
        memories,
        addMemory,
        deleteMemory,
        clearAllMemories,
        notifications,
        markNotificationRead,
        assets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
