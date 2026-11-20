import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateId } from '../../utils/helpers';
import { buildGeminiSystemPrompt } from '../../data/irisKnowledge';
import { processIrisQuery } from '../../data/irisEngine';
import IrisCuteBotAvatar from './IrisCuteBotAvatar';
import './IRIS.css';

/**
 * Synthesizes a sweet, adorable melodic anime chirp sound
 * using the browser's native Web Audio API (zero external asset dependencies).
 */
function playCuteAnimeChirp() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    // Sweet cheerful ascending notes: D6 (1174Hz) -> G6 (1568Hz) -> C7 (2093Hz)
    const notes = [
      { freq: 1174.66, time: 0, dur: 0.11 },
      { freq: 1567.98, time: 0.06, dur: 0.13 },
      { freq: 2093.0, time: 0.13, dur: 0.24 },
    ];
    notes.forEach(({ freq, time: noteTime, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + noteTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.08, now + noteTime + dur);
      gain.gain.setValueAtTime(0, now + noteTime);
      gain.gain.linearRampToValueAtTime(0.12, now + noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + noteTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + noteTime);
      osc.stop(now + noteTime + dur);
    });
  } catch {
    // Non-critical audio error handling
  }
}

/**
 * Strips markdown, emojis, URLs, and asterisks for smooth human-like Text-To-Speech
 * Guarantees that emojis and symbols are NEVER read aloud by the speech synthesizer.
 */
function stripMarkdownForTTS(text) {
  if (!text) return '';

  return text
    // Replace markdown links [label](url) with just label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold and italics
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove code blocks and inline code
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove raw URLs
    .replace(/https?:\/\/\S+/g, '')
    // Remove list markers and markdown headers
    .replace(/^[#*->•·–—]\s+/gm, '')
    // Strip all Unicode emojis cleanly
    .replace(/\p{Extended_Pictographic}|\p{Emoji}/gu, '')
    // Strip stray joining characters, variation selectors, bullets
    .replace(/\u200D|\uFE0E|\uFE0F/g, '')
    .replace(/[•·★☆]/g, '')
    // Normalize newlines and spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Accurately finds an installed Bengali TTS voice without false positives
 */
function findTrueBengaliVoice(voices) {
  if (!voices || voices.length === 0) return null;
  return (
    voices.find((v) => {
      const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
      const n = (v.name || '').toLowerCase();
      return (
        l === 'bn' ||
        l.startsWith('bn-') ||
        l === 'ben' ||
        n.includes('bangla') ||
        n.includes('bengali')
      );
    }) || null
  );
}

/**
 * Accurately finds a natural female/assistant English TTS voice
 */
function findEnglishVoice(voices) {
  if (!voices || voices.length === 0) return null;
  return (
    voices.find((v) => {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      return (
        lang.startsWith('en') &&
        (name.includes('female') ||
         name.includes('zira') ||
         name.includes('samantha') ||
         name.includes('jenny') ||
         name.includes('aria') ||
         name.includes('victoria') ||
         name.includes('karen') ||
         name.includes('natural') ||
         name.includes('google us english'))
      );
    }) ||
    voices.find((v) => {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      return lang.startsWith('en') && !name.includes('david') && !name.includes('mark') && !name.includes('george');
    }) ||
    voices.find((v) => (v.lang || '').toLowerCase().startsWith('en')) ||
    null
  );
}

/* ── Formatted Message Renderer (Turns Markdown Links [Label](url) into clickable <a> tags) ── */
function renderFormattedMessage(text) {
  if (!text) return null;

  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const parts = [];
    let keyIdx = 0;

    // Pattern matching either link [text](url) or bold **text** or code `code`
    const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      if (match[2] && match[3]) {
        // Clickable Markdown Link [label](url)
        const label = match[2];
        const url = match[3];
        const isPdf = url.endsWith('.pdf');
        const isEmail = url.startsWith('mailto:');
        parts.push(
          <a
            key={`link-${lineIdx}-${keyIdx++}`}
            href={url}
            target={isEmail ? undefined : '_blank'}
            rel={isEmail ? undefined : 'noopener noreferrer'}
            download={isPdf ? true : undefined}
            className="iris-link"
          >
            {label}
          </a>
        );
      } else if (match[4]) {
        // Bold **text**
        parts.push(
          <strong key={`bold-${lineIdx}-${keyIdx++}`}>
            {match[4]}
          </strong>
        );
      } else if (match[5]) {
        // Code `code`
        parts.push(
          <code key={`code-${lineIdx}-${keyIdx++}`} className="iris-inline-code">
            {match[5]}
          </code>
        );
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return (
      <span key={`line-${lineIdx}`}>
        {parts.length > 0 ? parts : line}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

/* ── Multilingual Suggested Questions ── */
const suggestedQuestions = [
  "Who is Shahariyar?",
  "শাহারিয়ার সম্পর্কে বলো",
  "amar github link dao",
  "What projects has he built?",
  "Which project uses AI?",
  "তোমার CV দেখতে চাই",
];

/* ── Comprehensive AI Response Engine ── */
async function getIrisResponse(userMessage, conversationHistory, preferredLang = null) {
  const text = (userMessage || '').trim();
  if (!text) return '';

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return processIrisQuery(text, conversationHistory, preferredLang);
  }

  const systemPrompt = buildGeminiSystemPrompt();
  const userInstruction =
    preferredLang === 'bn-BD'
      ? `[Important Instruction: Respond in natural Bengali script (বাংলা) so the voice engine can speak in sweet Bengali]\n${text}`
      : text;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood! I am Iris, Shahariyar Khan Rashad’s personal AI portfolio assistant. I am ready to converse naturally in Bengali, English, and Banglish.' }] },
            ...conversationHistory.slice(-10).map((m) => ({
              role: m.sender === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }],
            })),
            { role: 'user', parts: [{ text: userInstruction }] },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 380,
          },
        }),
      }
    );

    if (!response.ok) throw new Error(`API error ${response.status}`);

    const data = await response.json();
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (geminiText && geminiText.trim()) {
      return geminiText.trim();
    }

    return processIrisQuery(text, conversationHistory, preferredLang);
  } catch {
    // Smooth fallback to our comprehensive semantic engine
    return processIrisQuery(text, conversationHistory, preferredLang);
  }
}

/* ── IRIS Main Component ── */
export default function IRIS() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: 'iris-greeting-0',
      sender: 'iris',
      text: "Heyyy! 💙 I'm Iris, Shahariyar's personal AI portfolio assistant! I can tell you all about his projects, skills, education at DIU, research, and how to get in touch (or download his CV).\n\nবাংলা, English, or Banglish — ask me anything, or tap the mic 🎙️ to talk!",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Voice Interaction States
  const [speechSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState('bn-BD'); // 'bn-BD' (বাংলা) or 'en-US' (English)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('iris_voice_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [voiceFeedback, setVoiceFeedback] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const sendMessageRef = useRef(null);
  const currentAudioRef = useRef(null);

  // Helper to immediately cease all speech and audio playback
  const stopAllAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {}
      currentAudioRef.current = null;
    }
    setIsSpeaking(false);
    setSpeakingMsgId(null);
  }, []);

  // Close handler with audio cleanup
  const handleClose = useCallback(() => {
    setIsOpen(false);
    stopAllAudio();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setIsListening(false);
    setVoiceFeedback('');
  }, [stopAllAudio]);

  // Pre-load synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Text-To-Speech Output Function (Native Bengali Audio + English Assistant)
  const speakText = useCallback(
    (text, msgId = null) => {
      if (typeof window === 'undefined') return;

      // Toggle stop if already speaking this message
      if (isSpeaking && speakingMsgId === msgId && msgId !== null) {
        stopAllAudio();
        return;
      }

      stopAllAudio();

      const clean = stripMarkdownForTTS(text);
      if (!clean) return;

      // Detect Bengali script or Bengali intent
      const hasBengaliScript = /[\u0980-\u09FF]/.test(clean);
      const isBengali = hasBengaliScript || speechLang === 'bn-BD';

      const voices =
        'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
      const trueBengaliVoice = isBengali ? findTrueBengaliVoice(voices) : null;

      // ── 1. BENGALI SPEECH ──
      if (isBengali) {
        // If the browser has an explicit, verified Bengali voice (e.g. Edge Natural or Chrome)
        if (trueBengaliVoice && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(clean);
          utterance.lang = trueBengaliVoice.lang || 'bn-BD';
          utterance.voice = trueBengaliVoice;
          utterance.pitch = 1.05;
          utterance.rate = 1.0;

          utterance.onstart = () => {
            setIsSpeaking(true);
            setSpeakingMsgId(msgId);
          };
          utterance.onend = () => {
            setIsSpeaking(false);
            setSpeakingMsgId(null);
          };
          utterance.onerror = () => {
            setIsSpeaking(false);
            setSpeakingMsgId(null);
          };

          window.speechSynthesis.speak(utterance);
          return;
        }

        // If no native Bengali voice is installed in the OS (typical on Windows PCs):
        // Stream Google's High-Definition Native Bengali Voice!
        setIsSpeaking(true);
        setSpeakingMsgId(msgId);

        // Split text into natural sentence chunks (up to 160 chars per chunk)
        const sentences = clean
          .split(/([।?!.\n]+)/)
          .map((s) => s.trim())
          .filter(Boolean);

        const chunks = [];
        let cur = '';
        for (let i = 0; i < sentences.length; i++) {
          const part = sentences[i];
          if ((cur + ' ' + part).trim().length <= 160) {
            cur = (cur + ' ' + part).trim();
          } else {
            if (cur) chunks.push(cur);
            if (part.length <= 160) {
              cur = part;
            } else {
              chunks.push(part.slice(0, 160));
              cur = '';
            }
          }
        }
        if (cur) chunks.push(cur);

        // Play up to 3 natural sentences for crisp conversational pacing
        const speechChunks =
          (chunks.length > 0 ? chunks : [clean.slice(0, 160)]).slice(0, 3);

        const playChunk = (index) => {
          if (index >= speechChunks.length) {
            setIsSpeaking(false);
            setSpeakingMsgId(null);
            currentAudioRef.current = null;
            return;
          }

          const chunkText = speechChunks[index];
          const localUrl = `/api/tts?q=${encodeURIComponent(chunkText)}&tl=bn`;
          const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
            chunkText
          )}&tl=bn&client=tw-ob`;

          const audio = new Audio(localUrl);
          currentAudioRef.current = audio;

          audio.onplay = () => {
            setIsSpeaking(true);
            setSpeakingMsgId(msgId);
          };
          audio.onended = () => {
            playChunk(index + 1);
          };
          audio.onerror = () => {
            // If local proxy endpoint fails, attempt fallback
            const fallbackAudio = new Audio(fallbackUrl);
            currentAudioRef.current = fallbackAudio;
            fallbackAudio.onplay = () => {
              setIsSpeaking(true);
              setSpeakingMsgId(msgId);
            };
            fallbackAudio.onended = () => {
              playChunk(index + 1);
            };
            fallbackAudio.onerror = () => {
              setIsSpeaking(false);
              setSpeakingMsgId(null);
              currentAudioRef.current = null;
            };
            fallbackAudio.play().catch(() => {
              setIsSpeaking(false);
              setSpeakingMsgId(null);
              currentAudioRef.current = null;
            });
          };

          audio.play().catch((err) => {
            console.warn('Audio playback error:', err);
            setIsSpeaking(false);
            setSpeakingMsgId(null);
            currentAudioRef.current = null;
          });
        };

        playChunk(0);
        return;
      }

      // ── 2. ENGLISH SPEECH ──
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'en-US';
        const enVoice = findEnglishVoice(voices);
        if (enVoice) {
          utterance.voice = enVoice;
        }
        utterance.pitch = 1.18; // Sweet, natural female assistant pitch
        utterance.rate = 1.0;

        utterance.onstart = () => {
          setIsSpeaking(true);
          setSpeakingMsgId(msgId);
        };
        utterance.onend = () => {
          setIsSpeaking(false);
          setSpeakingMsgId(null);
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          setSpeakingMsgId(null);
        };

        window.speechSynthesis.speak(utterance);
      }
    },
    [isSpeaking, speakingMsgId, speechLang, stopAllAudio]
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  // Cleanup speech synthesis & recognition when closed or unmounted
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    }
  }, [isOpen]);

  // Send Message Logic
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

      // Stop any ongoing speech when user enters a new message
      stopAllAudio();

      const userMsg = {
        id: generateId(),
        sender: 'user',
        text: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setShowSuggestions(false);
      setIsTyping(true);

      const responseText = await getIrisResponse(
        text.trim(),
        [...messages, userMsg],
        speechLang
      );

      // Natural conversational pause
      await new Promise((r) => setTimeout(r, 450 + Math.random() * 300));

      setIsTyping(false);
      const irisMsgId = generateId();

      setMessages((prev) => [
        ...prev,
        {
          id: irisMsgId,
          sender: 'iris',
          text: responseText,
          timestamp: Date.now(),
        },
      ]);

      // If voice output is enabled, read IRIS's answer out loud!
      if (isVoiceEnabled) {
        setTimeout(() => {
          speakText(responseText, irisMsgId);
        }, 150);
      }
    },
    [messages, isVoiceEnabled, speakText, speechLang, stopAllAudio]
  );

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  // Initialize Speech Recognition (Microphone)
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = speechLang;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback(
          speechLang === 'bn-BD'
            ? '🎙️ শুনছি... বাংলায় কথা বলুন'
            : '🎙️ Listening... Speak in English'
        );
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        const spoken = final || interim;
        if (spoken) {
          setInput(spoken);
        }

        // Auto-send when final sentence is recognized!
        if (final && final.trim()) {
          try {
            recognition.stop();
          } catch {}
          setIsListening(false);
          setVoiceFeedback('✨ প্রসেসিং হচ্ছে...');
          setTimeout(() => {
            if (sendMessageRef.current) {
              sendMessageRef.current(final.trim());
            }
            setVoiceFeedback('');
          }, 400);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceFeedback('⚠️ মাইক্রোফোন পারমিশন অন করুন');
        } else if (event.error !== 'no-speech') {
          setVoiceFeedback('⚠️ ভয়েস শুনতে সমস্যা হয়েছে');
        }
        setTimeout(() => setVoiceFeedback(''), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => setVoiceFeedback(''), 1500);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition initialization error:', err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [speechLang]);

  // Toggle Microphone Listening
  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert('ভয়েস কমান্ড আপনার ব্রাউজারে সাপোর্টেড নয়। দয়া করে Google Chrome বা Microsoft Edge ব্যবহার করুন।');
      return;
    }

    // Stop audio if IRIS is currently speaking
    stopAllAudio();

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
      setVoiceFeedback('');
    } else {
      try {
        recognitionRef.current.lang = speechLang;
        recognitionRef.current.start();
      } catch {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch {}
          }, 150);
        } catch {}
      }
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (q) => {
    sendMessage(q);
  };

  return (
    <>
      {/* ── Floating Mascot Launcher ── */}
      <motion.button
        className="iris-mascot"
        onClick={() => {
          setIsOpen(!isOpen);
          playCuteAnimeChirp();
        }}
        aria-label={isOpen ? 'Close IRIS chat' : 'Open IRIS chat'}
        whileHover={{ scale: 1.12, y: -4 }}
        whileTap={{ scale: 0.94 }}
      >
        <div className="iris-mascot-bot-wrapper">
          <IrisCuteBotAvatar size={66} showPaws={true} isHappy={isSpeaking} />
        </div>
        <span className="iris-mascot-label">IRIS</span>
        <span className="iris-mascot-pulse" aria-hidden="true" />
      </motion.button>

      {/* ── Chat Modal Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="iris-chat"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="iris-chat-header">
              <div className="iris-chat-header-info">
                <div className="iris-chat-avatar">
                  <IrisCuteBotAvatar size={36} showPaws={false} isHappy={isSpeaking} />
                </div>
                <div>
                  <h3 className="iris-chat-name">IRIS</h3>
                  <p className="iris-chat-status">
                    <span
                      className={`iris-status-dot${isSpeaking ? ' iris-status-dot--speaking' : isTyping ? ' iris-status-dot--thinking' : ''}`}
                    />
                    {isSpeaking ? (
                      <span className="iris-status-speaking-text">
                        <span className="iris-voice-wave" aria-hidden="true">
                          <span /><span /><span /><span />
                        </span>
                        Speaking...
                      </span>
                    ) : isTyping ? (
                      'Thinking...'
                    ) : (
                      'Online • Voice & AI Assistant'
                    )}
                  </p>
                </div>
              </div>

              {/* Header Action Buttons (Voice Toggle + Close) */}
              <div className="iris-header-actions">
                <button
                  type="button"
                  className={`iris-voice-toggle-btn${isVoiceEnabled ? ' iris-voice-toggle-btn--active' : ''}`}
                  onClick={() => {
                    const next = !isVoiceEnabled;
                    setIsVoiceEnabled(next);
                    try {
                      localStorage.setItem('iris_voice_enabled', String(next));
                    } catch {}
                    if (!next) {
                      stopAllAudio();
                    }
                  }}
                  title={
                    isVoiceEnabled
                      ? 'ভয়েস আউটপুট: চালু (মিউট করতে ক্লিক করুন)'
                      : 'ভয়েস আউটপুট: মিউট (চালু করতে ক্লিক করুন)'
                  }
                  aria-label={isVoiceEnabled ? 'Mute IRIS voice' : 'Unmute IRIS voice'}
                >
                  {isVoiceEnabled ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  )}
                </button>

                <button
                  className="iris-chat-close"
                  onClick={handleClose}
                  aria-label="Close chat"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="iris-chat-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`iris-message iris-message--${msg.sender}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="iris-message-bubble">
                    {renderFormattedMessage(msg.text)}

                    {/* Replay / Listen button for IRIS messages */}
                    {msg.sender === 'iris' && (
                      <button
                        type="button"
                        className={`iris-msg-speak-btn${speakingMsgId === msg.id ? ' iris-msg-speak-btn--speaking' : ''}`}
                        onClick={() => speakText(msg.text, msg.id)}
                        title={speakingMsgId === msg.id ? 'থামাতে ক্লিক করুন' : 'ভয়েসে শুনুন (Listen out loud)'}
                        aria-label={speakingMsgId === msg.id ? 'Stop voice' : 'Listen to message'}
                      >
                        {speakingMsgId === msg.id ? (
                          <span className="iris-msg-wave" aria-hidden="true">
                            <span /><span /><span />
                          </span>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  className="iris-message iris-message--iris"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="iris-message-bubble iris-typing-bubble">
                    <span className="iris-typing-dot" />
                    <span className="iris-typing-dot" />
                    <span className="iris-typing-dot" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {showSuggestions && messages.length <= 1 && (
              <div className="iris-suggestions">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    className="iris-suggestion-chip"
                    onClick={() => handleSuggestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Voice Feedback Banner */}
            {voiceFeedback && (
              <div className="iris-voice-feedback">
                <span className="iris-voice-feedback-dot" />
                <span>{voiceFeedback}</span>
              </div>
            )}

            {/* Input Form with Voice Mic & Language Switcher */}
            <form className="iris-chat-input" onSubmit={handleSubmit}>
              <div className={`iris-input-box${isListening ? ' iris-input-box--listening' : ''}`}>
                <textarea
                  ref={inputRef}
                  className="iris-textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isListening
                      ? speechLang === 'bn-BD'
                        ? 'বাংলায় বলুন...'
                        : 'Speaking in English...'
                      : 'Ask Iris in বাংলা, English...'
                  }
                  rows={1}
                  disabled={isTyping}
                  aria-label="Message Iris"
                />

                {/* Voice Input Language Selector (BN / EN) */}
                <button
                  type="button"
                  className="iris-lang-toggle-btn"
                  onClick={() => {
                    const nextLang = speechLang === 'bn-BD' ? 'en-US' : 'bn-BD';
                    setSpeechLang(nextLang);
                    if (recognitionRef.current) {
                      recognitionRef.current.lang = nextLang;
                    }
                  }}
                  title={`ভয়েস ভাষা: ${speechLang === 'bn-BD' ? 'বাংলা (bn-BD)' : 'English (en-US)'} - পরিবর্তন করতে ক্লিক করুন`}
                  aria-label="Switch voice input language"
                >
                  {speechLang === 'bn-BD' ? '🇧🇩 BN' : '🇬🇧 EN'}
                </button>

                {/* Microphone Button */}
                <button
                  type="button"
                  className={`iris-mic-btn${isListening ? ' iris-mic-btn--listening' : ''}`}
                  onClick={toggleListening}
                  disabled={isTyping}
                  title={
                    isListening
                      ? 'ভয়েস রিকগনিশন চলছে... থামাতে ক্লিক করুন'
                      : `ভয়েস দিয়ে প্রশ্ন করুন (${speechLang === 'bn-BD' ? 'বাংলা' : 'English'})`
                  }
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening && (
                    <span className="iris-mic-pulse" aria-hidden="true" />
                  )}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  className={`iris-send-btn${!input.trim() || isTyping ? ' iris-send-btn--disabled' : ''}`}
                  disabled={!input.trim() || isTyping}
                  aria-label={isTyping ? 'Sending message...' : 'Send message'}
                >
                  {isTyping ? (
                    <span className="iris-send-spinner" aria-hidden="true" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
