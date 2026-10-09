import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  Sparkles,
  PenTool,
  BookOpen,
  Lightbulb,
  Languages,
  FileText,
  Calendar,
  Search,
  MessageSquare,
  ArrowRight,
  Clock,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { fetchDailyPlan } from '../services/gemini';

export const HomeScreen: React.FC = () => {
  const {
    setActiveTab,
    startVoiceListening,
    conversations,
    setActiveConversationId,
    deleteConversation,
    createNewConversation,
    sendMessage,
    userProfile,
    selectedAvatar,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [dailyPlanLoading, setDailyPlanLoading] = useState(false);
  const [dailyPlan, setDailyPlan] = useState<any | null>(null);

  const quickActions = [
    {
      title: 'Ask Anything',
      subtitle: 'Instant answers & facts',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
      prompt: 'Explain how quantum computing works in simple terms with an everyday analogy.',
    },
    {
      title: 'Write Something',
      subtitle: 'Emails, notes, posts',
      icon: PenTool,
      color: 'from-purple-500 to-indigo-500',
      prompt: 'Draft a polite follow-up email after a job interview emphasizing excitement and key strengths.',
    },
    {
      title: 'Learn & STEM',
      subtitle: 'Code, math & science',
      icon: BookOpen,
      color: 'from-cyan-500 to-blue-500',
      prompt: 'Can you teach me the basics of React hooks and how useEffect handles cleanups?',
    },
    {
      title: 'Create Ideas',
      subtitle: 'Brainstorm & innovate',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      prompt: 'Give me 5 viral video ideas for a tech review creator focusing on futuristic AI gadgets.',
    },
    {
      title: 'Translate',
      subtitle: 'Practice languages',
      icon: Languages,
      color: 'from-emerald-500 to-teal-500',
      prompt: 'How do you say "I would love to collaborate on this exciting project" in Spanish, French, and Japanese?',
    },
    {
      title: 'Summarize',
      subtitle: 'Condense long text',
      icon: FileText,
      color: 'from-fuchsia-500 to-pink-500',
      prompt: 'What are the top 3 principles of deep work productivity according to Cal Newport?',
    },
  ];

  const handleActionClick = async (prompt: string, title: string) => {
    const convId = await createNewConversation(title);
    setActiveTab('chat');
    await sendMessage(prompt);
  };

  const handleStartZara = () => {
    setActiveTab('zara');
    startVoiceListening();
  };

  const handleGeneratePlan = async () => {
    try {
      setDailyPlanLoading(true);
      const plan = await fetchDailyPlan(userProfile?.displayName || 'Friend', 'Productivity & Focus');
      setDailyPlan(plan);
    } catch (e) {
      console.error('Plan generation error:', e);
    } finally {
      setDailyPlanLoading(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 px-4 sm:px-6 pt-2 max-w-lg mx-auto">
      {/* Global Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations, topics & memories..."
          className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500/50 transition-colors"
        />
      </div>

      {/* Main Zara AI Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#1b122c] via-[#140f24] to-[#0c0a1a] border border-pink-500/30 glow-pink-sm">
        {/* Ambient glow in background */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase font-mono">
                Connected
              </span>
            </div>

            <h1 className="text-2xl font-black font-display text-white tracking-tight">
              Zara AI
            </h1>

            <p className="text-xs text-pink-200/80 font-medium">
              Your Smart AI Voice Assistant
            </p>

            {/* Main START ZARA Button */}
            <div className="pt-2">
              <button
                onClick={handleStartZara}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 active:scale-95 transition-all"
              >
                <Mic className="w-4 h-4 animate-pulse" />
                <span>START ZARA</span>
              </button>
            </div>
          </div>

          {/* Avatar preview icon */}
          <div
            onClick={() => setActiveTab('avatar')}
            className="cursor-pointer relative w-24 h-24 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-pink-500 to-purple-500 glow-pink-sm flex-shrink-0"
          >
            <img
              src={selectedAvatar.imageSrc}
              alt="Zara AI"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Daily Assistant Card: "Want me to plan tomorrow?" */}
      <div className="rounded-2xl p-4 glass-card border border-purple-500/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white font-display">Daily Assistant Plan</h3>
              <p className="text-[11px] text-slate-400">Want me to organize your goals & schedule?</p>
            </div>
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={dailyPlanLoading}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {dailyPlanLoading ? 'Thinking...' : dailyPlan ? 'Refresh' : 'Plan Today'}
          </button>
        </div>

        {dailyPlan && (
          <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
            <p className="text-pink-300 font-medium italic">"{dailyPlan.greeting}"</p>
            <div className="space-y-1.5 pt-1">
              {dailyPlan.schedule?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-[11px]">
                  <span className="font-mono text-cyan-300">{item.time}</span>
                  <span className="text-slate-200 truncate mx-2">{item.task}</span>
                  <span className="text-[10px] text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/20">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
            {dailyPlan.zaraTip && (
              <p className="text-[11px] text-slate-300 pt-1 flex items-start gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-pink-300">Zara's Tip:</strong> {dailyPlan.zaraTip}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Quick Actions
          </h2>
          <span className="text-[11px] text-pink-400 font-medium">One-Tap Prompt</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => handleActionClick(action.prompt, action.title)}
                className="text-left p-3.5 rounded-2xl glass-card hover:border-pink-500/40 border border-white/5 transition-all group flex flex-col justify-between space-y-2"
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {action.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Recent Conversations
          </h2>
          <button
            onClick={() => {
              createNewConversation('New Chat');
              setActiveTab('chat');
            }}
            className="text-[11px] text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
          >
            <span>+ New Chat</span>
          </button>
        </div>

        {filteredConversations.length === 0 ? (
          <div className="p-6 rounded-2xl glass-card text-center space-y-2 border border-white/5">
            <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">No conversations yet.</p>
            <p className="text-[11px] text-slate-500">Tap "START ZARA" or any quick action to begin!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.slice(0, 5).map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  setActiveTab('chat');
                }}
                className="p-3 rounded-2xl glass-card hover:border-pink-500/30 border border-white/5 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-pink-300 truncate transition-colors">
                    {conv.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {conv.lastMessage || 'Tap to chat with Zara'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete conversation"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
