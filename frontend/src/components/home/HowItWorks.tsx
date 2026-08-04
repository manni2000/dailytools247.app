import { Search, Upload, Cpu, Download, ArrowRight, Sparkles, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Select Any Tool",
    description: "Choose from 200+ online utilities for PDF, image, AI, developer, and finance tasks.",
    color: "173 80% 40%"
  },
  {
    number: "02",
    icon: Upload,
    title: "Input Data or Files",
    description: "Upload your documents or paste text. All files remain 100% private in browser memory.",
    color: "220 80% 50%"
  },
  {
    number: "03",
    icon: Cpu,
    title: "Instant Local Engine",
    description: "High-precision WebAssembly and local JavaScript algorithms execute tasks instantly.",
    color: "280 80% 50%"
  },
  {
    number: "04",
    icon: Download,
    title: "Download Result",
    description: "Save processed documents or copy formatted data instantly with zero watermark.",
    color: "35 90% 50%"
  }
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-background py-20 sm:py-28 border-b border-border/60 overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-[40%] left-[-10%] h-[350px] w-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Simple 4-Step Local Workflow
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            No signup, installation, or user account required. Everything processes securely inside your browser.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl hover:border-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `hsl(${step.color} / 0.15)`,
                        borderColor: `hsl(${step.color} / 0.3)`,
                        color: `hsl(${step.color})`
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className="font-mono text-xs font-extrabold px-3 py-1 rounded-full border shadow-sm select-none"
                      style={{
                        backgroundColor: `hsl(${step.color} / 0.1)`,
                        borderColor: `hsl(${step.color} / 0.2)`,
                        color: `hsl(${step.color})`
                      }}
                    >
                      STEP {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span>Fast & Private</span>
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="mx-auto max-w-3xl rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-background to-primary/5 p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] h-[200px] w-[200px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />

            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Ready to process your files securely?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
              Join thousands of creators using 100% browser-local AI and document conversion utilities.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => navigate("/categories")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/95 hover:shadow-xl hover:scale-105 transition-all"
              >
                Browse All 200+ Tools
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;
