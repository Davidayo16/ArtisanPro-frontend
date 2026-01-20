import React from "react";
import {
  Apple,
  Play,
  Star,
  ShieldCheck,
  Zap,
  Bell,
  CheckCircle,
} from "lucide-react";

export default function DownloadApp() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0a0a] border-t border-white/5">
      {/* Subtle background glow - centered behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              Available Now
            </div>

            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">
              The entire community <br />
              <span className="text-gray-500 italic">at your fingertips.</span>
            </h2>

            <p className="text-lg text-gray-400 mb-10 max-w-md leading-relaxed font-light">
              Get the most out of our service with the mobile app. Instant
              alerts, secure one-tap payments, and verified artisan tracking.
            </p>

            {/* Clean Download Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-all duration-300">
                <Apple size={20} />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold leading-none">
                    App Store
                  </p>
                </div>
              </button>

              <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-transparent border border-white/20 text-white hover:bg-white/5 transition-all duration-300">
                <Play size={18} className="fill-white" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold leading-none">
                    Play Store
                  </p>
                </div>
              </button>
            </div>

            {/* Minimal Feature List */}
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {[
                { label: "Verified Pros", icon: ShieldCheck },
                { label: "Live Tracking", icon: Zap },
                { label: "24/7 Support", icon: Bell },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-500">
                  <item.icon size={14} className="text-blue-500" />
                  <span className="text-xs font-medium uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT: App Image with Effects */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
            {/* Soft Glow behind the phone image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[500px] bg-blue-500/20 blur-[100px] rounded-full" />

            <div className="relative group">
              {/* Floating Badge to fill space and add detail */}
              {/* <div className="absolute -left-12 top-20 z-20 bg-[#111] border border-white/10 p-4 rounded-2xl shadow-2xl animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CheckCircle className="text-blue-500 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">
                      Artisan Verified
                    </p>
                    <p className="text-gray-500 text-[10px]">Secure Identity</p>
                  </div>
                </div>
              </div> */}

              {/* THE APP IMAGE */}
              <img
                src="/images/app.png"
                alt="ArtisanPro App"
                className="relative z-10 w-[320px] md:w-[380px] h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
              />

              {/* Subtle light reflection overlay */}
              <div className="absolute inset-0 z-15 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-[3rem]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
