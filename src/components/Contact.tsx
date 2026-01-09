import { useState } from 'react';
import { Send, Loader2, Github, Linkedin, Instagram } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const socialLinks = [
    { icon: Github, href: 'https://github.com/n4ctbyte', label: 'GitHub' },
    { icon: Instagram, href: 'https://instagram.com/nakata_chr', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/nakata-christian-31ba31335/', label: 'LinkedIn' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Konversi data ke format URLSearchParams agar terbaca oleh e.parameter di GAS
    const params = new URLSearchParams();
    params.append('name', formData.name);
    params.append('email', formData.email);
    params.append('message', formData.message);

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbw_AlMDrt0RRDa9Sc6ep1gL8MV7C1mUeN0401nKE1d7K6h0J4vyLGm_ElPXk5T03ntr/exec',
        {
          method: 'POST',
          mode: 'no-cors', // Diperlukan untuk Google Apps Script
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      );

      // Karena no-cors, kita asumsikan sukses jika fetch tidak throw error
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Transmission Error:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen pt-28 pb-8 px-6 flex flex-col items-center justify-between border-t border-[#333333] bg-[#0D0D0D] scroll-mt-10">
      
      {/* EASTER EGG FLAG */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-[#1A1A1A] opacity-40 hover:text-[#00FF41] hover:opacity-100 transition-all duration-500 cursor-default select-none z-0">
        N4CT{'{'}L1GHT5_UP{'}'}
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <Send className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold text-[#E0E0E0]">
            [ SECURE TRANSMISSION ]
          </h2>
        </div>

        {status === 'success' && (
          <div className="mb-6 p-4 border-2 border-[#00FF41] bg-[#00FF41]/10">
            <p className="font-mono text-[#00FF41] text-center">
              [SUCCESS] Message transmitted successfully to N4ctbyte's Archive.
            </p>
          </div>
        )}

        <div className="bg-black/20 p-6 border-2 border-[#333333] hover:border-[#00FF41]/50 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[#666666] mb-1 text-xs uppercase">NAME_FIELD</label>
              <input
                type="text" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0D0D0D] border-2 border-[#333333] p-2 font-mono text-[#E0E0E0] focus:border-[#00FF41] focus:outline-none text-sm"
                placeholder="Enter designation..."
              />
            </div>
            <div>
              <label className="block font-mono text-[#666666] mb-1 text-xs uppercase">EMAIL_ADDRESS</label>
              <input
                type="email" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0D0D0D] border-2 border-[#333333] p-2 font-mono text-[#E0E0E0] focus:border-[#00FF41] focus:outline-none text-sm"
                placeholder="Enter contact protocol..."
              />
            </div>
            <div>
              <label className="block font-mono text-[#666666] mb-1 text-xs uppercase">MESSAGE_PAYLOAD</label>
              <textarea
                required value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full bg-[#0D0D0D] border-2 border-[#333333] p-2 font-mono text-[#E0E0E0] focus:border-[#00FF41] focus:outline-none resize-none text-sm"
                placeholder="Enter encrypted message..."
              />
            </div>
            <button
              type="submit" disabled={status === 'sending'}
              className="w-full bg-[#00FF41] text-[#0D0D0D] py-3 font-mono font-bold hover:bg-[#00cc33] transition-all flex items-center justify-center gap-2"
            >
              {status === 'sending' ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
              {status === 'sending' ? 'TRANSMITTING...' : 'SEND_TRANSMISSION'}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-4 mt-auto pt-8 pb-4">
        <div className="flex gap-6">
          {socialLinks.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="text-[#666666] hover:text-[#00FF41] transition-colors">
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <div className="font-mono text-[10px] text-[#666666] text-center tracking-widest leading-relaxed">
          <div className="mb-1 uppercase">© 2025 NAKATA_CHRISTIAN // FORENSIC_ARCHIVE</div>
          <div className="text-[#00FF41]/60 font-bold">
            0x4E616B617461 • CLASSIFIED_LEVEL_4 • 2026
          </div>
        </div>
      </div>
    </section>
  );
}
