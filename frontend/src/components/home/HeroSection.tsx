import { motion } from "framer-motion";
import {
  Search,
  Shield,
  Activity,
  Sparkles,
  Terminal,
  ArrowRight,
  Zap,
  CheckCircle2,
  X,
  Cpu,
  Lock,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toolCategories, getAllTools } from "@/data/toolCategories";

const POPULAR_SEARCHES = [
  { name: "AI Background Remover", path: "/ai-background-remover" },
  { name: "Image Compressor", path: "/image-compressor" },
  { name: "PDF to Image", path: "/pdf-to-image" },
  { name: "AI Speech to Text", path: "/ai-speech-to-text" },
  { name: "JSON Formatter", path: "/json-formatter" },
  { name: "EMI Calculator", path: "/emi-calculator" },
];

const STATS = [
  {
    icon: Shield,
    title: "100% Private & Secure",
    desc: "Your data stays in your browser with client-side & local memory processing.",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Sparkles,
    title: "Unlimited Free Access",
    desc: "Instant access to 200+ tools. No credits, no subscriptions, no signup required.",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    icon: Activity,
    title: "Lightning Fast Engine",
    desc: "Optimized WebAssembly & local algorithms deliver instant, high-precision results.",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
];

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof getAllTools>>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setSelectedIndex(-1);
    if (q.length >= 2) {
      const matches = getAllTools().filter(
        (t) =>
          t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.description.toLowerCase().includes(q.toLowerCase())
      );
      const unique = Array.from(new Map(matches.map((m) => [m.id, m])).values());
      setSearchResults(unique);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectTool = (path: string) => {
    setShowResults(false);
    setSearchQuery("");
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || !searchResults.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((p) => Math.min(p + 1, Math.min(searchResults.length - 1, 5)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectTool(searchResults[selectedIndex].path);
    } else if (e.key === "Escape") {
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getToolCategoryName = (toolId: string) => {
    const category = toolCategories.find((cat) => cat.tools.some((t) => t.id === toolId));
    return category ? category.name : "Tool";
  };

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background py-16 sm:py-24 lg:py-28">
      {/* Decorative ambient lighting elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 h-full w-full stroke-primary/[0.04] [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern id="hero-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse" x="-1" y="-1">
              <path d="M.5 32V.5H32" fill="none" strokeDasharray="0" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
        </svg>
        <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl opacity-50 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>200+ Professional Tools · 100% Free & Private</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]"
          >
            Free AI Tools, PDF Tools,
            <span className="block mt-1 gradient-text">
              Image Converters & Developer Utilities
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed"
          >
            Boost your daily productivity with local browser AI, document conversion, and online smart tools.
          </motion.p>
          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Zap className="h-4 w-4" />
              Explore All 200+ Tools
            </button>
            <button
              type="button"
              onClick={() => navigate("/api-docs")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-5 py-3.5 text-xs sm:text-sm font-bold text-foreground hover:bg-slate-50 hover:border-primary/50 shadow-xs hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md transition-all duration-200"
            >
              <Terminal className="h-4 w-4 text-primary" />
              API & Dev Docs
            </button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            ref={searchRef}
            className="relative mx-auto mt-8 max-w-3xl"
          >
            <div className="relative group">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 sm:h-6 sm:w-6 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools (e.g. 'image compressor', 'pdf to word', 'json')..."
                className="h-14 sm:h-16 w-full rounded-2xl border border-slate-200/90 bg-white/95 pl-12 sm:pl-14 pr-24 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 appearance-none"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500">
                    ⌘K
                  </kbd>
                )}
              </div>
            </div>

            {/* Live Autocomplete Dropdown */}
            {showResults && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {searchResults.length} {searchResults.length === 1 ? "Tool" : "Tools"} Found
                    </div>
                    {searchResults.map((tool, idx) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => handleSelectTool(tool.path)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all ${
                          idx === selectedIndex
                            ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                            : "hover:bg-slate-100 text-foreground"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="text-sm font-semibold truncate leading-tight">
                            {tool.name}
                          </p>
                          <p
                            className={`text-xs truncate font-light mt-0.5 ${
                              idx === selectedIndex
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            }`}
                          >
                            {tool.description}
                          </p>
                        </div>
                        {tool.category && (
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border flex-shrink-0 ${
                              idx === selectedIndex
                                ? "bg-white/20 text-white border-white/30"
                                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {tool.category}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No tools found matching "<span className="font-semibold text-foreground">{searchQuery}</span>"
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Popular Search Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs"
          >
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              Popular:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {POPULAR_SEARCHES.map((ps) => (
                <button
                  key={ps.name}
                  type="button"
                  onClick={() => navigate(ps.path)}
                  className="rounded-full bg-white hover:bg-teal-50 hover:text-teal-700 text-foreground border border-slate-200/90 px-3 py-1.5 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:-translate-y-0.5"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  {ps.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Trust & Architecture Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-14 sm:mt-18 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 text-left"
          >
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="rounded-3xl border border-slate-200/90 bg-white/90 backdrop-blur-xl p-6 shadow-md shadow-slate-900/5 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${stat.color} shadow-sm group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">
                      {stat.title}
                    </p>
                  </div>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed font-light">
                    {stat.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;