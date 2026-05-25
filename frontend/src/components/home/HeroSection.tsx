import { motion } from "framer-motion";
import { Search, Shield, Activity, Sparkle, Terminal, FileText, Image as ImageIcon, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toolCategories, getAllTools } from "@/data/toolCategories";

const POPULAR_SEARCHES = [
  { name: "PNG to JPG", path: "/png-to-jpg-converter" },
  { name: "Email Subject Generator", path: "/email-subject-line-generator" },
  { name: "Zip Extractor", path: "/extract-zip" },
  { name: "WhatsApp Status Generator", path: "/whatsapp-status-generator" },
  { name: "Passport Photo Resizer", path: "/passport-photo-resizer" },
];

const STATS = [
  {
    icon: Shield,
    title: "100% Private & Local",
    desc: "All files remain on your computer. Zero server uploads.",
  },
  {
    icon: Sparkle,
    title: "No Sign-up Required",
    desc: "Instant access to all tools. No subscription, limits, or ads.",
  },
  {
    icon: Activity,
    title: "Fast Processing",
    desc: "Runs directly in your browser. Lightning-fast response times.",
  },
];

const HeroSection = () => {
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof getAllTools>>([]);
  const [showResults, setShowResults]     = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate  = useNavigate();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setSelectedIndex(-1);
    if (q.length >= 2) {
      const matches = getAllTools().filter(
        (t) => t.name.toLowerCase().includes(q.toLowerCase()) ||
               t.description.toLowerCase().includes(q.toLowerCase()),
      );
      // Deduplicate by id (tools can appear in multiple categories)
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

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Global key listener for '/' key focus
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

  // Find category name for a given tool ID
  const getToolCategoryName = (toolId: string) => {
    const category = toolCategories.find((cat) => cat.tools.some((t) => t.id === toolId));
    return category ? category.name : "Tool";
  };

  const bubbles = [
    { label: "PDF Document", tag: ".pdf", icon: FileText, iconColor: "text-red-500 bg-red-50/50 border-red-100", floatDelay: 0 },
    { label: "Word Document", tag: ".docx", icon: FileText, iconColor: "text-blue-500 bg-blue-50/50 border-blue-100", floatDelay: 0.15 },
    { label: "Image File", tag: ".png / .jpg / .webp", icon: ImageIcon, iconColor: "text-emerald-500 bg-emerald-50/50 border-emerald-100", floatDelay: 0.3 },
  ];

  return (
    <section className="relative bg-gradient-to-b from-blue-50/45 via-background to-background border-b border-border py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Subtitle / Badge */}
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
            Trusted by professionals · Fast & Private
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            100+ Online Free Tools
          </h1>

          {/* Description & CTAs */}
          <div className="mx-auto mt-4 max-w-3xl">
            <p className="mx-auto text-lg text-muted-foreground/90">
              A suite of fast, secure, and privacy-first web tools for documents, images, and developer workflows — designed to keep your data local and your team productive.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/categories')}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition"
              >
                Explore Tools
              </button>
              <button
                onClick={() => navigate('/api-docs')}
                className="rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition"
              >
                API for Developers
              </button>
            </div>
          </div>

          {/* Format Bubbles */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 select-none">
            {bubbles.map((b) => {
              const BIcon = b.icon;
              return (
                <motion.div
                  key={b.label}
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: b.floatDelay,
                  }}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 shadow-sm text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${b.iconColor}`}>
                    <BIcon className="h-3.5 w-3.5" />
                  </div>
                  <span>{b.label}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 border border-slate-200/60">
                    {b.tag}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Search container */}
          <div
            ref={searchRef}
            className="relative mx-auto mt-8 max-w-3xl"
          >
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
              <Search className="ml-1 mr-4 h-6 w-6 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools... (e.g. PDF split, image resize)"
                className="w-full bg-transparent px-2 py-2 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-base"
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
                  className="mr-2 rounded-full p-1 text-muted-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="ml-2 hidden items-center sm:flex select-none">
                <kbd className="pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 font-mono text-[11px] font-semibold text-slate-400 shadow-sm">
                  /
                </kbd>
              </div>
            </div>

            {/* Autocomplete Dropdown - Clean & Standardized */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-[300px] overflow-y-auto rounded-xl border border-slate-200 bg-popover text-popover-foreground shadow-xl">
                <div className="space-y-0.5 p-1.5">
                  {searchResults.slice(0, 6).map((tool, i) => {
                    const catName = getToolCategoryName(tool.id);
                    return (
                      <button
                        key={tool.id}
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          selectedIndex === i
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                        onClick={() => handleSelectTool(tool.path)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        aria-label={`Open ${tool.name}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate">{tool.name}</div>
                          <div className={`text-xs truncate mt-0.5 ${
                            selectedIndex === i ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}>
                            {tool.description}
                          </div>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ml-2 flex-shrink-0 ${
                          selectedIndex === i ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {catName.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Popular Searches Quick Links */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium">Popular:</span>
              {POPULAR_SEARCHES.map((ps) => (
                <button
                  key={ps.name}
                  onClick={() => navigate(ps.path)}
                  className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-sm px-3 py-1 transition-colors border border-blue-100 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {ps.name}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Features panel */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3 text-left">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="rounded-lg border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-foreground">{stat.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{stat.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;