import { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const strings = ['NAKATA CHRISTIAN', 'CTF_FORENSICS', 'WEEB'];
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = strings[stringIndex];

      if (typedRef.current) {
        if (!isDeleting) {
          typedRef.current.textContent = current.substring(0, charIndex + 1);
          charIndex++;

          if (charIndex === current.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
            setTimeout(type, 2000);
            return;
          }
        } else {
          typedRef.current.textContent = current.substring(0, charIndex - 1);
          charIndex--;

          if (charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % strings.length;
          }
        }
      }

      setTimeout(type, isDeleting ? 50 : 100);
    };

    type();
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
      <div className="container mx-auto px-6">
        <div className="border-l-2 border-[#333333] pl-6 py-4">
          <div className="mb-4 font-mono text-sm text-[#666666] flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00FF41] animate-pulse" />
            <span>// SYSTEM_STATUS: AUTHORIZED_ACCESS</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-mono font-bold mb-4 text-[#E0E0E0]">
            ID: <span ref={typedRef} className="text-[#E0E0E0] inline-block min-w-[300px]"></span>
            <span className="animate-pulse">_</span>
          </h1>

          <div className="mb-8 space-y-2 font-mono text-[#999999]">
            <p className="text-lg">
              <span className="text-[#666666]">ROLE:</span> Digital Forensic Analyst & CTF Enthusiast
            </p>
            <p className="text-lg">
              <span className="text-[#666666]">STATUS:</span> <span className="text-[#00FF41]">ACTIVE</span> // Extracting meaningful data from chaotic noise
            </p>
          </div>

          <a
            href="#evidence"
            className="inline-flex items-center gap-2 border border-[#333333] text-[#E0E0E0] px-6 py-3 hover:bg-[#333333] hover:text-[#00FF41] transition-all duration-300 font-mono group"
          >
            <span>VIEW_EVIDENCE.log</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
