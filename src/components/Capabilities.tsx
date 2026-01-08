import { Code2 } from 'lucide-react';

const skills = [
  { name: 'Python', proficiency: 'ADVANCED' },
  { name: 'HTML', proficiency: 'EXPERT' },
  { name: 'CSS', proficiency: 'EXPERT' },
  { name: 'Tailwind CSS', proficiency: 'ADVANCED' },
  { name: 'nextcord.py', proficiency: 'ADVANCED' },
  { name: 'Bootstrap', proficiency: 'INTERMEDIATE' },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="min-h-screen flex flex-col items-center justify-center py-20 bg-[#0a0a0a] border-t border-[#333333]">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <Code2 className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold text-[#E0E0E0]">
            [ CAPABILITIES ]
          </h2>
        </div>

        <div className="max-w-4xl">
          <div className="font-mono text-sm text-[#666666] mb-6">
            SKILL_MATRIX // Technical proficiency assessment
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="group border border-[#333333] p-4 hover:border-[#00FF41] transition-all relative overflow-hidden"
                data-capability={skill.name}
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00FF41] transform scale-x-0 transition-transform group-hover:scale-x-100" />

                <div className="font-mono">
                  <div className="text-[#E0E0E0] mb-2 font-bold">{skill.name}</div>
                  <div className="text-xs text-[#666666]">
                    LEVEL: <span className="text-[#00FF41]">{skill.proficiency}</span>
                  </div>
                  <div className="text-xs text-[#444444] mt-1">
                    ID: 0x{(index + 1).toString(16).padStart(4, '0')}
                  </div>
                </div>

                <div className="absolute inset-0 bg-[#00FF41] opacity-0 group-hover:opacity-5 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
