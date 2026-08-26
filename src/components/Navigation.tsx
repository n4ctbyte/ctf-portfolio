import { useState } from "react";
import { Terminal, Menu, X } from "lucide-react";

interface NavigationProps {
  currentTab: "home" | "writeups" | "blog";
  onNavigate: (tab: "home" | "writeups" | "blog", sectionId?: string) => void;
}

export default function Navigation({
  currentTab,
  onNavigate,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Profile", tab: "home" as const, sectionId: "profile" },
    { label: "Achievements", tab: "home" as const, sectionId: "achievements" },
    { label: "Mandate", tab: "home" as const, sectionId: "mandate" },
    { label: "Writeups", tab: "writeups" as const },
    { label: "Blog", tab: "blog" as const },
    { label: "Contact", tab: "home" as const, sectionId: "contact" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#333333] z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group transition-all duration-300"
          >
            <Terminal className="w-6 h-6 text-[#00FF41] group-hover:scale-110 transition-transform" />
            <span className="font-mono font-bold text-[#E0E0E0] text-lg tracking-tighter group-hover:text-[#00FF41]">
              NAKATA_CHR
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.tab, item.sectionId)}
                className={`font-mono text-sm transition-colors relative group ${
                  currentTab === item.tab && !item.sectionId
                    ? "text-[#00FF41] font-bold"
                    : "text-[#666666] hover:text-[#00FF41]"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#00FF41] transition-all duration-300 ${
                    currentTab === item.tab && !item.sectionId
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
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
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.tab, item.sectionId);
                  setIsOpen(false);
                }}
                className={`block w-full text-left font-mono text-sm transition-colors ${
                  currentTab === item.tab && !item.sectionId
                    ? "text-[#00FF41] font-bold"
                    : "text-[#666666] hover:text-[#00FF41]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}