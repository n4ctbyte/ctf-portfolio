import { useState } from 'react';
import { Terminal, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'SUBJECT_PROFILE', href: '#profile' },
    { label: 'MANDATE', href: '#mandate' },
    { label: 'EVIDENCE_LOGS', href: '#evidence' },
    { label: 'CONTACT', href: '#contact' }
  ];

  return (
    <nav className="fixed top-0 w-full bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#333333] z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a 
            href="#" 
            className="flex items-center gap-2 group transition-all duration-300"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Terminal className="w-6 h-6 text-[#00FF41] group-hover:scale-110 transition-transform" />
            <span className="font-mono font-bold text-[#E0E0E0] text-lg tracking-tighter group-hover:text-[#00FF41]">
              NAKATA_CHR
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-mono text-sm text-[#666666] hover:text-[#00FF41] transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00FF41] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#00FF41]"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-[#333333] pt-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block font-mono text-sm text-[#666666] hover:text-[#00FF41] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}