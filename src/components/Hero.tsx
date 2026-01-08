import { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const titles = ['N4CTBYTE', 'CTF_FORENSICS', 'WEEB', 'NAKATA CHRISTIAN'];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % titles.length;
      const fullText = titles[i];

      setDisplayText(
        isDeleting
          ? fullText.substring(0, displayText.length - 1)
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum]);

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl w-full">
        <div className="border-l-4 border-[#00FF41] pl-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-8 h-8 text-[#00FF41]" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-[#E0E0E0]">
              {displayText}
              <span className="animate-pulse">|</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl font-mono text-[#666666]">
            Digital Forensic Analyst & CTF Enthusiast
          </p>
        </div>

        <div className="bg-[#0D0D0D] border-2 border-[#333333] p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-[#00FF41] rounded-full animate-pulse" />
            <span className="font-mono text-[#00FF41] text-sm">SYSTEM STATUS</span>
          </div>
          <p className="font-mono text-[#E0E0E0] text-sm">
            &gt; AUTHORIZED_ACCESS // Clearance Level: 5
          </p>
        </div>

        <a
          href="#evidence"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF41] text-[#0D0D0D] font-mono font-bold hover:bg-[#00cc33] transition-colors"
        >
          VIEW_EVIDENCE.log
        </a>
      </div>
    </section>
  );
}
