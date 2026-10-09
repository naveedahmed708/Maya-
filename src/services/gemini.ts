/**
 * Zara AI Gemini Service Client
 * Handles text generation, streaming, high-fidelity TTS, and Web Speech API fallback.
 */

export interface ChatRequestOptions {
  prompt: string;
  history?: Array<{ sender: 'user' | 'zara'; text: string }>;
  personality?: string;
  language?: string;
  memories?: Array<{ key: string; value: string }>;
  stream?: boolean;
}

export async function sendZaraMessage(
  options: ChatRequestOptions,
  onStreamChunk?: (text: string) => void
): Promise<string> {
  if (options.stream && onStreamChunk) {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...options, stream: true }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';

    if (!reader) {
      throw new Error('Streaming body is not readable');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const payload = line.replace('data: ', '').trim();
          if (payload === '[DONE]') break;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) {
              accumulatedText += parsed.text;
              onStreamChunk(parsed.text);
            }
          } catch {
            // Ignore non-json chunk
          }
        }
      }
    }

    return accumulatedText;
  } else {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...options, stream: false }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server error ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  }
}

let activeAudio: HTMLAudioElement | null = null;

export async function speakText(
  text: string,
  voiceName: string = 'Kore',
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  // Stop existing playback
  stopSpeech();

  // Try Gemini high-fidelity server TTS first
  try {
    const response = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceName }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.audio) {
        const audioSrc = `data:audio/wav;base64,${data.audio}`;
        const audio = new Audio(audioSrc);
        activeAudio = audio;

        audio.onplay = () => onStart?.();
        audio.onended = () => {
          activeAudio = null;
          onEnd?.();
        };
        audio.onerror = () => {
          activeAudio = null;
          fallbackBrowserSpeech(text, onStart, onEnd);
        };

        await audio.play();
        return;
      }
    }
  } catch (error) {
    console.warn('Gemini TTS failed or offline, falling back to Web Speech API:', error);
  }

  // Graceful browser fallback
  fallbackBrowserSpeech(text, onStart, onEnd);
}

function fallbackBrowserSpeech(text: string, onStart?: () => void, onEnd?: () => void) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.05;

    // Pick female or pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Natural')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
  } else {
    onEnd?.();
  }
}

export function stopSpeech(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function fetchDailyPlan(userName: string = 'Friend', focus: string = 'Productivity') {
  const res = await fetch('/api/gemini/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, focus }),
  });
  if (!res.ok) throw new Error('Failed to generate daily plan');
  return res.json();
}
