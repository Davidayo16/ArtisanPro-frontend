import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function WhyChooseUs() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [artisans, setArtisans] = useState(0);
  const [jobs, setJobs] = useState(0);
  const [rating, setRating] = useState(0);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounter(setArtisans, 500, 2000);
          animateCounter(setJobs, 5000, 2000);
          animateCounter(setRating, 4.9, 2000, true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounter = (setter, target, duration, isDecimal = false) => {
    const startTime = Date.now();
    const step = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const current = easeOutQuad * target;

      if (isDecimal) {
        setter(current.toFixed(1));
      } else {
        setter(Math.floor(current));
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* Reduced Diagonal Background Section */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 95%)",
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1483639130939-150975af84e5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Accent Diagonal Shape */}
      <div
        className="absolute right-0 top-0 w-1/3 h-full opacity-5"
        style={{
          clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
          background: "linear-gradient(135deg, #224e8c, #2a5ca8)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Content */}
          <div className="relative z-10">
            <div className="mb-8">
              <div className="inline-block mb-6">
                <span
                  className="text-sm font-bold tracking-wider uppercase"
                  style={{ color: "#224e8c" }}
                >
                  Why Choose Us
                </span>
                <div
                  className="h-1 w-16 mt-2 rounded-full"
                  style={{
                    background: "linear-gradient(to right, #224e8c, #2a5ca8)",
                  }}
                />
              </div>

              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
                style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}
              >
                Quality service,
                <br />
                <span className="text-yellow-300">trusted experts</span>
              </h2>

              <p
                className="text-lg md:text-xl leading-relaxed text-white font-medium"
                style={{ textShadow: "1px 1px 6px rgba(0,0,0,0.8)" }}
              >
                We connect you with skilled artisans who deliver excellence.
                Every professional is verified, every job is guaranteed.
              </p>
            </div>

            {/* Stats Row with Animation */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 py-8 border-t border-b border-gray-200"
            >
              <div>
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ color: "#224e8c" }}
                >
                  {artisans}+
                </div>
                <div className="text-sm text-gray-600">Artisans</div>
              </div>
              <div>
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ color: "#224e8c" }}
                >
                  {jobs >= 1000 ? `${Math.floor(jobs / 1000)}K` : jobs}+
                </div>
                <div className="text-sm text-gray-600">Jobs Done</div>
              </div>
              <div>
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ color: "#224e8c" }}
                >
                  {rating}★
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <button
                onClick={() => alert("Get Started clicked!")}
                className="group relative inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                  boxShadow: "0 10px 30px -10px rgba(34, 78, 140, 0.5)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-2"
                  />
                </span>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    animation: "shimmer 2s infinite",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
