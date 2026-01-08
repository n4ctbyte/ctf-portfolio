import { useState, useEffect, useCallback } from 'react';
import { Shield } from 'lucide-react';

const DecryptText = ({ targetText, initialText }: { targetText: string, initialText: string }) => {
  const [text, setText] = useState(initialText);
  const [isHovering, setIsHovering] = useState(false);
  const chars = '!@#$%^&*()_+[]{};:"|,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText(prev => 
        targetText
          .split("")
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
    return interval;
  }, [targetText]);

  return (
    <span 
      onMouseEnter={() => {
        setIsHovering(true);
        scramble();
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        setText(initialText);
      }}
      className="cursor-crosshair transition-colors duration-300 hover:text-[#00FF41]"
    >
      {text}
    </span>
  );
};

export default function SubjectProfile() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section id="profile" className="min-h-screen pt-32 px-6 flex flex-col items-center border-t border-[#333333]">
      <div className="w-full max-w-6xl flex flex-col items-start">
        <div className="flex items-center gap-3 mb-10 justify-start w-full">
          <Shield className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold text-[#E0E0E0]">
            [ SUBJECT PROFILE ]
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full">
          <div className="border-2 border-[#333333] p-6 hover:border-[#00FF41] transition-colors bg-[#0D0D0D]/50">
            <div className="font-mono space-y-3">
              <div className="flex justify-between border-b border-[#333333] pb-2">
                <span className="text-[#666666]">NAME:</span>
                <span className="text-[#E0E0E0] font-bold">
                  <DecryptText initialText="N4CTBYTE" targetText="NAKATA CHRISTIAN" />
                </span>
              </div>
              <div className="flex justify-between border-b border-[#333333] pb-2">
                <span className="text-[#666666]">ID:</span>
                <span className="text-[#00FF41]">0x4E414B415441</span>
              </div>
              <div className="flex justify-between border-b border-[#333333] pb-2">
                <span className="text-[#666666]">ROLE:</span>
                <span className="text-[#E0E0E0]">CTF PLAYER</span>
              </div>
              <div className="flex justify-between border-b border-[#333333] pb-2">
                <span className="text-[#666666]">STATUS:</span>
                <span className="text-[#00FF41]">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-[#333333] pb-2">
                <span className="text-[#666666]">CLEARANCE:</span>
                <span className="text-red-400">LEVEL 4 [0100]</span>
              </div>
              <div className="flex justify-between border-b border-[#333333] pb-2">
                <span className="text-[#666666]">WAIFU:</span>
                <span className="text-[#E0E0E0]">FURUHASHI FUMINO</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-[#333333] p-6 hover:border-[#00FF41] transition-colors bg-[#0D0D0D]/50">
            <h3 className="font-mono text-[#00FF41] mb-4 flex items-center gap-2">
              <span className="text-red-400">[CLASSIFIED]</span> BACKGROUND
            </h3>
            <div className={`font-mono text-sm text-[#E0E0E0] space-y-2 transition-all duration-300 ${
              !isRevealed ? 'blur-sm select-none' : ''
            }`}>
              <p>Subject is a meticulous forensic investigator specializing in deep-artifact recovery, OSINT, and Web Exploitation.</p>
              <p>Expertly navigates various forensic suites for disk imaging, memory analysis, and artifact extraction, while developing custom Python automation to streamline the investigative process.</p>
              <p>Driven by the complexity of digital puzzles, maintaining rigorous training via PicoCTF and TCP1P to master the DFIR pipeline and incident response protocols.</p>
            </div>
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="mt-4 px-4 py-2 bg-[#00FF41] text-[#0D0D0D] font-mono text-sm hover:bg-[#00cc33] transition-colors font-bold"
            >
              {isRevealed ? '[ CLASSIFY ]' : '[ DECLASSIFY ]'}
            </button>
          </div>
        </div>

        <div className="mt-6 w-full border-2 border-[#333333] p-6 hover:border-[#00FF41] transition-colors bg-[#0D0D0D]/50">
          <h3 className="font-mono text-[#00FF41] mb-4 tracking-widest uppercase">[ OPERATIONAL_OBJECTIVE ]</h3>
          <p className="font-mono text-sm text-[#E0E0E0] leading-relaxed">
            Dedicated to mastering Digital Forensics and Incident Response (DFIR) through automated analysis and deep-dive artifact recovery. Committed to solving complex cybersecurity puzzles and contributing to the security landscape by bridging the gap between forensic research and automated tool development.
          </p>
        </div>
      </div>
    </section>
  );
}