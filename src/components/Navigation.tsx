import { useState } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: '[ SUBJECT_PROFILE ]', href: '#profile' },
    { label: '[ CAPABILITIES ]', href: '#capabilities' },
    { label: '[ EVIDENCE_LOGS ]', href: '#evidence' },
    { label: '[ CONTACT ]', href: '#contact' },
  ];

  return (
    <nav className="fixed w-full z-40 bg-[#0D0D0D] border-b border-[#333333]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center gap-2 text-[#E0E0E0] font-mono hover:text-[#00FF41] transition-colors">
            <Terminal className="w-5 h-5" />
            <span className="text-lg">NAKATA_CHR</span>
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#E0E0E0] hover:text-[#00FF41] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[#E0E0E0] hover:text-[#00FF41] transition-colors font-mono text-sm relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00FF41] transition-all group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-[#333333] pt-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-[#E0E0E0] hover:text-[#00FF41] transition-colors font-mono text-sm"
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
