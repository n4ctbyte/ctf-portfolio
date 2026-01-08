import { useState } from 'react';
import { User } from 'lucide-react';

export default function SubjectProfile() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section id="profile" className="py-20 border-t border-[#333333]">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold text-[#E0E0E0]">
            [ SUBJECT_PROFILE ]
          </h2>
        </div>

        <div className="max-w-3xl border border-[#333333] p-6">
          <div className="font-mono text-sm text-[#666666] mb-4">
            <div className="flex gap-4 mb-2">
              <span>FILE_ID: NC_2025_PROFILE</span>
              <span>DATE: 2025-01-08</span>
              <span>CLEARANCE: <span className="text-[#00FF41]">AUTHORIZED</span></span>
            </div>
          </div>

          <div className="space-y-4 text-[#E0E0E0]">
            <p>
              Subject NAKATA CHRISTIAN is an AI and ML enthusiast with expertise in intelligent systems and machine learning frameworks. Specializes in forensic analysis and competitive CTF challenges.
            </p>

            <div className="relative">
              <p className={isRevealed ? '' : 'filter blur-sm select-none'}>
                Beyond technical capabilities, subject demonstrates proficiency in Discord bot development, creating autonomous systems with unique behavioral patterns. Known for innovative approaches to automation and creative problem-solving.
              </p>
              {!isRevealed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsRevealed(true)}
                    className="bg-[#0D0D0D] border border-[#00FF41] text-[#00FF41] px-4 py-2 font-mono text-sm hover:bg-[#00FF41] hover:text-[#0D0D0D] transition-colors"
                  >
                    [ DECLASSIFY ]
                  </button>
                </div>
              )}
            </div>

            <p>
              Subject believes optimal results occur at the intersection of creativity and technology. Current focus: Pushing boundaries of what technology can achieve.
            </p>

            <div className="mt-6 pt-4 border-t border-[#333333] font-mono text-sm text-[#666666]">
              <span className="text-[#00FF41]">NOTE:</span> Subject available for collaborative projects and technical consultation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
