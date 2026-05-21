import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    content: "The JSON Formatter and Background Remover tools have become essential parts of my daily workflow. They save me hours every week and the results are consistently excellent.",
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
    content: "The Background Remover tool is phenomenal! It works better than paid software I've used. The fact that it's free and processes images locally is amazing.",
    toolUsed: "Background Remover",
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

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">100,000+</span> Users
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our users are saying about our free online tools
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white rounded-2xl shadow-xl p-8 sm:p-10"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                      {currentTestimonial.avatar}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < currentTestimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="relative mb-4">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                      <p className="text-gray-700 text-lg leading-relaxed pl-6">
                        {currentTestimonial.content}
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {currentTestimonial.name}
                        </div>
                        <div className="text-gray-600">
                          {currentTestimonial.role}
                          {currentTestimonial.company && (
                            <span> • {currentTestimonial.company}</span>
                          )}
                        </div>
                        <div className="text-sm text-blue-600 mt-1">
                          Used: {currentTestimonial.toolUsed}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                        {new Date(currentTestimonial.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isAutoPlaying ? "Pause" : "Play"} auto-slide
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {[
            { number: "100K+", label: "Active Users" },
            { number: "130+", label: "Free Tools" },
            { number: "4.9/5", label: "Average Rating" },
            { number: "1M+", label: "Tasks Completed" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default UserTestimonials;
