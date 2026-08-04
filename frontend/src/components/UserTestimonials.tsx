import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  rating: number;
  content: string;
  toolUsed: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Frontend Developer",
    company: "TechCorp Labs",
    avatar: "SC",
    rating: 5,
    content: "The JSON Formatter and AI Background Remover tools have become essential parts of my daily workflow. They save me hours every week and the local browser processing guarantees complete client data privacy.",
    toolUsed: "JSON Formatter",
    color: "173 80% 40%"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Marketing Manager",
    company: "Growth Media Agency",
    avatar: "MR",
    rating: 5,
    content: "I use the PDF tools daily for client reports and decks. The PDF Compressor maintains crisp document quality while reducing file size by 70%. Absolutely game-changing for our remote team.",
    toolUsed: "PDF Compressor",
    color: "220 80% 50%"
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "Product Designer",
    company: "DesignScale",
    avatar: "EJ",
    rating: 5,
    content: "As a creator, I rely on free utilities for fast asset generation. The Image Resizer, WebP Converter, and QR Generator are fast and clean. No registration required is a huge plus!",
    toolUsed: "Image Resizer",
    color: "280 80% 50%"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Senior Data Analyst",
    company: "Fintech Dynamics",
    avatar: "DK",
    rating: 5,
    content: "The EMI Calculator and Currency Converter tools are incredibly accurate and lightning fast. I've recommended DailyTools247 to our entire engineering and finance team.",
    toolUsed: "EMI Calculator",
    color: "35 90% 50%"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Digital Content Lead",
    company: "Studio One",
    avatar: "LT",
    rating: 5,
    content: "The AI Background Remover tool is phenomenal! It works better than expensive subscription software I've used before. The fact that it's 100% free and runs in the browser is mind-blowing.",
    toolUsed: "AI Background Remover",
    color: "160 80% 40%"
  }
];

const UserTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-background via-muted/20 to-background border-b border-border/60 relative overflow-hidden">
      {/* Ambient lighting blobs */}
      <div className="absolute top-1/2 left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Loved by Professionals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Trusted by 100,000+ Daily Creators
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            See how developers, designers, students, and digital teams boost their daily productivity.
          </p>
        </div>

        {/* Carousel Window */}
        <div 
          className="max-w-3xl mx-auto relative px-2 sm:px-12"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-3xl border border-border/80 bg-background/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
            >
              <Quote className="absolute top-6 right-6 h-16 w-16 text-primary/10 select-none pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                
                {/* Author Avatar with HSL Glow */}
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-lg border"
                    style={{
                      backgroundColor: `hsl(${current.color} / 0.15)`,
                      borderColor: `hsl(${current.color} / 0.3)`,
                      color: `hsl(${current.color})`
                    }}
                  >
                    {current.avatar}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4.5 w-4.5 ${
                          i < current.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs font-bold text-foreground">5.0 Rating</span>
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-foreground text-base sm:text-lg leading-relaxed font-medium">
                    "{current.content}"
                  </p>

                  {/* Author Meta */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/50 pt-5">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-foreground text-base">
                        {current.name}
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-xs text-muted-foreground font-light mt-0.5">
                        {current.role} {current.company && <span>· {current.company}</span>}
                      </div>
                    </div>
                    <div>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border shadow-sm"
                        style={{
                          backgroundColor: `hsl(${current.color} / 0.1)`,
                          borderColor: `hsl(${current.color} / 0.2)`,
                          color: `hsl(${current.color})`
                        }}
                      >
                        Tool: {current.toolUsed}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-[-6px] sm:left-[-16px] top-1/2 -translate-y-1/2 bg-background border border-border/80 rounded-2xl p-3 shadow-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 z-10 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-[-6px] sm:right-[-16px] top-1/2 -translate-y-1/2 bg-background border border-border/80 rounded-2xl p-3 shadow-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 z-10 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-primary shadow-sm" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Platform Trust Counter Grid */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {[
            { value: "100K+", label: "Monthly Users" },
            { value: "200+", label: "Helper Utilities" },
            { value: "4.9 / 5", label: "Average Score" },
            { value: "100% Local", label: "Data Security" }
          ].map((stat, index) => (
            <div
              key={index}
              className="p-5 text-center border border-border/70 bg-card/60 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default UserTestimonials;
