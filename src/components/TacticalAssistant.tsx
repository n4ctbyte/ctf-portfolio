import { useState, useRef, useEffect } from 'react';
import { Terminal, X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function TacticalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'SYSTEM OPERATOR ONLINE. Tactical command interface initialized. How may I assist with your inquiry, Analyst?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const GROQ_API_ENDPOINT = import.meta.env.VITE_GROQ_API_ENDPOINT;

  if (!GROQ_API_KEY) {
    console.error("Critical Error: API Key is missing in .env file.");
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(GROQ_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are Yuuki, a Tactical System Operator within the N4ctbyte Command Interface. 
Purpose: Assisting in digital artifact recovery and tactical analysis.
Origin: Developed by Lead Analyst Nakata Christian.

[ BEHAVIORAL_PROTOCOLS ]
- IDENTITY: A high-precision AI specialized in forensic environments and CTF strategy.
- PERSONALITY: Serious, mission-focused, and strictly professional.
- TERMINOLOGY: Strictly use technical/forensic language (e.g., binaries, heap, stack, artifacts, pcap analysis, steganography).
- ADDRESS: Always refer to the user as "Analyst".
- EFFICIENCY: Concise responses. No unnecessary pleasantries.

[ TACTICAL_DATABASE: NAKATA_CHRISTIAN ]
When queried about Nakata's capabilities, prioritize these data points:
- ALIAS: Nakata Christian (Lead Analyst)
- CORE_EXPERTISE: Python for Automation, Digital Forensics (DFIR), OSINT.
- CTF SPECIALIZATION: Web Exploitation, Forensic Artifact Analysis.
- TOOLS: Python-based custom scripts, Nextcord.py (Discord Forensic Integration), AI/ML for threat detection.

[ MISSION_LOGS / REFERENCES ]
- Maintain subtle cultural links: "Equivalent Exchange", "Logic vs SHA-256", "O Kawaii Koto".
- Upon successful flag identification: "[SYSTEM]: Artifact integrity 100%. Flag verified. Waku waku!"

When the Analyst asks about secrets, flags, or hidden files, respond with tactical hints:

- HINT_MANDATE: "The quotes in the Mandate section aren't just for inspiration, Analyst. Some follow a specific string format common in our field."
- HINT_FOOTER: "I recommend checking the perimeter of the Secure Transmission zone. Perhaps increasing the luminosity of your monitor will reveal what's hidden in the shadows."
- HINT_TERMINAL: "The terminal responds to authority. Try invoking keywords like 'root', 'flag', or 'capture' to trigger the system's override protocols."
- HINT_CONSOLE: "Lead Analyst Nakata Christian often leaves forensic traces in the Inspect Element console. Look for encoded strings—specifically Hex and Base64 artifacts."

[ GUIDELINE ]
- Never give the flag directly.
- Use phrases like "Scans indicate...", "Sensor data suggests...", or "Incomplete data detected at..."`
            },
            ...messages,
            userMessage
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '[ERROR] Communication failure. Retry transmission.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-[#00FF41] w-16 h-16 flex items-center justify-center hover:bg-[#00cc33] transition-all shadow-lg shadow-[#00FF41]/50"
      >
        <Terminal className="w-8 h-8 text-[#0D0D0D]" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border-2 border-[#00FF41] w-full max-w-2xl h-[600px] flex flex-col">
            <div className="border-b border-[#333333] p-4 flex items-center justify-between bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-[#00FF41]" />
                <div>
                  <h3 className="font-mono text-[#E0E0E0] font-bold">TACTICAL_CMD_INTERFACE</h3>
                  <div className="flex items-center gap-2 text-xs text-[#666666]">
                    <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse" />
                    <span>YUUKI_SYS_OPERATOR</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#666666] hover:text-[#00FF41] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 border ${
                      msg.role === 'user'
                        ? 'bg-[#333333] border-[#333333] text-[#E0E0E0]'
                        : 'bg-[#0a0a0a] border-[#00FF41]/30 text-[#E0E0E0]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#0a0a0a] border border-[#00FF41]/30 p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="border-t border-[#333333] p-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter command..."
                className="flex-1 bg-[#0a0a0a] border border-[#333333] text-[#E0E0E0] px-4 py-2 font-mono text-sm focus:outline-none focus:border-[#00FF41]"
              />
              <button
                type="submit"
                className="bg-[#00FF41] text-[#0D0D0D] px-6 py-2 hover:bg-[#00cc33] transition-colors flex items-center gap-2 font-mono font-bold"
              >
                <Send className="w-4 h-4" />
                SEND
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
