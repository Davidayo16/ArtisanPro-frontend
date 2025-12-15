import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState("next");

  const testimonials = [
    {
      name: "Chioma Okafor",
      rating: 5,
      text: "Excellent service! The plumber was professional and fixed my pipes quickly. Highly recommended!",
      service: "Plumbing",
      image: {
        src: "/images/artisan8.jpg",
        fallback:
          "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=96&h=96",
        alt: "Chioma Okafor, satisfied customer",
      },
    },
    {
      name: "Adebayo Olanrewaju",
      rating: 5,
      text: "Amazing carpenter. He built my cabinet exactly as I imagined. Great communication throughout.",
      service: "Carpentry",
      image: {
        src: "/images/artisan7.jpg",
        fallback:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=96&h=96",
        alt: "Adebayo Olanrewaju, satisfied customer",
      },
    },
    {
      name: "Ngozi Eze",
      rating: 5,
      text: "Quick, reliable, and trustworthy. The electrician solved my power issue in no time. Will book again!",
      service: "Electrical",
      image: {
        src: "/images/artisan6.jpg",
        fallback:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=96&h=96",
        alt: "Ngozi Eze, satisfied customer",
      },
    },
  ];

  // Auto-rotation with progress
  useEffect(() => {
    if (isPaused) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setDirection("next");
          setActiveTestimonial(
            (current) => (current + 1) % testimonials.length
          );
          return 0;
        }
        return prev + 1.5;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isPaused, activeTestimonial]);

  const handleNext = () => {
    setDirection("next");
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setDirection("prev");
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setProgress(0);
  };

  return (
    <section className="pt-10 pb-32 bg-white relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>

      {/* Floating quote marks - positioned to avoid text */}
      <div className="absolute top-32 right-10 opacity-5 hidden lg:block">
        <Quote size={150} className="text-blue-600" />
      </div>
      <div className="absolute bottom-32 left-10 opacity-5 rotate-180 hidden lg:block">
        <Quote size={150} className="text-blue-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-md"
            style={{ backgroundColor: "#e6f0fa", color: "#224e8c" }}
          >
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            What Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied customers
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div
            className="relative perspective-1000"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main Card */}
            <div
              className="relative rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl transition-all duration-700 hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(135deg, #e6f0fa 0%, #f0f7ff 50%, #e6f0fa 100%)",
                transformStyle: "preserve-3d",
                boxShadow:
                  "0 25px 70px rgba(34, 78, 140, 0.2), 0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              {/* Navigation Buttons - Removed for cleaner look */}

              {/* Stars with animation */}
              <div className="flex gap-1 mb-4 sm:mb-6 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-yellow-400 text-yellow-400 transition-all duration-300 sm:w-6 sm:h-6"
                    style={{
                      animation: `starPop 0.5s ease-out ${i * 0.1}s`,
                      transform: "scale(1)",
                    }}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <div className="relative mb-6 sm:mb-8">
                <div
                  key={activeTestimonial}
                  className="text-center px-2 sm:px-0"
                  style={{
                    animation:
                      direction === "next"
                        ? "slideInRight 0.6s ease-out"
                        : "slideInLeft 0.6s ease-out",
                  }}
                >
                  <p className="text-base sm:text-lg lg:text-xl text-gray-800 italic leading-relaxed max-w-3xl mx-auto">
                    "{testimonials[activeTestimonial].text}"
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Animated Avatar with progress ring */}
                  <div
                    className="relative"
                    style={{
                      animation: "avatarFloat 0.7s ease-out",
                    }}
                  >
                    {/* Progress ring around avatar */}
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 46}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 46 * (1 - progress / 100)
                        }`}
                        style={{ transition: "stroke-dashoffset 0.1s linear" }}
                      />
                      <defs>
                        <linearGradient
                          id="progressGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#224e8c" />
                          <stop offset="100%" stopColor="#2a5ca8" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div
                      className="absolute inset-0 rounded-full animate-pulse"
                      style={{
                        background: "linear-gradient(135deg, #224e8c, #3b82f6)",
                        filter: "blur(8px)",
                        opacity: 0.3,
                        transform: "scale(1.1)",
                      }}
                    />
                    <img
                      src={testimonials[activeTestimonial].image.src}
                      onError={(e) =>
                        (e.target.src =
                          testimonials[activeTestimonial].image.fallback)
                      }
                      alt={testimonials[activeTestimonial].image.alt}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-gray-900 text-lg">
                      {testimonials[activeTestimonial].name}
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#224e8c" }}
                    >
                      {testimonials[activeTestimonial].service}
                    </p>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex gap-3">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > activeTestimonial ? "next" : "prev");
                        setActiveTestimonial(idx);
                        setProgress(0);
                      }}
                      className={`rounded-full transition-all duration-500 ${
                        idx === activeTestimonial
                          ? "w-12 h-3"
                          : "w-3 h-3 hover:scale-125"
                      }`}
                      style={{
                        backgroundColor:
                          idx === activeTestimonial ? "#224e8c" : "#cbd5e1",
                        boxShadow:
                          idx === activeTestimonial
                            ? "0 4px 12px rgba(34, 78, 140, 0.5)"
                            : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes starPop {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes avatarFloat {
          0% {
            transform: translateY(20px) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
