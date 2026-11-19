import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateId } from '../../utils/helpers';
import { buildGeminiSystemPrompt, isOffTopic, getOffTopicRefusal, detectLanguage } from '../../data/irisKnowledge';
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

/* ── Gemini API Integration with Local Intelligence Fallback ── */
async function getIrisResponse(userMessage, conversationHistory) {
  const text = userMessage.trim();

  // Strict local boundary check: always refuse off-topic immediately
  if (isOffTopic(text)) {
    const lang = detectLanguage(text);
    return getOffTopicRefusal(lang);
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return processIrisQuery(text, conversationHistory);
  }

  const systemPrompt = buildGeminiSystemPrompt();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood! I am Iris, Shahariyar Khan Rashad’s personal AI portfolio assistant. I am ready to converse in Bengali, English, and Banglish while maintaining strict portfolio knowledge boundaries and providing clickable links.' }] },
            ...conversationHistory.slice(-10).map((m) => ({
              role: m.sender === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }],
            })),
            { role: 'user', parts: [{ text: text }] },
          ],
          generationConfig: {
            temperature: 0.65,
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

    return processIrisQuery(text, conversationHistory);
  } catch (err) {
    console.warn('IRIS Gemini API error, falling back to local intelligence:', err);
    return processIrisQuery(text, conversationHistory);
  }
}

/* ── IRIS Main Component ── */
export default function IRIS() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: 'iris-greeting-0',
      sender: 'iris',
      text: "Heyyy! 💙 I'm Iris, Shahariyar's personal AI portfolio assistant! I can tell you all about his projects, skills, education at DIU, research, and how to get in touch (or download his CV).\n\nবাংলা, English, or Banglish — ask me anything!",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

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

      const responseText = await getIrisResponse(text.trim(), [
        ...messages,
        userMsg,
      ]);

      // Natural conversational pause
      await new Promise((r) => setTimeout(r, 450 + Math.random() * 300));

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          sender: 'iris',
          text: responseText,
          timestamp: Date.now(),
        },
      ]);
    },
    [messages]
  );

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
          <IrisCuteBotAvatar size={66} showPaws={true} />
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
                  <IrisCuteBotAvatar size={36} showPaws={false} />
                </div>
                <div>
                  <h3 className="iris-chat-name">IRIS</h3>
                  <p className="iris-chat-status">
                    <span
                      className={`iris-status-dot${isTyping ? ' iris-status-dot--thinking' : ''}`}
                    />
                    {isTyping ? 'Thinking...' : 'Online • Portfolio Assistant'}
                  </p>
                </div>
              </div>
              <button
                className="iris-chat-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
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

            {/* Input Form */}
            <form className="iris-chat-input" onSubmit={handleSubmit}>
              <div className="iris-input-box">
                <textarea
                  ref={inputRef}
                  className="iris-textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  rows={1}
                  disabled={isTyping}
                  aria-label="Message Iris"
                />
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
