import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Minus } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const fullText = "Artisans";

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden">
      {/* Background Layer - Ultra minimal grid */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main Container - Adjusted Padding for Desktop Balance */}
      <div className="flex-1 flex flex-col justify-start lg:justify-center relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-20 md:pt-16 lg:pt-24">
        <div className="grid lg:grid-cols-12 gap-y-16 lg:gap-x-12 items-center">
          {/* LEFT: Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10 md:space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 animate-fade-in">
                <Minus className="text-[#1c3866]" strokeWidth={3} />
                <span className="text-[#1c3866] font-bold text-[10px] md:text-xs uppercase tracking-[0.4em]">
                  The New Standard of Service
                </span>
              </div>

              <h1 className="text-[13vw] sm:text-[10vw] lg:text-[7.5vw] font-bold leading-[0.85] tracking-tighter uppercase">
                Find <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 italic">
                  {typedText}
                </span>
                <span className="inline-block w-[0.05em] h-[0.9em] bg-[#1c3866] ml-2 align-middle" />
                <br />
                Near You
              </h1>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
              <p className="max-w-[340px] text-gray-500 text-sm md:text-base font-light leading-relaxed border-l border-white/10 pl-6">
                Connect with a curated network of vetted professionals. Premium
                home maintenance, simplified for the modern world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/artisans")}
                  className="group relative flex items-center justify-center gap-4 bg-white text-black px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-[#1c3866] hover:text-white transition-all duration-500 shadow-2xl shadow-white/5"
                >
                  Get Started
                  <ArrowUpRight
                    size={16}
                    className="group-hover:rotate-45 transition-transform duration-300"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual */}
          <div className="lg:col-span-5 xl:col-span-4 relative group w-full">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-[#0a0a0a] border border-white/5 transition-all duration-700 group-hover:border-[#1c3866]/50">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
                alt="Expertise"
                className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />

              {/* Overlay Label */}
              {/* <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold tracking-tighter text-white">
                      01
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">
                      Vetted Experts
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold tracking-tighter text-white">
                      100%
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">
                      Guarantee
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker Bar */}
      <div className="w-full border-t border-white/5 py-10 px-6 md:px-12 bg-black/50 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex gap-10 items-center text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 overflow-x-auto whitespace-nowrap no-scrollbar w-full md:w-auto">
            <span className="text-white">Lagos</span>
            <span>Abuja</span>
            <span>Port Harcourt</span>
            <span>Ibadan</span>
          </div>
          <div className="hidden lg:block h-px flex-1 mx-16 bg-white/5"></div>
          <div className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-medium italic">
            Available 24/7 — Support: +234 800 ARTISAN
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
