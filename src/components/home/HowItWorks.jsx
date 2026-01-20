import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Calendar,
  Lock,
  CheckCircle,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  const steps = [
    {
      number: "01",
      title: "Find Your Artisan",
      description:
        "Browse verified artisans with real-time availability filters.",
      icon: Search,
      uiLabel: "Database Query Active",
    },
    {
      number: "02",
      title: "Book Appointment",
      description: "Secure your slot with instant confirmation syncing.",
      icon: Calendar,
      uiLabel: "Calendar Syncing",
    },
    {
      number: "03",
      title: "Secure Payment",
      description: "Escrow protection ensures quality before funds release.",
      icon: Lock,
      uiLabel: "Escrow Protocol",
    },
    {
      number: "04",
      title: "Get It Done",
      description: "Work is completed and reviewed by the community.",
      icon: CheckCircle,
      uiLabel: "Verification Complete",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(parseInt(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.8, rootMargin: "-10% 0px -10% 0px" },
    );
    stepRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#0a0a0a] text-white py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-24">
          <div className="flex items-center gap-2 text-[#1c3866]  mb-4">
            <Shield size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
              The Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">
            How we ensure <br />
            <span className="text-gray-500 italic">absolute excellence.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* LEFT: Text Interaction */}
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div
                key={idx}
                ref={(el) => (stepRefs.current[idx] = el)}
                data-index={idx}
                onClick={() => setActiveStep(idx)}
                className={`group py-10 border-b border-white/5 transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer ${
                  activeStep === idx
                    ? "opacity-100"
                    : "opacity-20 hover:opacity-40"
                }`}
              >
                <div className="flex items-center gap-8">
                  <span
                    className={`text-sm font-mono transition-colors duration-[1000ms] ${activeStep === idx ? "text-[#1c3866] " : "text-gray-500"}`}
                  >
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-2xl font-light mb-3 tracking-tight transition-all duration-[1000ms]">
                      {step.title}
                    </h3>
                    {/* Controlled height for smoother expansion */}
                    <div
                      className={`grid transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        activeStep === idx
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="text-sm text-gray-400 max-w-sm leading-relaxed overflow-hidden">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: The Minimal Stage */}
          <div className="sticky top-40 hidden lg:block">
            <div className="relative aspect-square max-w-[440px] ml-auto">
              <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_25s_linear_infinite]" />
              <div className="absolute inset-10 rounded-full border border-dashed border-white/10 animate-[spin_35s_linear_infinite_reverse]" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-2xl">
                  {/* Dynamic Icon with slow fade/scale */}
                  <div
                    key={activeStep}
                    className="relative z-10 text-[#1c3866]  mb-6 animate-in fade-in zoom-in duration-1000 ease-out"
                  >
                    {React.createElement(steps[activeStep].icon, {
                      size: 54,
                      strokeWidth: 1,
                      className: "drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]",
                    })}
                  </div>

                  <div className="relative z-10 text-center">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">
                      {steps[activeStep].uiLabel}
                    </p>
                    <div className="h-[1px] w-12 bg-blue-500/50 mx-auto transition-all duration-1000" />
                  </div>

                  <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/20" />
                  <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/20" />
                </div>
              </div>

              {/* Orbiting Nodes with slower, elegant rotation */}
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${i * 90}deg)`,
                  }}
                >
                  <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-[1000ms] ${
                      activeStep === i
                        ? "bg-[#1c3866] shadow-[0_0_20px_#3b82f6] scale-[2]"
                        : "bg-white/10 scale-100"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minimalist Button */}
        <div className="mt-24 flex justify-center pt-12">
          <button className="px-10 py-4 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 group">
            <span className="text-sm font-medium tracking-widest flex items-center gap-3">
              GET STARTED NOW
              <ArrowRight
                size={16}
                className="text-[#1c3866] group-hover:translate-x-1 transition-transform"
              />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
