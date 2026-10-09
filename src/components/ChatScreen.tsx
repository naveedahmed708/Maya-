import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Copy,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';
import { speakText, stopSpeech } from '../services/gemini';

export const ChatScreen: React.FC = () => {
  const {
    messages,
    sendMessage,
    setActiveTab,
    selectedVoice,
    activeConversationId,
    conversations,
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isDictating, setIsDictating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputPrompt.trim()) return;
    const text = inputPrompt;
    setInputPrompt('');
    await sendMessage(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = async (id: string, text: string) => {
    if (playingId === id) {
      stopSpeech();
      setPlayingId(null);
    } else {
      setPlayingId(id);
      await speakText(
        text,
        selectedVoice.id,
        () => setPlayingId(id),
        () => setPlayingId(null)
      );
    }
  };

  const handleDictate = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isDictating) {
      setIsDictating(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsDictating(true);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? `${prev} ${text}` : text));
        setIsDictating(false);
      };
      recognition.onerror = () => setIsDictating(false);
      recognition.onend = () => setIsDictating(false);

      recognition.start();
    } catch {
      setIsDictating(false);
    }
  };

  const suggestions = [
    'Write a creative sci-fi story opening',
    'Tips to sleep better tonight',
    'Explain API endpoints with an analogy',
    'Help me practice Spanish conversation',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-lg mx-auto bg-[#07070e] relative">
      {/* Top Header */}
      <div className="sticky top-0 z-20 px-4 py-3 bg-[#0a0916]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white font-display">
              {activeConv?.title || 'Chat With Zara'}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Connected · Voice: {selectedVoice.name}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('zara')}
          className="px-3 py-1.5 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-pink-500/25 transition-all"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Voice Mode</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4 py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center glow-pink-sm">
              <Sparkles className="w-8 h-8 text-pink-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Ask Zara Anything</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Ask questions, draft emails, practice languages, or brainstorm new ideas.
              </p>
            </div>

            {/* Quick Starter Chips */}
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs pt-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputPrompt(s);
                  }}
                  className="text-left px-3 py-2 rounded-xl glass-card text-xs text-slate-300 hover:text-pink-300 hover:border-pink-500/40 transition-colors"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-br-xs shadow-md shadow-pink-500/20'
                      : 'glass-card border border-pink-500/20 text-slate-100 rounded-bl-xs'
                  }`}
                >
                  {/* Streaming indicator if message text is empty */}
                  {!msg.text && msg.status === 'sending' ? (
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  )}
                </div>

                {/* Message action bar for Zara responses */}
                {!isUser && msg.text && (
                  <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                    <button
                      onClick={() => handleSpeak(msg.id, msg.text)}
                      className="hover:text-pink-400 transition-colors flex items-center gap-1"
                      title="Speak message aloud"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${playingId === msg.id ? 'text-pink-400 animate-pulse' : ''}`} />
                      <span>{playingId === msg.id ? 'Stop' : 'Listen'}</span>
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-pink-400 transition-colors flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => sendMessage(`Regenerate this response: "${msg.text.slice(0, 50)}..."`)}
                      className="hover:text-pink-400 transition-colors flex items-center gap-1"
                      title="Regenerate"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="sticky bottom-0 z-20 p-3 bg-[#0a0916]/95 backdrop-blur-md border-t border-white/5">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Speech Dictation Button */}
          <button
            type="button"
            onClick={handleDictate}
            className={`min-w-[42px] min-h-[42px] rounded-xl flex items-center justify-center transition-all ${
              isDictating
                ? 'bg-rose-500 text-white animate-pulse glow-pink-sm'
                : 'glass-card text-slate-300 hover:text-white hover:border-pink-500/40'
            }`}
            title="Dictate with voice"
            aria-label="Dictate voice"
          >
            {isDictating ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask Zara anything..."
            className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500/50 transition-colors"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputPrompt.trim()}
            className="min-w-[42px] min-h-[42px] rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
