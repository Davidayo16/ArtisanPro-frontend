import React, { useState, useEffect, useRef } from "react";
import {
  Wrench,
  Hammer,
  Zap,
  Paintbrush,
  Flame,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  const services = [
    {
      name: "Plumbing",
      icon: Wrench,
      description: "Professional pipe repairs & water system installation",
      bg: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800",
      color: "text-blue-500",
      detail: "24/7 Emergency",
    },
    {
      name: "Carpentry",
      icon: Hammer,
      description: "Custom furniture & premium woodwork solutions",
      bg: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
      color: "text-amber-500",
      detail: "Expert Finish",
    },
    {
      name: "Welding",
      icon: Flame,
      description: "Expert metal fabrication & structural welding",
      bg: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
      color: "text-orange-500",
      detail: "Industrial Grade",
    },
    {
      name: "Electrical",
      icon: Zap,
      description: "Safe wiring & modern electrical installations",
      bg: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
      color: "text-yellow-500",
      detail: "Safety Certified",
    },
    {
      name: "Painting",
      icon: Paintbrush,
      description: "Interior & exterior painting with premium finishes",
      bg: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
      color: "text-rose-500",
      detail: "Premium Paint",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, offsetWidth } = scrollContainerRef.current;
      const index = Math.round(scrollLeft / (offsetWidth * 0.85));
      setActiveMobileIdx(index);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[#0a0a0a] text-white overflow-hidden relative border-t border-white/5"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-blue-500 mb-4">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">
                Verified Expertise
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight">
              Craftsmanship <br />
              <span className="text-gray-500 italic">without compromise.</span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-xs font-light border-l border-white/10 pl-6 hidden lg:block">
            Every artisan is vetted for quality, reliability, and precision.
          </p>
        </div>

        {/* Services Display */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        >
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group relative min-w-[85vw] md:min-w-0 h-[480px] md:h-[400px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden snap-center transition-all duration-500 hover:border-white/20"
            >
              {/* Background Image Layer */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${service.bg}')` }}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="relative h-full p-8 flex flex-col justify-between z-10">
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 border border-white/10 transition-all duration-500 group-hover:scale-110 bg-black/20 backdrop-blur-sm ${service.color}`}
                  >
                    <service.icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-light tracking-tight mb-3">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {service.detail}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all group-hover:bg-white group-hover:text-black">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile dots - keeps it from looking scanty */}
        <div className="flex md:hidden justify-center gap-2 mt-8">
          {services.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${activeMobileIdx === i ? "w-8 bg-blue-500" : "w-2 bg-white/10"}`}
            />
          ))}
        </div>

        {/* Minimalist Button (Your Preferred Style) */}
        <div className="mt-16 flex justify-center">
          <button className="px-10 py-4 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 group">
            <span className="text-sm font-medium tracking-widest flex items-center gap-3">
              VIEW ALL EXPERTISE
              <ArrowRight
                size={16}
                className="text-blue-500 group-hover:translate-x-1 transition-transform"
              />
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

