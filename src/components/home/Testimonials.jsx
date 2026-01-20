import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      name: "Chioma Okafor",
      role: "Homeowner",
      text: "Excellent service! The plumber was professional and fixed my pipes quickly. Highly recommended for anyone in Lagos!",
      service: "Plumbing",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80",
    },
    {
      name: "Adebayo Olanrewaju",
      role: "Project Manager",
      text: "Amazing carpenter. He built my office cabinets exactly as I imagined. Great communication throughout the process.",
      service: "Carpentry",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=80",
    },
    {
      name: "Ngozi Eze",
      role: "Business Owner",
      text: "Quick, reliable, and trustworthy. The electrician solved my power issue in no time. I've already booked my next maintenance.",
      service: "Electrical",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&q=80",
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  return (
    <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <p className="text-[#1c3866] font-medium tracking-[0.2em] uppercase text-xs mb-4">
              Reviews
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Trusted by the <span className="text-gray-500">community.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-fit">
            <div className="text-2xl font-light">4.9</div>
            <div className="flex flex-col">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className="fill-blue-500 text-[#1c3866]"
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                from 2k+ users
              </p>
            </div>
          </div>
        </div>

        {/* Slim Interactive Area */}
        <div
          className="relative grid lg:grid-cols-12 gap-12 items-start"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8">
            <Quote className="text-[#1c3866] mb-6" size={40} strokeWidth={1} />

            <div className="relative min-h-[200px]">
              {/* Animated Text transition */}
              <div
                key={active}
                className="animate-in fade-in slide-in-from-bottom-2 duration-700"
              >
                <p className="text-2xl md:text-3xl font-light leading-snug text-gray-200 italic">
                  {testimonials[active].text}
                </p>
              </div>
            </div>

            {/* Bottom Navigator Strip */}
            <div className="mt-12 flex items-center gap-8">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setActive(
                      (prev) =>
                        (prev - 1 + testimonials.length) % testimonials.length,
                    )
                  }
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setActive((prev) => (prev + 1) % testimonials.length)
                  }
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              {/* Progress Line */}
              <div className="flex-1 h-[1px] bg-white/10 relative overflow-hidden">
                {!isPaused && (
                  <div
                    key={active}
                    className="absolute inset-0 bg-[#1c3866] origin-left animate-line-progress"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Minimal Sidebar Info (4 cols) */}
          <div className="lg:col-span-4 lg:border-l lg:border-white/5 lg:pl-12 flex flex-col gap-8">
            <div
              key={active}
              className="animate-in fade-in slide-in-from-right-4 duration-700"
            >
              <img
                src={testimonials[active].image}
                className="w-16 h-16 rounded-full object-cover mb-4 border border-white/10 grayscale hover:grayscale-0 transition-all"
                alt={testimonials[active].name}
              />
              <h4 className="text-lg font-medium">
                {testimonials[active].name}
              </h4>
              <p className="text-sm text-gray-500">
                {testimonials[active].role}
              </p>
              <div className="mt-4 px-3 py-1 rounded-md bg-blue-500/5 border border-blue-500/10 text-[#1c3866] text-[10px] font-bold uppercase tracking-widest w-fit">
                {testimonials[active].service}
              </div>
            </div>

            {/* Micro-dot navigation */}
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1 transition-all duration-300 rounded-full ${active === i ? "w-6 bg-[#1c3866]" : "w-2 bg-white/20 hover:bg-white/40"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes line-progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-line-progress {
          animation: line-progress 5s linear forwards;
        }
      `}</style>
    </section>
  );
}
