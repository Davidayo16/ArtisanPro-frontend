import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, CheckCircle, Shield, Award, Users } from "lucide-react";

export default function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [artisans, setArtisans] = useState(0);
  const [jobs, setJobs] = useState(0);
  const [rating, setRating] = useState(0);
  const sectionRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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
      { threshold: 0.5 },
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

  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "Every artisan is background-checked and certified",
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "100% satisfaction guarantee on all completed work",
    },
    {
      icon: Users,
      title: "Trusted by Thousands",
      description: "Join our community of satisfied customers",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      {/* Subtle geometric shapes background */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-64 sm:h-64 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 border border-white/10 rotate-45"></div>
      </div>

      {/* Very subtle accent */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div
            className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <div className="space-y-4 sm:space-y-6">
              <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/20">
                Why Choose Us
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Quality Service,
                <br />
                <span className="text-blue-400">Trusted Experts</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                We connect you with skilled artisans who deliver excellence.
                Every professional is verified, every job is guaranteed.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: `${0.2 + idx * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                  {artisans}+
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Artisans</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                  {jobs >= 1000 ? `${Math.floor(jobs / 1000)}K` : jobs}+
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Jobs Done
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                  {rating}★
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Rating</div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`pt-2 sm:pt-4 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <button
                className="group relative inline-flex items-center gap-2 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 border border-blue-500/30 text-sm sm:text-base"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                  boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.4)",
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
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    animation: "shimmer 2s infinite",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

              {/* Main image container */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                  alt="Professional craftsman at work"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Accent element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
