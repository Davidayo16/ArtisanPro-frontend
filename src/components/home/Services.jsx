import React, { useState, useEffect, useRef } from "react";
import {
  Wrench,
  Hammer,
  Zap,
  Paintbrush,
  Flame,
  ArrowRight,
} from "lucide-react";
 import { useNavigate } from "react-router-dom";

export default function Services() {
 
  const navigate = useNavigate();
  const services = [
    {
      name: "Plumbing",
      icon: Wrench,
      description: "Professional pipe repairs & water system installation",
      bg: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800",
      color: "from-blue-600 to-cyan-600",
    },
    {
      name: "Carpentry",
      icon: Hammer,
      description: "Custom furniture & premium woodwork solutions",
      bg: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
      color: "from-amber-600 to-orange-600",
    },
    {
      name: "Welding",
      icon: Flame,
      description: "Expert metal fabrication & structural welding",
      bg: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
      color: "from-red-600 to-orange-600",
    },
    {
      name: "Electrical",
      icon: Zap,
      description: "Safe wiring & modern electrical installations",
      bg: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
      color: "from-yellow-500 to-amber-600",
    },
    {
      name: "Painting",
      icon: Paintbrush,
      description: "Interior & exterior painting with premium finishes",
      bg: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
      color: "from-pink-500 to-rose-600",
    },
  ];

  const [loadedImages, setLoadedImages] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [centerIndex, setCenterIndex] = useState(2);
  const [screenSize, setScreenSize] = useState("large");
  const cardRefs = useRef([]);
  const mouseThrottleRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("large");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Preload images efficiently
    services.forEach((service, idx) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => ({ ...prev, [idx]: true }));
      };
      img.src = service.bg;
    });

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Track scroll position for mobile indicators
  useEffect(() => {
    if (screenSize !== "mobile" || !scrollContainerRef.current) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const cardWidth = container.children[0]?.offsetWidth || 0;
      const gap = 16; // 1rem gap
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setCenterIndex(index);
    };

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [screenSize]);

  // Throttled mouse move handler
  const handleMouseMove = (e, idx) => {
    if (screenSize !== "large") return;

    if (mouseThrottleRef.current) return;

    mouseThrottleRef.current = setTimeout(() => {
      mouseThrottleRef.current = null;
    }, 16); // ~60fps

    const card = cardRefs.current[idx];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `
      perspective(1200px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(1.05, 1.05, 1.05)
      translateZ(50px)
      translateX(-50%)
    `;
  };

  const handleMouseLeave = (idx) => {
    if (screenSize !== "large") return;
    const card = cardRefs.current[idx];
    if (!card) return;

    const position = getCardPosition(idx);
    card.style.transform = `
      perspective(1200px) 
      rotateY(${position.rotateY}deg)
      translateZ(${position.translateZ}px)
      translateX(-50%)
      scale(${position.scale})
    `;
    setHoveredCard(null);
  };

  const getCircularDiff = (idx) => {
    let diff = idx - centerIndex;
    const half = Math.floor(services.length / 2);

    if (diff > half) {
      diff = diff - services.length;
    } else if (diff <= -half && services.length % 2 === 0) {
      diff = diff + services.length;
    } else if (diff < -half) {
      diff = diff + services.length;
    }

    return diff;
  };

  const getCardPosition = (idx) => {
    const diff = getCircularDiff(idx);
    const isCenter = diff === 0;
    const absDistance = Math.abs(diff);

    return {
      rotateY: diff < 0 ? 30 : diff > 0 ? -30 : 0,
      translateZ: isCenter ? 30 : -100,
      scale: isCenter ? 1.05 : absDistance === 1 ? 0.85 : 0.7,
      opacity:
        absDistance === 0
          ? 1
          : absDistance === 1
          ? 0.9
          : absDistance === 2
          ? 0.6
          : 0.3,
      zIndex: 50 - absDistance * 10,
    };
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Our Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Professional Services for Every Need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From plumbing to welding, we connect you with verified experts who
            deliver excellence
          </p>
        </div>

        {/* Large Screens: Optimized 3D Carousel */}
        {screenSize === "large" && (
          <div
            className="relative h-[450px] flex items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            {services.map((service, idx) => {
              const Icon = service.icon;
              const diff = getCircularDiff(idx);
              const isCenter = diff === 0;
              const position = getCardPosition(idx);

              return (
                <div
                  key={idx}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  className="card-3d absolute rounded-3xl overflow-hidden border-4 border-white cursor-pointer"
                  style={{
                    width: "380px",
                    height: "280px",
                    left: "50%",
                    marginLeft: `${diff * 180}px`,
                    transform: `
                      perspective(1200px) 
                      rotateY(${position.rotateY}deg)
                      translateZ(${position.translateZ}px)
                      translateX(-50%)
                      scale(${position.scale})
                    `,
                    zIndex: position.zIndex,
                    transformStyle: "preserve-3d",
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    willChange: "transform",
                    boxShadow: isCenter
                      ? "0 30px 60px -15px rgba(0, 0, 0, 0.4)"
                      : "0 15px 30px -10px rgba(0, 0, 0, 0.2)",
                  }}
                  onMouseMove={(e) => {
                    if (isCenter) {
                      handleMouseMove(e, idx);
                      setHoveredCard(idx);
                    }
                  }}
                  onMouseLeave={() => handleMouseLeave(idx)}
                  onClick={() => setCenterIndex(idx)}
                >
                  {loadedImages[idx] ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${service.bg}')`,
                        transform:
                          hoveredCard === idx && isCenter
                            ? "scale(1.08)"
                            : "scale(1.05)",
                        transition: "transform 0.4s ease",
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300 animate-pulse" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70" />

                  {!isCenter && (
                    <div
                      className="absolute inset-0 bg-black pointer-events-none"
                      style={{ opacity: 1 - position.opacity }}
                    />
                  )}

                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-xl`}
                    >
                      <Icon size={28} />
                    </div>

                    <div>
                      <h3 className="text-3xl font-bold text-white mb-3">
                        {service.name}
                      </h3>
                      <p className="text-gray-100 text-sm leading-relaxed">
                        {service.description}
                      </p>
                      {isCenter && hoveredCard === idx && (
                        <div className="flex items-center gap-2 text-white font-semibold text-sm mt-3">
                          <span>Explore Service</span>
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tablet: Grid Layout */}
        {screenSize === "tablet" && (
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-3xl overflow-hidden h-72 cursor-pointer transform transition-all duration-300 hover:scale-105"
                  style={{
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {loadedImages[idx] ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${service.bg}')` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300 animate-pulse" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-100 text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile: Horizontal Scroll */}
        {screenSize === "mobile" && (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 px-4 scrollbar-hide"
            >
              {services.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <div
                    key={idx}
                    className="flex-shrink-0 snap-center rounded-3xl overflow-hidden relative"
                    style={{
                      width: "75vw",
                      maxWidth: "350px",
                      height: "450px",
                      boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {loadedImages[idx] ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${service.bg}')` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-300 animate-pulse" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-xl`}
                      >
                        <Icon size={28} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-3">
                          {service.name}
                        </h3>
                        <p className="text-gray-100 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {services.map((_, idx) => (
                <div
                  key={idx}
                  className="h-2 rounded-full bg-gray-300 transition-all duration-300"
                  style={{
                    width: idx === Math.floor(centerIndex) ? "24px" : "8px",
                    backgroundColor:
                      idx === Math.floor(centerIndex) ? "#2563eb" : "#cbd5e1",
                  }}
                />
              ))}
            </div>

            {/* Swipe Hint */}
            <div className="text-center mt-6 text-gray-500 text-sm flex items-center justify-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span>Swipe to see more services</span>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/artisans")}
            className="group relative inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              boxShadow: "0 10px 30px -10px rgba(34, 78, 140, 0.5)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              View All Services
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

      <style>{`
        .card-3d {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
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
