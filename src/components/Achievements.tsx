import { Trophy, Calendar, Users, Building, Award } from "lucide-react";
import achievementsData from "./achievements.json";

interface Achievement {
  event: string;
  team: string;
  place: string;
  date: string;
  issuedBy: string;
}

export default function Achievements() {
  const achievements: Achievement[] = achievementsData;

  return (
    <section
      id="achievements"
      className="min-h-screen pt-32 px-6 flex flex-col items-center border-t border-[#333333] bg-[#0D0D0D]"
    >
      <div className="w-full max-w-6xl flex flex-col items-start">
        <div className="flex items-center gap-3 mb-10 justify-start w-full">
          <Trophy className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold text-[#E0E0E0]">
            [ ACHIEVEMENTS ]
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="bg-[#121212] border-2 border-[#222222] hover:border-[#00FF41]/50 rounded-xl p-6 font-mono flex flex-col justify-between transition-all duration-300 group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#222222]">
                  <span className="text-xs bg-[#00FF41]/10 text-[#00FF41] px-2.5 py-1 rounded border border-[#00FF41]/20 font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#00FF41]" />
                    {item.place}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#00FF41]" />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#E0E0E0] group-hover:text-[#00FF41] transition-colors mb-4 leading-snug">
                  {item.event}
                </h3>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-[#1F1F1F] text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" /> TEAM
                  </span>
                  <span className="text-[#E0E0E0] font-medium">{item.team}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-gray-400" /> ISSUED BY
                  </span>
                  <span className="text-gray-300 font-medium text-right truncate max-w-[180px]">
                    {item.issuedBy}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}