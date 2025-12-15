import React, { useState, useEffect, useRef } from "react";
import { Search, Calendar, Lock, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);
  const sectionRef = useRef(null);

  const steps = [
    {
      number: "01",
      title: "Find Your Artisan",
      description:
        "Browse our verified artisans, check ratings, reviews, and availability. Search by service type or location to find the perfect match for your needs.",
      icon: Search,
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
    },
    {
      number: "02",
      title: "Book Your Appointment",
      description:
        "Select your preferred date and time that works best for you. Get instant confirmation sent to your phone with all the details you need.",
      icon: Calendar,
      image:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    },
    {
      number: "03",
      title: "Secure Payment",
      description:
        "Pay safely through our secure platform. Your money is held in escrow until the artisan completes the work to your satisfaction.",
      icon: Lock,
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    },
    {
      number: "04",
      title: "Get It Done",
      description:
        "The artisan arrives on time and completes the work professionally. Review the work and release payment when you're completely satisfied.",
      icon: CheckCircle,
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      stepRefs.current.forEach((ref, idx) => {
        if (!ref) return;

        const elementTop = ref.offsetTop + sectionTop;
        const elementBottom = elementTop + ref.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          setActiveStep(idx);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ActiveIcon = steps[activeStep].icon;

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
          >
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Get Started in 4 Simple Steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From finding the right artisan to getting the job done — we've made
            it simple
          </p>
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          <div className="sticky top-24">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {steps.map((step, idx) => (
                <img
                  key={idx}
                  src={step.image}
                  alt={step.title}
                  className={`w-full h-[600px] object-cover transition-opacity duration-700 ${
                    idx === activeStep
                      ? "opacity-100"
                      : "opacity-0 absolute inset-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: "#fbbf24" }}
                  >
                    <ActiveIcon size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500">
                      STEP {steps[activeStep].number}
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {steps[activeStep].title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-32 py-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStep;

              return (
                <div
                  key={idx}
                  ref={(el) => (stepRefs.current[idx] = el)}
                  className="transition-all duration-500"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isActive
                            ? "text-white shadow-lg"
                            : "bg-gray-200 text-gray-400"
                        }`}
                        style={{
                          backgroundColor: isActive ? "#fbbf24" : undefined,
                        }}
                      >
                        <Icon size={28} />
                      </div>
                    </div>

                    <div className="flex-1 pt-2">
                      <div
                        className={`text-sm font-bold mb-2 transition-all duration-500 ${
                          isActive ? "opacity-100" : "opacity-50"
                        }`}
                        style={{ color: "#f59e0b" }}
                      >
                        STEP {step.number}
                      </div>
                      <h3
                        className={`text-3xl font-bold mb-4 transition-all duration-500 ${
                          isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-lg leading-relaxed transition-all duration-500 ${
                          isActive ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:hidden space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden shadow-lg"
              >
                <div className="relative h-56">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <div
                    className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: "#fbbf24" }}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                <div className="p-6">
                  <div
                    className="text-xs font-bold mb-2"
                    style={{ color: "#f59e0b" }}
                  >
                    STEP {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button
            className="group relative px-10 py-4 text-white font-semibold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            }}
          >
            <span className="relative z-10">Start Your First Job</span>
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

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
