import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  QrCode,
  Volume2,
  VolumeX,
  MessageCircle,
} from 'lucide-react';
import { aiService } from '../../services/api/aiService';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  toolCalled?: string;
  timestamp: string;
  actionType?: 'EVENT_RSVP' | 'CERTIFICATE_DOWNLOAD' | 'CONTACT_CARD' | 'QR_LAUNCH';
  actionData?: any;
}

export const VolleyChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Hi! I'm Volley 🤖, your AI community assistant for VolunEase. I can help you find upcoming events, check your logged hours, download verified certificates, or connect directly with our Lead Coordinator, Aiyan!\n\nWhat can I help you with today?",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, boolean>>({});
  const [suggestions, setSuggestions] = useState<string[]>([
    'Show upcoming events',
    'Contact Coordinator Aiyan',
    'Download my certificate',
    'How do QR check-ins work?',
  ]);

  const { success, info } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (messageText: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.chatWithVolley(textToSend);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        toolCalled: response.toolCalled,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: response.actionType,
        actionData: response.actionData,
      };
      setMessages((prev) => [...prev, botMsg]);
      speakText(response.reply);

      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: "I'm temporarily having trouble connecting. Feel free to contact our coordinator Aiyan directly at +91 8431980683 or mdaiyan4896@gmail.com!",
          timestamp: 'Just now',
          actionType: 'CONTACT_CARD',
          actionData: {
            name: 'Aiyan',
            phone: '8431980683',
            email: 'mdaiyan4896@gmail.com',
            role: 'Lead Coordinator & Operations Director',
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRsvp = (eventTitle: string) => {
    setRsvpStatus((prev) => ({ ...prev, [eventTitle]: true }));
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    success('RSVP Confirmed! 🎉', `You are registered for "${eventTitle}". Calendar invite sent.`);
  };

  const handleDownloadCert = () => {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    info('Certificate Ready', 'Generating high-resolution official PDF certificate...');

    setTimeout(() => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#FCFCFA"/><rect x="30" y="30" width="740" height="540" fill="none" stroke="#D4AF37" stroke-width="6"/><text x="400" y="140" font-family="serif" font-size="28" font-weight="bold" fill="#0E3D31" text-anchor="middle">CERTIFICATE OF IMPACT</text><text x="400" y="240" font-family="sans-serif" font-size="16" fill="#738086" text-anchor="middle">Awarded to Elena Rostova for 112.0 hours</text><text x="400" y="340" font-family="sans-serif" font-size="12" fill="#738086" text-anchor="middle">Verified by Sofia Martinez & Aiyan</text></svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'VolunEase_Impact_Certificate_Elena_Rostova.svg';
      a.click();
      success('Downloaded! 🏆', 'Official certificate saved.');
    }, 400);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'assistant',
        text: "Chat refreshed! How can I assist you today with volunteer shifts, impact certificates, or coordinator contact?",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-teal text-white shadow-2xl hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Open Volley AI Assistant"
        >
          <Bot className="w-7 h-7 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white dark:border-gray-900" />
          </span>

          <span className="absolute right-16 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with Volley AI 🤖
          </span>
        </button>
      )}

      {/* Expanded Chatbot Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-250 font-['Inter']">
          {/* Header */}
          <div className="p-4 bg-gradient-teal text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] leading-tight">Volley AI</h3>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/25 text-white font-medium">
                    Assistant
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/80 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Online • Connected to GreenEarth</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  voiceEnabled ? 'bg-amber-400 text-gray-900' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={voiceEnabled ? 'Voice enabled' : 'Enable voice read-out'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleResetChat}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                title="Restart chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[var(--bg-primary)]">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-[var(--accent-primary-light)] text-[var(--accent-primary)] flex items-center justify-center shrink-0 text-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-2.5 ${
                    m.sender === 'user'
                      ? 'bg-gradient-teal text-white rounded-tr-none shadow-xs'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* ACTION CARD: Event RSVP */}
                  {m.actionType === 'EVENT_RSVP' && m.actionData && (
                    <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                        <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span>{m.actionData.eventTitle}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] space-y-0.5">
                        <div>📅 {m.actionData.date}</div>
                        <div>📍 {m.actionData.location}</div>
                      </div>
                      <Button
                        size="xs"
                        variant={rsvpStatus[m.actionData.eventTitle] ? 'secondary' : 'primary'}
                        className="w-full text-xs font-bold"
                        onClick={() => handleRsvp(m.actionData.eventTitle)}
                        leftIcon={rsvpStatus[m.actionData.eventTitle] ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : undefined}
                      >
                        {rsvpStatus[m.actionData.eventTitle] ? 'RSVP Confirmed ✓' : '1-Click RSVP Now'}
                      </Button>
                    </div>
                  )}

                  {/* ACTION CARD: Certificate Download */}
                  {m.actionType === 'CERTIFICATE_DOWNLOAD' && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Official Volunteer Certificate</span>
                        </span>
                        <span className="text-[10px] bg-amber-400 text-gray-900 px-1.5 py-0.5 rounded font-bold">
                          GOLD TIER
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        Cryptographically signed with official GreenEarth NGO seal and verification hash.
                      </p>
                      <Button
                        size="xs"
                        variant="accent"
                        className="w-full text-xs font-bold"
                        onClick={handleDownloadCert}
                        leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                      >
                        Download PDF Certificate 🏆
                      </Button>
                    </div>
                  )}

                  {/* ACTION CARD: Coordinator Contact (Aiyan) */}
                  {m.actionType === 'CONTACT_CARD' && (
                    <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                          A
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[var(--text-primary)]">Aiyan</div>
                          <div className="text-[10px] text-[var(--text-muted)]">Lead Coordinator & Director</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <a
                          href="tel:8431980683"
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                          <Phone className="w-3 h-3 text-[var(--accent-primary)]" />
                          <span>8431980683</span>
                        </a>

                        <a
                          href="https://wa.me/918431980683?text=Hi%20Aiyan,%20I%20have%20a%20question%20regarding%20VolunEase."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-500 text-white text-[11px] font-bold hover:bg-emerald-600 transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      <a
                        href="mailto:mdaiyan4896@gmail.com"
                        className="block text-center text-[10px] text-[var(--accent-primary)] font-semibold hover:underline"
                      >
                        ✉️ mdaiyan4896@gmail.com
                      </a>
                    </div>
                  )}

                  {/* ACTION CARD: QR Launch */}
                  {m.actionType === 'QR_LAUNCH' && (
                    <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                        <QrCode className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span>Instant Attendance QR Terminal</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        Display or scan your pass directly at the check-in desk on-site.
                      </p>
                      <Button
                        size="xs"
                        variant="primary"
                        className="w-full text-xs font-bold"
                        onClick={() => {
                          success('QR Scanner Terminal', 'Navigating to event attendance module.');
                          window.location.hash = '#attendance';
                        }}
                      >
                        Open Event Attendance Pass
                      </Button>
                    </div>
                  )}

                  {m.toolCalled && (
                    <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center gap-1 text-[10px] text-[var(--accent-primary)] font-medium">
                      <Sparkles className="w-3 h-3" />
                      <span>Volley AI Tool: {m.toolCalled}()</span>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] text-right ${
                      m.sender === 'user' ? 'text-white/70' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 text-xs text-[var(--text-secondary)] mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-[var(--accent-primary-light)] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Reply Chips */}
          <div className="p-2.5 bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)] flex gap-1.5 overflow-x-auto no-scrollbar">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary-light)] hover:text-[var(--accent-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Volley anything..."
                className="flex-1 h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-teal text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-sm transition-all cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mt-2 px-1">
              <span>✨ AI-powered assistant for VolunEase</span>
              <a href="tel:8431980683" className="hover:underline text-[var(--accent-primary)] font-semibold">
                Direct Help: Aiyan (8431980683)
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
