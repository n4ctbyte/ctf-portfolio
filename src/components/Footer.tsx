import { Github, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: 'https://github.com/n4ctbyte', label: 'GitHub' },
    { icon: Instagram, href: 'https://instagram.com/nakata_chr', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/nakata-christian-31ba31335/', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative border-t border-[#333333] py-8">
      <div className="hidden-flag">N4CT{'{'}L1GHT5_UP{'}'}</div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666666] hover:text-[#00FF41] transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>

          <div className="font-mono text-sm text-[#666666] text-center">
            <div className="mb-1">© 2025 NAKATA_CHRISTIAN // FORENSIC_ARCHIVE</div>
            <div className="text-xs">
              0x4E616B617461 • CLASSIFIED_LEVEL_3 • {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
