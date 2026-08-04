import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Eraser, Mic, Type, Shield, QrCode, Mail, FileText, Image as ImageIcon, Code, DollarSign, ArrowUpRight, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TAB_CATEGORIES = [
  { id: "all", label: "🔥 Top Trending" },
  { id: "ai", label: "⚡ AI Utilities" },
  { id: "pdf", label: "📄 PDF Tools" },
  { id: "image", label: "🖼️ Image Tools" },
  { id: "dev", label: "💻 Dev Tools" },
  { id: "finance", label: "💰 Finance" },
];

const ALL_POPULAR_TOOLS = [
  // AI
  { id: "ai-bg-remover", cat: "ai", name: "AI Background Remover", description: "Remove image background instantly with browser-side AI processing.", path: "/ai-background-remover", icon: Eraser, tag: "AI" },
  { id: "ai-speech", cat: "ai", name: "AI Speech to Text", description: "Transcribe audio & voice recordings to accurate text transcripts.", path: "/ai-speech-to-text", icon: Mic, tag: "AI" },
  { id: "ai-summarizer", cat: "ai", name: "AI Text Summarizer", description: "Summarize articles and research papers in seconds.", path: "/ai-text-summarizer", icon: Type, tag: "AI" },
  { id: "ai-url-safety", cat: "ai", name: "AI URL Safety Checker", description: "Analyze domain safety, phishing score, and SSL security.", path: "/ai-url-reputation-checker", icon: Shield, tag: "AI" },
  
  // PDF
  { id: "pdf-to-img", cat: "pdf", name: "PDF to Image Converter", description: "Convert PDF pages to high quality JPG/PNG images.", path: "/pdf-to-image", icon: FileText, tag: "PDF" },
  { id: "pdf-merge", cat: "pdf", name: "PDF Merge Tool", description: "Combine multiple PDF documents into a single file.", path: "/pdf-merge", icon: FileText, tag: "PDF" },
  { id: "pdf-compress", cat: "pdf", name: "PDF Compressor", description: "Reduce PDF file size while preserving document quality.", path: "/pdf-compressor", icon: FileText, tag: "PDF" },
  { id: "pdf-split", cat: "pdf", name: "PDF Splitter", description: "Extract pages or split PDF into separate documents.", path: "/pdf-split", icon: FileText, tag: "PDF" },

  // Image
  { id: "img-compress", cat: "image", name: "Image Compressor", description: "Compress JPG, PNG, and WebP images with custom ratio.", path: "/image-compressor", icon: ImageIcon, tag: "Image" },
  { id: "png-to-jpg", cat: "image", name: "PNG to JPG Converter", description: "Convert PNG transparent images to JPG format.", path: "/png-to-jpg-converter", icon: ImageIcon, tag: "Image" },
  { id: "qr-scanner", cat: "image", name: "QR Code Scanner", description: "Decode and scan QR codes from any uploaded image.", path: "/qr-code-scanner", icon: QrCode, tag: "Image" },
  { id: "image-resize", cat: "image", name: "Image Resizer", description: "Resize image pixel dimensions instantly.", path: "/image-resize", icon: ImageIcon, tag: "Image" },

  // Dev
  { id: "json-fmt", cat: "dev", name: "JSON Formatter & Validator", description: "Format, validate, and beautify complex JSON payloads.", path: "/json-formatter", icon: Code, tag: "Dev" },
  { id: "ai-json-ts", cat: "dev", name: "AI JSON to TypeScript", description: "Convert raw JSON into strongly-typed TypeScript interfaces.", path: "/ai-json-to-typescript-interface", icon: Code, tag: "Dev" },
  { id: "jwt-decoder", cat: "dev", name: "JWT Token Decoder", description: "Decode JSON Web Tokens and parse header claims.", path: "/jwt-decoder", icon: Code, tag: "Dev" },
  { id: "cron-gen", cat: "dev", name: "AI Cron Generator", description: "Generate and explain cron schedule expressions.", path: "/ai-cron-generator", icon: Code, tag: "Dev" },

  // Finance
  { id: "emi-calc", cat: "finance", name: "EMI Calculator", description: "Calculate monthly EMI, total interest, and loan schedule.", path: "/emi-calculator", icon: DollarSign, tag: "Finance" },
  { id: "gst-invoice", cat: "finance", name: "GST Invoice Generator", description: "Create professional GST invoices for business & tax.", path: "/gst-invoice-generator", icon: DollarSign, tag: "Finance" },
  { id: "sip-calc", cat: "finance", name: "SIP Calculator", description: "Calculate returns on mutual fund Systematic Investment Plans.", path: "/sip-calculator", icon: DollarSign, tag: "Finance" },
  { id: "currency-conv", cat: "finance", name: "Currency Converter", description: "Convert live exchange rates for global currencies.", path: "/currency-converter", icon: DollarSign, tag: "Finance" },
];

const PopularTools = () => {
  const [activeTab, setActiveTab] = useState("all");

  const displayedTools = activeTab === "all"
    ? ALL_POPULAR_TOOLS.slice(0, 8)
    : ALL_POPULAR_TOOLS.filter(t => t.cat === activeTab);

  return (
    <section className="py-16 sm:py-22 border-b border-border/60 bg-background relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-[30%] right-[-5%] h-[350px] w-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header Title */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-2 border border-primary/20">
              <Flame className="h-3.5 w-3.5 fill-primary text-primary" />
              <span>Most Popular</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Trending Online Utilities
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light">
              High-performance, 100% free online applications used by thousands daily.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm group"
          >
            Explore All 200+ Tools
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
          {TAB_CATEGORIES.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tools Cards Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {displayedTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.03, duration: 0.2 }}
                >
                  <Link
                    to={tool.path}
                    className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/80 bg-card hover:bg-gradient-to-br hover:from-primary/5 hover:to-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {tool.tag}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 font-light leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary">
                      <span>Try Now</span>
                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default PopularTools;
