import { motion } from "framer-motion";
import { Search, Shield, Activity, Sparkles, Terminal, ArrowRight, Zap, CheckCircle2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toolCategories, getAllTools } from "@/data/toolCategories";

const POPULAR_SEARCHES = [
  { name: "AI Background Remover", path: "/ai-background-remover" },
  { name: "AI Text Summarizer", path: "/ai-text-summarizer" },
  { name: "AI Speech to Text", path: "/ai-speech-to-text" },
  { name: "PDF to Image", path: "/pdf-to-image" },
  { name: "Image Compressor", path: "/image-compressor" },
];

const STATS = [
  {
    icon: Shield,
    title: "100% Private & Secure",
    desc: "Your data stays in your browser with client-side & local memory processing.",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  },
  {
    icon: Sparkles,
    title: "Unlimited Free Access",
    desc: "Instant access to 200+ tools. No credits, no subscriptions, no signup required.",
    color: "text-primary bg-primary/10 border-primary/20"
  },
  {
    icon: Activity,
    title: "Lightning Fast Engine",
    desc: "Optimized WebAssembly & local algorithms deliver instant, high-precision results.",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
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
        (t) => t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.description.toLowerCase().includes(q.toLowerCase()),
      );
      const unique = Array.from(new Map(matches.map(m => [m.id, m])).values());
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

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const getToolCategoryName = (toolId: string) => {
    const category = toolCategories.find((cat) => cat.tools.some((t) => t.id === toolId));
    return category ? category.name : "Tool";
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b border-border/60 py-16 sm:py-24 lg:py-28">
      {/* Decorative ambient lighting elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 h-full w-full stroke-primary/[0.04] [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="hero-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse" x="-1" y="-1">
              <path d="M.5 32V.5H32" fill="none" strokeDasharray="0" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
        </svg>
        <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl opacity-70" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl opacity-60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-sm"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>200+ Professional Tools · 100% Free & Private</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]"
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
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
          >
            Boost your daily productivity with local browser AI, document conversion, and online smart tools.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => navigate('/categories')}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Zap className="h-4 w-4" />
              Explore All 200+ Tools
            </button>
            <button
              onClick={() => navigate('/api-docs')}
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted hover:border-primary/40 backdrop-blur-md transition-all"
            >
              <Terminal className="h-4 w-4 text-primary" />
              API Access for Developers
            </button>
          </motion.div>

          {/* Glass Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            ref={searchRef}
            className="relative mx-auto mt-8 max-w-3xl"
          >
            <div className="relative group">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 sm:h-6 sm:w-6 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search specific tool (e.g. 'pdf to image', 'compress', 'calculator')..."
                className="h-14 sm:h-16 w-full rounded-2xl border-2 border-border/80 bg-background/90 pl-12 sm:pl-14 pr-12 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 shadow-2xl backdrop-blur-xl transition-all duration-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 appearance-none"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setShowResults(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 z-50 mt-2 max-h-[320px] overflow-y-auto rounded-2xl border border-primary/20 bg-background/95 p-2 shadow-2xl backdrop-blur-2xl text-left">
                <div className="space-y-1">
                  {searchResults.slice(0, 6).map((tool, i) => {
                    const catName = getToolCategoryName(tool.id);
                    return (
                      <button
                        key={tool.id}
                        className={`w-full flex items-center justify-between rounded-xl p-3 text-left transition-all ${selectedIndex === i
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted text-foreground"
                          }`}
                        onClick={() => handleSelectTool(tool.path)}
                        onMouseEnter={() => setSelectedIndex(i)}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm truncate">{tool.name}</div>
                          <div className={`text-xs truncate mt-0.5 ${selectedIndex === i ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {tool.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${selectedIndex === i ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                            {catName}
                          </span>
                          <ArrowRight className={`h-4 w-4 ${selectedIndex === i ? "text-primary-foreground" : "text-primary"}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Popular Searches Quick Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-muted-foreground font-semibold uppercase tracking-wider mr-1">Popular:</span>
              {POPULAR_SEARCHES.map((ps) => (
                <button
                  key={ps.name}
                  onClick={() => navigate(ps.path)}
                  className="rounded-full bg-background/80 hover:bg-primary/10 hover:text-primary text-foreground border border-border/80 px-3 py-1.5 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  {ps.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Trust & Performance Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-14 sm:mt-18 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 text-left"
          >
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-border/80 bg-background/70 backdrop-blur-xl p-5 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <p className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{stat.title}</p>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">{stat.desc}</p>
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