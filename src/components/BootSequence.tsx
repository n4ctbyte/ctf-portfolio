import { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [lines, setLines] = useState<string[]>([]);
  const hasBooted = useRef(false);

  const bootMessages = [
    '[SYSTEM] Initializing secure connection...',
    '[AUTH] Verifying analyst credentials...',
    '[DATABASE] Loading forensic archive...',
    '[CRYPTO] Decrypting classified files...',
    '[NETWORK] Establishing encrypted tunnel...',
    '[STATUS] All systems operational',
    '[ACCESS] Welcome, Analyst'
  ];

  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;

    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setLines(prev => [...prev, msg]);
        
        if (index === bootMessages.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, index * 400);
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-[9999]">
      <div className="max-w-2xl w-full px-8">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Terminal className="w-8 h-8 text-[#00FF41]" />
          <h1 className="text-2xl font-mono text-[#00FF41] tracking-tighter">SYSTEM BOOT</h1>
        </div>
        <div className="font-mono text-sm space-y-2">
          {lines.map((line, index) => (
            <div
              key={index}
              className="text-[#E0E0E0] opacity-0 animate-[fadeIn_0.3s_ease-in_forwards] text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(5px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}