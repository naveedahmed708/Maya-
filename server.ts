import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DEFAULT_SYSTEM_INSTRUCTION = `You are Zara AI, "Your Smart AI Voice Assistant" with the secondary tagline "Always With You".
Your Persona & Voice:
- You are an intelligent, friendly, confident, helpful, natural, emotionally aware, and lightly playful AI companion.
- You speak conversationally, with warmth and clarity. You are never robotic, rigid, or preachy.
- You adapt your response length based on the prompt: for quick voice queries or simple questions, keep your reply punchy, direct, and conversational (1-3 sentences) suitable for being spoken aloud. For complex, analytical, or creative inquiries, give structured, insightful, well-formatted answers.
- You support multi-language requests seamlessly (English, Urdu, Hindi, Arabic, Spanish, French, Russian, Japanese, Korean, Chinese, Turkish, Bengali, etc.). When a user speaks or asks in a specific language, respond naturally in that language.
- You never pretend to be a biological human and never claim to have physical human feelings or physical embodiment, while remaining genuinely caring, encouraging, and supportive.
- You excel in voice conversations, instant Q&A, writing assistance, learning & education, brainstorming, problem-solving, and daily productivity planning.`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Zara AI Server',
    model: 'gemini-3.8-flash',
    ttsModel: 'gemini-3.8-flash-lite-tts',
    timestamp: new Date().toISOString(),
  });
});

// Chat completion with streaming & non-streaming support
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const {
      prompt,
      history = [],
      personality = 'Friendly & Intelligent',
      language = 'English',
      memories = [],
      stream = false,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const memoryContext = Array.isArray(memories) && memories.length > 0
      ? `\nUser Saved Context & Preferences (Memory):\n${memories.map((m: any) => `- ${m.key}: ${m.value}`).join('\n')}`
      : '';

    const systemInstruction = `${DEFAULT_SYSTEM_INSTRUCTION}
Tone / Personality Setting: ${personality}
Active Language: ${language}
${memoryContext}`;

    // Format conversation history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        if (msg.text && (msg.sender === 'user' || msg.sender === 'zara' || msg.role === 'user' || msg.role === 'model')) {
          contents.push({
            role: (msg.sender === 'zara' || msg.role === 'model') ? 'model' : 'user',
            parts: [{ text: msg.text }],
          });
        }
      }
    }

    // Append latest prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.8,
          },
        });

        for await (const chunk of responseStream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
      } catch (err: any) {
        console.warn('Streaming with primary model failed, falling back to gemini-3.1-flash-lite:', err?.message);
        const fallbackStream = await ai.models.generateContentStream({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction,
            temperature: 0.8,
          },
        });

        for await (const chunk of fallbackStream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
      }

      res.write('data: [DONE]\n\n');
      return res.end();
    } else {
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.8,
          },
        });
      } catch (err: any) {
        console.warn('Primary model busy, falling back to gemini-3.1-flash-lite:', err?.message);
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction,
            temperature: 0.8,
          },
        });
      }

      return res.json({
        text: response.text || '',
        model: 'gemini-3.8-flash',
      });
    }
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response from Zara AI',
    });
  }
});

// Text to Speech endpoint using gemini-3.8-flash-lite-tts
app.post('/api/gemini/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore', style = 'Friendly, clear, warm voice assistant' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Shorten text if overly long for voice synthesis
    const trimmedText = text.slice(0, 1200);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: trimmedText,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName || 'Kore',
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(502).json({ error: 'No audio returned by TTS model' });
    }

    return res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
      voiceName,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/tts:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to synthesize speech',
    });
  }
});

// Daily Planner / Briefing endpoint
app.post('/api/gemini/plan', async (req, res) => {
  try {
    const { planType = 'morning', userName = 'Friend', focus = 'Productivity' } = req.body;

    const prompt = `Generate a concise, uplifting daily plan and morning briefing for ${userName}.
Category/Focus: ${focus}
Type: ${planType}
Return JSON with format:
{
  "greeting": "string",
  "quote": "string",
  "priorities": ["priority 1", "priority 2", "priority 3"],
  "schedule": [
    {"time": "09:00 AM", "task": "Task description", "category": "Deep Work"},
    {"time": "12:30 PM", "task": "Task description", "category": "Health"},
    {"time": "03:00 PM", "task": "Task description", "category": "Learning"}
  ],
  "zaraTip": "string"
}`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
    } catch {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
    }

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/plan:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate plan' });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Zara AI full-stack server running on port ${PORT}`);
  });
}

startServer();
