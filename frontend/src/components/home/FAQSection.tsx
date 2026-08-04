import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is DailyTools247 completely free to use?",
      answer: "Yes, DailyTools247 is 100% free. All 200+ tools are available without any signup, subscription, hidden fees, or premium paywalls. Everything processes instantly."
    },
    {
      question: "Do I need to create an account or register?",
      answer: "No account or registration is required. All tools work anonymously and instantly. Simply visit the tool page and start using it immediately."
    },
    {
      question: "Is my data safe and private with DailyTools247?",
      answer: "Yes, your data is 100% safe. All calculations, document conversions, image processing, and hashing happen locally inside your browser memory using client-side execution. Your files never leave your device."
    },
    {
      question: "Does DailyTools247 work on mobile phones and tablets?",
      answer: "Yes! DailyTools247 is fully responsive across mobile phones, tablets, laptops, and desktops with high-DPI touch support."
    },
    {
      question: "What types of tools are available?",
      answer: "We offer 200+ free online tools across 16 categories: AI Utilities, PDF Tools, Image Converters, Video/Audio Editors, Developer & Code Formations, Finance Calculators, SEO Analysis, Security Utilities, and E-commerce Tools."
    },
    {
      question: "Can I use DailyTools247 for commercial and business projects?",
      answer: "Yes, all tools can be used for both personal and commercial purposes with zero restrictions."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-background via-muted/20 to-background border-b border-border/60 relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute bottom-[20%] right-[-5%] h-[350px] w-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Support & Help</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            Get instant answers to common questions about browser processing, offline access, and tool security.
          </p>
        </div>

        {/* FAQ Accordion Grid */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-primary/40 bg-card shadow-xl shadow-primary/5"
                    : "border-border/80 bg-card/60 hover:bg-card hover:border-primary/20"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    {isOpen && <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />}
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isOpen
                        ? "bg-primary text-primary-foreground border-primary rotate-180 shadow-md"
                        : "bg-muted/50 text-muted-foreground border-border/80"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed border-t border-border/40 pt-4 bg-primary/5 rounded-b-2xl">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
