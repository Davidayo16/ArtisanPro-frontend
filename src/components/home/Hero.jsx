import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText = "Artisans";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0f0f0f] overflow-hidden">
      {/* Sophisticated Background - Behind everything with z-index */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Base grid - white */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        ></div>

        {/* Blue colored grid section - top right area */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            transform: `translateY(${scrollY * 0.2}px)`,
            clipPath: "circle(40% at 75% 25%)",
          }}
        ></div>

        {/* Green colored grid section - bottom left area */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `linear-gradient(rgba(16,185,129,0.12) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(16,185,129,0.12) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            transform: `translateY(${scrollY * 0.2}px)`,
            clipPath: "circle(35% at 25% 75%)",
          }}
        ></div>

        {/* Accent glow - lighter */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 sm:space-y-10 animate-fade-in">
            {/* Headline */}
            <div className="space-y-4 sm:space-y-6">
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight opacity-0 animate-slide-up"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: "forwards",
                }}
              >
                Find Skilled
                <br />
                <span className="relative inline-block mt-2 sm:mt-3">
                  <span className="text-white">
                    {typedText}
                    <span className="inline-block w-0.5 h-[0.9em] bg-blue-500 ml-1 animate-blink"></span>
                  </span>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] sm:h-[3px] rounded-full"
                    style={{
                      background: "linear-gradient(to right, #3b82f6, #10b981)",
                    }}
                  ></div>
                </span>
                <br />
                <span className="text-gray-500">Near You</span>
              </h1>

              <p
                className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-md font-light opacity-0 animate-slide-up"
                style={{
                  animationDelay: "0.3s",
                  animationFillMode: "forwards",
                }}
              >
                Connect with verified professionals for plumbing, carpentry,
                electrical work, and more. Quality craftsmanship, delivered.
              </p>
            </div>

            {/* CTA */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <button
                onClick={() => navigate("/artisans")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative inline-flex items-center justify-center gap-2 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-gray-300 w-full sm:w-auto"
                style={{
                  boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                  Find Artisans
                  <ArrowRight
                    size={20}
                    className={`transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                  />
                </span>
              </button>

              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 hover:border-white/30 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base">
                How It Works
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div
            className="relative lg:ml-auto w-full max-w-xl mx-auto lg:max-w-none opacity-0 animate-slide-up"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <div className="relative group">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

              {/* Main image container */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                  alt="Professional carpenter working on woodcraft"
                  className="w-full h-auto object-cover mix-blend-luminosity opacity-80 group-hover:opacity-90 group-hover:mix-blend-normal transition-all duration-700"
                  loading="lazy"
                />
              </div>

              {/* Minimal accent line */}
              <div
                className="absolute -bottom-3 sm:-bottom-4 left-6 sm:left-8 right-6 sm:right-8 h-[2px] rounded-full opacity-60"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #3b82f6, #10b981, transparent)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-transparent to-black/40 pointer-events-none"></div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }

        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </section>
  );
}
