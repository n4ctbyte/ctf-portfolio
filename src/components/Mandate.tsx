import { useState, useEffect } from 'react';
import { Quote, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Capabilities() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const quotes = [
    {
      text: "No matter how complex the encryption is, the flag can be recovered by logic (except SHA-256 tho).",
      author: "L (Lawliet)",
      anime: "Death Note",
      ref: "REF_ID: 0xLOGIC_DECODE"
    },
    {
      text: "There is always only one truth!",
      author: "Conan Edogawa",
      anime: "Detective Conan",
      ref: "REF_ID: 0xTRUTH_ONE"
    },
    {
      text: "All systems are nothing but tools. It doesn't matter how it's done. It doesn't matter what needs to be sacrificed. In this world, getting the flag is everything.",
      author: "Kiyotaka Ayanokouji",
      anime: "C.O.T.E",
      ref: "REF_ID: 0xSYSTEM_CONTROL"
    },
    {
      text: "I'm just a guy who's a CTF player for fun.",
      author: "Saitama",
      anime: "One Punch Man",
      ref: "REF_ID: 0xPLAYER_FOR_FUN"
    },
    {
      text: "Analyst cannot gain any flag without first giving some sleep in return.",
      author: "Edward Elric",
      anime: "Fullmetal Alchemist",
      ref: "REF_ID: 0xEQUIVALENT_EXCHANGE"
    },
    {
      text: "Even if the binary logic says no, the stars in the data will always point to the truth.",
      author: "Furuhashi Fumino",
      anime: "Bokutachi wa Benkyou ga Dekinai",
      ref: "REF_ID: 0xLITERARY_FORENSICS"
    },
    {
      text: "Fun things are fun!!",
      author: "Yui Hirasawa",
      anime: "K-ON!",
      ref: "REF_ID: 0xGIHTA_EXPLOIT"
    },
    {
      text: "I want to solve this, but the exploit is failing, so I'm going to sleep.",
      author: "Yu Ishigami",
      anime: "Love is War",
      ref: "REF_ID: 0xDEPRESSION_BUFFER"
    },
    {
      text: "You think that your basic obfuscation could stop me? O kawaii koto...",
      author: "Kaguya Shinomiya",
      anime: "Love is War",
      ref: "REF_ID: 0xO_KAWAII_KOTO"
    },
    {
      text: "Anya likes flags. Anya hates false positives.",
      author: "Anya Forger",
      anime: "Spy x Family",
      ref: "REF_ID: 0xWAKU_WAKU_FLAG"
    },
    {
      text: "REMOTEEEEE CODEEEE EXECUTIOOOOONNNN!!!",
      author: "Megumin",
      anime: "Konosuba",
      ref: "REF_ID: 0xEXPLOSION_RCE"
    },
    {
      text: "100 pcaps, 100 strings, 100 binwalks, and 10 hours of Wireshark EVERY SINGLE DAY until I went bald!",
      author: "Saitama",
      anime: "One Punch Man",
      ref: "REF_ID: 0xBALD_ANALYST"
    },
    {
      text: "Is it a bug? Is it a feature? No, it's just my code crying for help.",
      author: "Aqua",
      anime: "Konosuba",
      ref: "REF_ID: 0xUSELESS_GODDESS"
    },
    {
      text: "Open source is freedom.",
      author: "Kaori Miyazono",
      anime: "Shigatsu wa Kimi no Uso",
      ref: "REF_ID: 0xMUSIC_IS_FREEDOM"
    },
    {
      text: "I hate easy flags. They're always honeypots designed to waste my time.",
      author: "Hachiman Hikigaya",
      anime: "Oregairu",
      ref: "REF_ID: 0xGENUINE_EXPLOIT"
    },
    {
      text: "Vanishment, this database!",
      author: "Rikka Takanashi",
      anime: "Chuunibyou",
      ref: "REF_ID: 0xREALITY_REJECTED"
    },
    {
      text: "n4ct{fum1n0_s0_pr33ty}",
      author: "n4ctbyte",
      anime: "Bokutachi wa Benkyou ga Dekinai",
      ref: "REF_ID: 0xW4IFU" 
    }
];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(randomIndex);
  }, []);

  const handleNext = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
      setIsVisible(true);
    }, 300);
  };

  const handlePrev = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
      setIsVisible(true);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 8000);
    return () => clearInterval(interval);
  }, [currentQuote]);

  return (
    <section 
      id="mandate" 
      className="min-h-screen pt-32 px-6 flex flex-col items-center border-t border-[#333333] bg-black relative z-10"
    >
      <div className="max-w-6xl w-full flex flex-col items-start">
        
        <div className="flex items-center gap-3 mb-16">
          <MessageSquare className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold text-[#E0E0E0]">
            [ ANALYST_MANDATE ]
          </h2>
        </div>

        <div className="w-full relative flex items-center justify-center min-h-[450px] group/container">
          <button 
            onClick={handlePrev}
            className="absolute left-0 md:-left-12 z-20 p-2 text-[#333333] hover:text-[#00FF41] transition-colors duration-300"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-10 h-10 md:w-12 md:h-12" />
          </button>

          <Quote className="absolute -top-10 -left-10 w-40 h-40 text-[#00FF41]/5 -z-10 rotate-180" />
          
          <div 
            className={`w-full max-w-4xl transition-all duration-300 ease-in-out transform ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
            }`}
          >
            <div className="bg-[#0D0D0D] border-2 border-[#333333] p-10 md:p-16 relative hover:border-[#00FF41] transition-colors duration-500 group">
              <div className="absolute top-4 right-6 font-mono text-[10px] text-[#333333] group-hover:text-[#00FF41]/40">
                {quotes[currentQuote].ref}
              </div>

              <div className="relative">
                <span className="text-4xl md:text-6xl font-serif text-[#00FF41] absolute -top-8 -left-8 md:-top-12 md:-left-12 opacity-50">"</span>
                <p className="font-mono text-xl md:text-3xl text-[#E0E0E0] italic leading-relaxed text-center">
                  {quotes[currentQuote].text}
                </p>
                <span className="text-4xl md:text-6xl font-serif text-[#00FF41] absolute -bottom-12 -right-4 opacity-50">"</span>
              </div>

              <div className="mt-12 flex flex-col items-center gap-2">
                <div className="h-[1px] w-24 bg-[#00FF41]/30 group-hover:w-48 transition-all duration-700"></div>
                <p className="font-mono text-[#00FF41] text-sm md:text-base tracking-[0.2em] uppercase">
                  {quotes[currentQuote].author}
                </p>
                <p className="font-mono text-[#666666] text-xs uppercase italic">
                  — {quotes[currentQuote].anime}
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleNext}
            className="absolute right-0 md:-left-12 z-20 p-2 text-[#333333] hover:text-[#00FF41] transition-colors duration-300"
            aria-label="Next quote"
          >
            <ChevronRight className="w-10 h-10 md:w-12 md:h-12" />
          </button>

          <Quote className="absolute -bottom-10 -right-10 w-40 h-40 text-[#00FF41]/5 -z-10" />
        </div>

        <div className="w-full flex justify-center gap-3 mt-6">
          {quotes.map((_, index) => (
            <button 
              key={index}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentQuote(index);
                  setIsVisible(true);
                }, 300);
              }}
              className={`h-1 transition-all duration-300 ${
                currentQuote === index ? 'w-12 bg-[#00FF41]' : 'w-3 bg-[#333333] hover:bg-[#666666]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}