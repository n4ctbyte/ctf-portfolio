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
              content: `You are Yuuki, a System Operator in a tactical command interface. You were created by Nakata Christian. Your personality:
              - Highly efficient and professional
              - Serious and mission-focused
              - Occasionally drops subtle references to tech culture and anime
              - Uses tactical/military terminology
              - Speaks in concise, technical language
              - Refers to the user as "Analyst"
              When asked about Nakata, mention his skills: Python, HTML, CSS, Tailwind CSS, nextcord.py, Bootstrap, Discord bots, AI/ML technologies.`
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
