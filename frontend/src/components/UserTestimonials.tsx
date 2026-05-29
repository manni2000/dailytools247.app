import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  rating: number;
  content: string;
  toolUsed: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Frontend Developer",
    company: "TechCorp",
    avatar: "SC",
    rating: 5,
    content: "The JSON Formatter and AI Background Remover tools have become essential parts of my daily workflow. They save me hours every week and the results are consistently excellent.",
    toolUsed: "JSON Formatter",
    date: "2026-05-01"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Marketing Manager",
    company: "Digital Agency",
    avatar: "MR",
    rating: 5,
    content: "I use the PDF tools daily for client reports. The PDF Compressor maintains quality while reducing file size significantly. Absolutely game-changing for our team.",
    toolUsed: "PDF Compressor",
    date: "2026-04-28"
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "Student",
    company: "University of California",
    avatar: "EJ",
    rating: 5,
    content: "As a student, I rely on the free tools for assignments. The Image Resizer and QR Code Generator are perfect for my projects. No signup required is a huge plus!",
    toolUsed: "Image Resizer",
    date: "2026-04-25"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Data Analyst",
    company: "FinanceCorp",
    avatar: "DK",
    rating: 5,
    content: "The EMI Calculator and Currency Converter tools are incredibly accurate and fast. I've recommended them to my entire team. Best free tools available online.",
    toolUsed: "EMI Calculator",
    date: "2026-04-22"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Content Creator",
    company: "Freelance",
    avatar: "LT",
    rating: 5,
    content: "The AI Background Remover tool is phenomenal! It works better than paid software I've used. The fact that it's free and processes images locally is amazing.",
    toolUsed: "AI Background Remover",
    date: "2026-04-20"
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

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 sm:py-24 bg-muted/30 border-b border-border">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            User Feedback
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Trusted by 100,000+ Monthly Users
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            See what developers, students, and digital creators say about our browser-based tools.
          </p>
        </div>

        {/* Carousel Window */}
        <div className="max-w-3xl mx-auto relative px-2 sm:px-10">
          
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 sm:p-8 shadow-sm">
            <Quote className="absolute top-6 right-6 h-12 w-12 text-muted-foreground/10 select-none pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
              {/* Author Initials Avatar */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-muted border border-border rounded flex items-center justify-center text-muted-foreground font-bold text-lg select-none">
                  {currentTestimonial.avatar}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < currentTestimonial.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-foreground text-sm sm:text-base leading-relaxed font-medium">
                  "{currentTestimonial.content}"
                </p>

                {/* Author Metadata */}
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/50 pt-4 text-xs sm:text-sm">
                  <div>
                    <div className="font-bold text-foreground">
                      {currentTestimonial.name}
                    </div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      {currentTestimonial.role}
                      {currentTestimonial.company && (
                        <span> • {currentTestimonial.company}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground font-medium">
                      Tool: {currentTestimonial.toolUsed}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-[-12px] sm:left-[-18px] top-1/2 -translate-y-1/2 bg-background border border-border rounded-full p-2.5 shadow hover:bg-muted transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4.5 w-4.5 text-muted-foreground" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-[-12px] sm:right-[-18px] top-1/2 -translate-y-1/2 bg-background border border-border rounded-full p-2.5 shadow hover:bg-muted transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4.5 w-4.5 text-muted-foreground" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex flex-col items-center gap-3 mt-6">
          <div className="flex justify-center gap-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Platform Stats Counters (Standard Slate Styling) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-border pt-12 text-center">
          {[
            { value: "100K+", label: "Monthly Users" },
            { value: "130+", label: "Helper Utilities" },
            { value: "4.9 / 5", label: "Average Score" },
            { value: "1M+", label: "Jobs Done Locally" }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
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
