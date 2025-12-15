import React, { useState, useEffect, useRef } from "react";
import { Shield, Clock, Award, Zap, ArrowRight } from "lucide-react";
 import { useNavigate } from "react-router-dom";

export default function WhyChooseUs() {
    const navigate = useNavigate();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [artisans, setArtisans] = useState(0);
  const [jobs, setJobs] = useState(0);
  const [rating, setRating] = useState(0);
  const statsRef = useRef(null);

  const benefits = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "Background-checked artisans you can trust",
    },
    {
      icon: Clock,
      title: "Fast Response",
      description: "Connect with nearby experts in minutes",
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "Satisfaction backed by our commitment",
    },
    {
      icon: Zap,
      title: "Secure Payments",
      description: "Safe transactions, every time",
    },
  ];

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
      {/* Diagonal Image Background Section */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 65%, 0 85%)",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1483639130939-150975af84e5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Subtle overlay pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #224e8c 1px, transparent 1px),
                             radial-gradient(circle at 80% 80%, #2a5ca8 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
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

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Quality service,
                <br />
                <span style={{ color: "#224e8c" }}>trusted experts</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
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
                         onClick={() => navigate("/register")}
                         className="group relative inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
                         style={{
                           backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
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

          {/* Right Benefits Grid */}
          <div className="relative z-10 grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={idx}
                  className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  style={{
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                  }}
                >
                  {/* Subtle gradient on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"
                    style={{
                      background: "linear-gradient(135deg, #224e8c, #2a5ca8)",
                    }}
                  />

                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, #224e8c, #2a5ca8)",
                      }}
                    >
                      <Icon size={24} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Decorative corner accent */}
                  <div
                    className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(135deg, transparent 50%, #2a5ca8 50%)",
                      borderTopRightRadius: "1rem",
                    }}
                  />
                </div>
              );
            })}
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
