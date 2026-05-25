import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is DailyTools247 completely free to use?",
      answer: "Yes, DailyTools247 is 100% free. All 130+ tools are available without any signup, subscription, hidden fees, or premium restrictions. Everything works instantly."
    },
    {
      question: "Do I need to create an account or register?",
      answer: "No account or registration is required. All tools work instantly without any signup process. Simply visit the tool page and start using it immediately."
    },
    {
      question: "Is my data safe and private with DailyTools247?",
      answer: "Yes, your data is completely safe. All processing happens locally inside your browser using client-side execution. Your files never leave your device and are not uploaded to any server. We have zero access to your files or data."
    },
    {
      question: "Does DailyTools247 work on mobile phones and tablets?",
      answer: "Yes, DailyTools247 is fully optimized for all devices, including iOS, Android, tablets, and desktops. All tools feature responsive layouts and touch-friendly controls."
    },
    {
      question: "What types of tools are available?",
      answer: "We offer 100+ free online tools across multiple categories including: PDF tools, Image tools, Video tools, Audio tools, Text tools, Security utilities, Finance calculators, Developer tools, and more."
    },
    {
      question: "Do the tools require an active internet connection?",
      answer: "Most tools work completely offline once loaded! However, certain advanced features (such as scanning URL reputations or finding data breaches) require network access to pull data."
    },
    {
      question: "Can I use DailyTools247 for commercial purposes?",
      answer: "Yes, all tools can be used for both personal and commercial purposes. There are no restrictions on usage for business workflows or professional projects."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5" />
            Support & FAQ
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Get answers to common questions about local processing security, offline functionality, and platform access.
          </p>
        </div>

        {/* FAQ Accordion Grid */}
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-lg border bg-card transition-colors duration-200 ${
                  isOpen ? "border-slate-300 shadow-sm" : "border-border"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-muted/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base pr-4 text-foreground">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded border border-border bg-background text-muted-foreground transition-all ${
                      isOpen ? "rotate-180 border-slate-300 text-foreground" : ""
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
                      <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3 bg-muted/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
