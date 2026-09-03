import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Flame,
  Eraser,
  Mic,
  Type,
  Shield,
  QrCode,
  FileText,
  Image as ImageIcon,
  Code,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ToolCard from "@/components/ToolCard";

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
  {
    id: "ai-background-remover",
    cat: "ai",
    name: "AI Background Remover",
    description: "Remove image background instantly with browser-side AI processing.",
    path: "/ai-background-remover",
    color: "173 80% 40%",
    categoryName: "AI",
    isTrending: true,
  },
  {
    id: "ai-speech-to-text",
    cat: "ai",
    name: "AI Speech to Text",
    description: "Transcribe audio & voice recordings to accurate text transcripts.",
    path: "/ai-speech-to-text",
    color: "173 80% 40%",
    categoryName: "AI",
  },
  {
    id: "ai-text-summarizer",
    cat: "ai",
    name: "AI Text Summarizer",
    description: "Summarize articles and research papers in seconds.",
    path: "/ai-text-summarizer",
    color: "173 80% 40%",
    categoryName: "AI",
  },
  {
    id: "ai-url-reputation-checker",
    cat: "ai",
    name: "AI URL Safety Checker",
    description: "Analyze domain safety, phishing score, and SSL security.",
    path: "/ai-url-reputation-checker",
    color: "173 80% 40%",
    categoryName: "AI",
  },

  // PDF
  {
    id: "pdf-to-image",
    cat: "pdf",
    name: "PDF to Image Converter",
    description: "Convert PDF pages to high quality JPG/PNG images.",
    path: "/pdf-to-image",
    color: "0 84% 60%",
    categoryName: "PDF",
    isTrending: true,
  },
  {
    id: "pdf-merge",
    cat: "pdf",
    name: "PDF Merge Tool",
    description: "Combine multiple PDF documents into a single file.",
    path: "/pdf-merge",
    color: "0 84% 60%",
    categoryName: "PDF",
  },
  {
    id: "pdf-compressor",
    cat: "pdf",
    name: "PDF Compressor",
    description: "Reduce PDF file size while preserving document quality.",
    path: "/pdf-compressor",
    color: "0 84% 60%",
    categoryName: "PDF",
  },
  {
    id: "pdf-split",
    cat: "pdf",
    name: "PDF Splitter",
    description: "Extract pages or split PDF into separate documents.",
    path: "/pdf-split",
    color: "0 84% 60%",
    categoryName: "PDF",
  },

  // Image
  {
    id: "image-compressor",
    cat: "image",
    name: "Image Compressor",
    description: "Compress JPG, PNG, and WebP images with custom ratio.",
    path: "/image-compressor",
    color: "220 80% 60%",
    categoryName: "Image",
    isTrending: true,
  },
  {
    id: "png-to-jpg-converter",
    cat: "image",
    name: "PNG to JPG Converter",
    description: "Convert PNG transparent images to JPG format.",
    path: "/png-to-jpg-converter",
    color: "220 80% 60%",
    categoryName: "Image",
  },
  {
    id: "qr-code-scanner",
    cat: "image",
    name: "QR Code Scanner",
    description: "Decode and scan QR codes from any uploaded image.",
    path: "/qr-code-scanner",
    color: "220 80% 60%",
    categoryName: "Image",
  },
  {
    id: "image-resize",
    cat: "image",
    name: "Image Resizer",
    description: "Resize image pixel dimensions instantly in browser.",
    path: "/image-resize",
    color: "220 80% 60%",
    categoryName: "Image",
  },

  // Dev
  {
    id: "json-formatter",
    cat: "dev",
    name: "JSON Formatter & Validator",
    description: "Format, validate, and beautify complex JSON payloads.",
    path: "/json-formatter",
    color: "142 70% 45%",
    categoryName: "Dev",
    isTrending: true,
  },
  {
    id: "ai-json-to-typescript-interface",
    cat: "dev",
    name: "AI JSON to TypeScript",
    description: "Convert raw JSON into strongly-typed TypeScript interfaces.",
    path: "/ai-json-to-typescript-interface",
    color: "142 70% 45%",
    categoryName: "Dev",
  },
  {
    id: "jwt-decoder",
    cat: "dev",
    name: "JWT Token Decoder",
    description: "Decode JSON Web Tokens and parse header claims.",
    path: "/jwt-decoder",
    color: "142 70% 45%",
    categoryName: "Dev",
  },
  {
    id: "ai-cron-generator",
    cat: "dev",
    name: "AI Cron Generator",
    description: "Generate and explain cron schedule expressions.",
    path: "/ai-cron-generator",
    color: "142 70% 45%",
    categoryName: "Dev",
  },

  // Finance
  {
    id: "emi-calculator",
    cat: "finance",
    name: "EMI Calculator",
    description: "Calculate monthly EMI, total interest, and loan schedule.",
    path: "/emi-calculator",
    color: "38 92% 50%",
    categoryName: "Finance",
    isTrending: true,
  },
  {
    id: "gst-invoice-generator",
    cat: "finance",
    name: "GST Invoice Generator",
    description: "Create professional GST invoices for business & tax.",
    path: "/gst-invoice-generator",
    color: "38 92% 50%",
    categoryName: "Finance",
  },
  {
    id: "sip-calculator",
    cat: "finance",
    name: "SIP Calculator",
    description: "Calculate returns on mutual fund Systematic Investment Plans.",
    path: "/sip-calculator",
    color: "38 92% 50%",
    categoryName: "Finance",
  },
  {
    id: "currency-converter",
    cat: "finance",
    name: "Currency Converter",
    description: "Convert live exchange rates for global currencies.",
    path: "/currency-converter",
    color: "38 92% 50%",
    categoryName: "Finance",
  },
];

const PopularTools = () => {
  const [activeTab, setActiveTab] = useState("all");

  const displayedTools =
    activeTab === "all"
      ? ALL_POPULAR_TOOLS.slice(0, 8)
      : ALL_POPULAR_TOOLS.filter((t) => t.cat === activeTab);

  return (
    <section className="py-16 sm:py-20 border-b border-border/50 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Row */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2 border border-primary/20">
              <Flame className="h-3.5 w-3.5 fill-primary text-primary" />
              <span>Trending Utilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Popular Right Now
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light">
              High-performance, 100% free online applications used by thousands daily.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted hover:border-primary/40 transition-all shadow-xs group"
          >
            <span>Explore All 200+ Tools</span>
            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Tab Switcher */}
        <div className="mb-8 flex flex-wrap items-center gap-1.5 border-b border-border/50 pb-4">
          {TAB_CATEGORIES.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent"
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
            {displayedTools.map((tool, idx) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                description={tool.description}
                path={tool.path}
                categoryColor={tool.color}
                categoryName={tool.categoryName}
                isTrending={tool.isTrending}
                delay={idx * 0.02}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PopularTools;
