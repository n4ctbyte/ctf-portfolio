import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyPSmGpZENko12My3z_s4kmmXw0CQ5H4yMt02PEDpHtVyYSfBMp0bcV3PBIeAdPCNXI/exec';
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('message', formData.message);

      await fetch(scriptURL, { method: 'POST', body: formDataObj });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-[#333333]">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <Send className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold text-[#E0E0E0]">
            [ CONTACT ]
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="font-mono text-sm text-[#666666] mb-6">
            SECURE_CHANNEL // Encrypted communication protocol
          </div>

          {status === 'success' && (
            <div className="mb-6 border border-[#00FF41] bg-[#00FF41]/10 p-4 font-mono text-sm text-[#00FF41]">
              [SUCCESS] Message transmitted successfully
            </div>
          )}

          <form onSubmit={handleSubmit} className="border border-[#333333] p-6 space-y-4">
            <div>
              <label className="block font-mono text-sm text-[#666666] mb-2">
                NAME_FIELD
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-[#0a0a0a] border border-[#333333] text-[#E0E0E0] px-4 py-3 font-mono focus:outline-none focus:border-[#00FF41] transition-colors"
                placeholder="Enter identifier..."
              />
            </div>

            <div>
              <label className="block font-mono text-sm text-[#666666] mb-2">
                EMAIL_ADDRESS
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-[#0a0a0a] border border-[#333333] text-[#E0E0E0] px-4 py-3 font-mono focus:outline-none focus:border-[#00FF41] transition-colors"
                placeholder="contact@domain.ext"
              />
            </div>

            <div>
              <label className="block font-mono text-sm text-[#666666] mb-2">
                MESSAGE_PAYLOAD
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full bg-[#0a0a0a] border border-[#333333] text-[#E0E0E0] px-4 py-3 font-mono focus:outline-none focus:border-[#00FF41] transition-colors resize-none"
                placeholder="Enter encrypted message..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full border border-[#333333] text-[#E0E0E0] px-6 py-3 hover:bg-[#00FF41] hover:text-[#0D0D0D] hover:border-[#00FF41] transition-all font-mono flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'sending' ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#E0E0E0] border-t-transparent rounded-full animate-spin" />
                  TRANSMITTING...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  SEND_MESSAGE
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
