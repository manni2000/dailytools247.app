import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Grid3x3, 
  List, 
  TrendingUp, 
  Zap, 
  Search, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  BarChart3,
  Flame,
  ArrowUpRight,
  Filter,
  Check,
  Tag,
  ChevronRight,
  Compass,
  Layers
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toolCategories, getAllTools, Tool, ToolCategory } from "@/data/toolCategories";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEOHelmet from "@/components/SEOHelmet";
import { useIsMobile } from "@/hooks/use-mobile";
import { universalToolFaqs } from "@/data/toolSeoEnhancements";
import CategoryFAQSection from "@/components/CategoryFAQSection";

type SortOption = "alphabetical" | "most-tools" | "default";

interface DirectMatchItem {
  tool: Tool;
  category: ToolCategory;
  relevance: number;
}

const CategoriesPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const categoriesResultsRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const totalTools = getAllTools().length;

  // Auto-scroll to Categories Matching results when searching
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const timer = setTimeout(() => {
        categoriesResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isMobile && viewMode !== "list") {
      setViewMode("list");
    }
  }, [isMobile, viewMode]);

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Quick filter pills for popular search queries & categories
  const popularPills = [
    { label: "All Categories", filterId: "all", query: "" },
    { label: "PDF Tools", filterId: "pdf", query: "pdf" },
    { label: "AI Utilities", filterId: "ai", query: "ai" },
    { label: "Image Tools", filterId: "image", query: "image" },
    { label: "Converters", filterId: "converters", query: "converter" },
    { label: "Calculators", filterId: "calculators", query: "calculator" },
    { label: "Developer", filterId: "dev", query: "json" },
  ];

  // Direct Matching Tools across the platform
  const directMatchingTools = useMemo<DirectMatchItem[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const matches: DirectMatchItem[] = [];

    toolCategories.forEach((category) => {
      // If filtering by specific category filter pill
      if (selectedCategoryFilter !== "all" && category.id !== selectedCategoryFilter) {
        return;
      }

      category.tools.forEach((tool) => {
        const nameLower = tool.name.toLowerCase();
        const descLower = tool.description.toLowerCase();
        let relevance = 0;

        if (nameLower === query) {
          relevance = 100;
        } else if (nameLower.startsWith(query)) {
          relevance = 85;
        } else if (nameLower.includes(query)) {
          relevance = 70;
        } else if (descLower.includes(query)) {
          relevance = 45;
        } else if (category.name.toLowerCase().includes(query)) {
          relevance = 25;
        }

        if (relevance > 0) {
          matches.push({ tool, category, relevance });
        }
      });
    });

    return matches.sort((a, b) => b.relevance - a.relevance);
  }, [searchQuery, selectedCategoryFilter]);

  // Similar and Related Tools (shown below direct matches)
  const similarTools = useMemo<Array<{ tool: Tool; category: ToolCategory }>>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const matchedToolIds = new Set(directMatchingTools.map((m) => m.tool.id));
    const matchedCategoryIds = new Set(directMatchingTools.map((m) => m.category.id));

    const similarList: Array<{ tool: Tool; category: ToolCategory }> = [];

    // Prioritize tools from the same categories as direct matches
    toolCategories.forEach((category) => {
      if (matchedCategoryIds.size > 0 ? matchedCategoryIds.has(category.id) : true) {
        category.tools.forEach((tool) => {
          if (!matchedToolIds.has(tool.id) && !similarList.some(s => s.tool.id === tool.id)) {
            similarList.push({ tool, category });
          }
        });
      }
    });

    // If still less than 6, pull from other categories
    if (similarList.length < 6) {
      toolCategories.forEach((category) => {
        category.tools.forEach((tool) => {
          if (!matchedToolIds.has(tool.id) && !similarList.some(s => s.tool.id === tool.id)) {
            similarList.push({ tool, category });
          }
        });
      });
    }

    return similarList.slice(0, 8);
  }, [searchQuery, directMatchingTools]);

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let filtered = toolCategories.filter(category => {
      if (selectedCategoryFilter !== "all" && category.id !== selectedCategoryFilter) {
        return false;
      }

      if (!query) return true;

      return (
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.tools.some(tool =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
        )
      );
    });

    // Sort categories
    switch (sortBy) {
      case "alphabetical":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "most-tools":
        return [...filtered].sort((a, b) => b.tools.length - a.tools.length);
      default:
        return filtered;
    }
  }, [searchQuery, selectedCategoryFilter, sortBy]);

  const hasActiveSearch = searchQuery.trim().length > 0;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SEOHelmet
        title="All Categories - Browse 200+ Free Online Tools"
        description={`Explore ${totalTools}+ free online tools across ${toolCategories.length} categories including PDF tools, image editors, calculators, text processors, security tools, and more. No signup required.`}
        keywords={["online tools categories", "free tools", "PDF tools", "image tools", "text tools", "calculators", "converters", "security tools", "developer tools", "finance tools"]}
        canonical="https://www.dailytools247.app/categories"
      />
      <Header />
      <main className="flex-1 overflow-x-hidden">
        {/* Enhanced Hero & Search Header Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-primary/5 py-14 sm:py-18 md:py-22">
          {/* Background Ambient Mesh */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute inset-0 h-full w-full stroke-primary/[0.04] [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]" aria-hidden="true">
              <defs>
                <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse" x="-1" y="-1">
                  <path d="M.5 24V.5H24" fill="none" strokeDasharray="0" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
            <div className="absolute -left-1/4 -top-1/4 h-[550px] w-[550px] rounded-full bg-primary/10 blur-3xl opacity-70" />
            <div className="absolute -right-1/4 -bottom-1/4 h-[550px] w-[550px] rounded-full bg-primary/5 blur-3xl opacity-60" />
          </div>

          <div className="container relative px-4">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm mb-6 justify-center"
            >
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground rotate-[-90deg]" />
              <span className="text-foreground font-medium">Categories</span>
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-4xl rounded-3xl border border-border/70 bg-background/70 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8 md:p-10"
            >
              {/* Top Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-sm"
              >
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Complete Tool Collection</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                All
                <span className="relative ml-2 sm:ml-3">
                  <span className="gradient-text">Categories</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 origin-left rounded-full bg-gradient-to-r from-primary to-primary/50"
                  />
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mx-auto mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-light"
              >
                Browse {totalTools}+ free online tools across {toolCategories.length} categories. Search any tool to jump right in.
              </motion.p>

              {/* Badges Count */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <Badge variant="secondary" className="rounded-full px-3.5 py-1 text-xs sm:text-sm bg-muted/80 backdrop-blur-sm border border-border/80">
                  <Layers className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  {toolCategories.length} Categories
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3.5 py-1 text-xs sm:text-sm bg-muted/80 backdrop-blur-sm border border-border/80">
                  <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  {totalTools}+ Tools
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3.5 py-1 text-xs sm:text-sm bg-muted/80 backdrop-blur-sm border border-border/80">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  No Signup Required
                </Badge>
              </div>

              {/* Glass Search & Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 sm:mt-10 mx-auto max-w-2xl"
              >
                <div className="relative group">
                  <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="text"
                    placeholder="Search specific tool (e.g. 'pdf to image', 'compress', 'calculator')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 sm:h-16 border-2 border-border/80 bg-background/90 pl-12 pr-12 text-base shadow-xl backdrop-blur-md transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      title="Clear search"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Quick Filter Pills */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">Quick:</span>
                  {popularPills.map((pill) => {
                    const isActive = pill.query ? searchQuery.toLowerCase().includes(pill.query) : searchQuery === "";
                    return (
                      <button
                        key={pill.label}
                        type="button"
                        onClick={() => {
                          setSearchQuery(pill.query);
                          setSelectedCategoryFilter("all");
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>

                {/* Filter & Sorting Options */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 rounded-2xl bg-muted/50 backdrop-blur-md border border-border/80 text-left space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Sort Categories:</span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSortBy("default")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                              sortBy === "default"
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-background border border-border text-muted-foreground hover:bg-background/80"
                            }`}
                          >
                            Default Order
                          </button>
                          <button
                            onClick={() => setSortBy("alphabetical")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                              sortBy === "alphabetical"
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-background border border-border text-muted-foreground hover:bg-background/80"
                            }`}
                          >
                            A-Z Alphabetical
                          </button>
                          <button
                            onClick={() => setSortBy("most-tools")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                              sortBy === "most-tools"
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-background border border-border text-muted-foreground hover:bg-background/80"
                            }`}
                          >
                            Most Tools First
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* View Mode Toggle & Results Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-6"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
                  {hasActiveSearch ? (
                    <span>
                      Found <strong className="text-foreground">{directMatchingTools.length}</strong> direct matching tool(s) across <strong className="text-foreground">{filteredCategories.length}</strong> categories
                    </span>
                  ) : (
                    <span>
                      Showing <strong className="text-foreground">{filteredCategories.length}</strong> categories
                    </span>
                  )}
                </div>
                
                <div className="hidden gap-2 md:flex bg-muted/60 p-1 rounded-xl border border-border/55 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-background text-foreground shadow-md border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                    <span>Grid View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-background text-foreground shadow-md border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    <span>Detailed List</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-background/50">
          <div className="container px-4 space-y-12">
            
            {/* 1. TOP FIRST: CATEGORIES LISTING SECTION */}
            <div ref={categoriesResultsRef} className="space-y-6 scroll-mt-28">
              {hasActiveSearch && (
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                    <Compass className="h-5 w-5 text-primary" />
                    Categories Matching "{searchQuery}"
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    Showing categories containing relevant tools
                  </span>
                </div>
              )}

              {/* No Categories Result */}
              {filteredCategories.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 sm:py-20"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted border border-border/60">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">No categories found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8 font-light">
                    Try adjusting your search query or clear filters to see all tool categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategoryFilter("all");
                      setSortBy("default");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 shadow-lg font-medium"
                  >
                    <X className="h-4 w-4" />
                    Clear search and filters
                  </button>
                </motion.div>
              )}

              {/* Categories Cards */}
              <div className={viewMode === "grid" ? "grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-6 sm:space-y-8"}>
                <AnimatePresence mode="popLayout">
                  {filteredCategories.map((category, categoryIndex) => {
                    const Icon = category.icon;
                    const query = searchQuery.trim().toLowerCase();

                    // Split tools into matching tools & other tools when searching
                    const matchingTools = query
                      ? category.tools.filter(t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query))
                      : category.tools;

                    const otherCategoryTools = query
                      ? category.tools.filter(t => !matchingTools.some(m => m.id === t.id))
                      : [];

                    const isExpanded = expandedCategories[category.id] || false;

                    return (
                      <motion.div
                        key={category.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ 
                          delay: Math.min(categoryIndex * 0.04, 0.25),
                          layout: { duration: 0.3 }
                        }}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        style={{ 
                          borderColor: hoveredCategory === category.id ? `hsl(${category.color} / 0.4)` : `hsl(${category.color} / 0.15)`,
                          boxShadow: hoveredCategory === category.id 
                            ? `0 20px 40px -15px hsl(${category.color} / 0.15), 0 0 0 1px hsl(${category.color} / 0.2)` 
                            : `0 4px 20px -2px hsl(${category.color} / 0.03)`,
                          background: hoveredCategory === category.id
                            ? `linear-gradient(145deg, hsl(${category.color} / 0.04) 0%, hsl(var(--card)) 100%)`
                            : `linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.12) 100%)`,
                          transform: hoveredCategory === category.id ? 'translateY(-3px)' : 'none',
                          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        className="group relative rounded-2xl border p-5 sm:p-6"
                      >
                        {/* Glow ambient circle background */}
                        <div 
                          className="absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl opacity-20 transition-opacity duration-500 pointer-events-none"
                          style={{ 
                            backgroundColor: `hsl(${category.color})`,
                            opacity: hoveredCategory === category.id ? 0.35 : 0.1 
                          }}
                        />

                        {/* Category Header */}
                        <div className="flex flex-col gap-4 mb-6 relative z-10">
                          <div className="flex items-start gap-4">
                            <div
                              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-sm"
                              style={{ backgroundColor: `hsl(${category.color} / 0.15)` }}
                            >
                              <Icon
                                className="h-7 w-7"
                                style={{ color: `hsl(${category.color})` }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 mb-1.5">
                                <h2 className="text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight">
                                  {category.name}
                                </h2>
                                <Badge 
                                  variant="secondary" 
                                  className="hidden sm:inline-flex text-xs bg-muted/85 border border-border"
                                >
                                  {category.tools.length} tools
                                </Badge>
                              </div>
                              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light">
                                {category.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-t border-border/40 pt-4 mt-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                <Zap className="h-3.5 w-3.5" />
                                {matchingTools.length} {matchingTools.length === 1 ? 'tool' : 'tools'} {hasActiveSearch && 'matching'}
                              </span>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Free Online
                              </span>
                            </div>
                            <Link
                              to={`/category/${category.id}`}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-all hover:gap-2"
                            >
                              Explore all {category.name}
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>

                        {/* Tools Grid/List inside Category */}
                        {matchingTools.length > 0 ? (
                          <div className={viewMode === "grid" ? "space-y-2.5 relative z-10" : "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10"}>
                            {matchingTools.map((tool, toolIndex) => (
                              <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: toolIndex * 0.02 }}
                              >
                                <Link
                                  to={tool.path}
                                  onMouseEnter={() => setHoveredTool(tool.id)}
                                  onMouseLeave={() => setHoveredTool(null)}
                                  style={{
                                    borderColor: hoveredTool === tool.id ? `hsl(${category.color} / 0.4)` : 'hsl(var(--border) / 0.6)',
                                    backgroundColor: hoveredTool === tool.id ? `hsl(${category.color} / 0.06)` : 'hsl(var(--card))',
                                    boxShadow: hoveredTool === tool.id ? `0 8px 24px -8px hsl(${category.color} / 0.15)` : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                  }}
                                  className={viewMode === "grid"
                                    ? "group/tool flex items-center justify-between rounded-xl border p-3.5 transition-all min-h-[70px]"
                                    : "flex flex-col p-4 rounded-xl border min-h-[110px] justify-between h-full group/tool"
                                  }
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="block font-semibold text-sm text-card-foreground group-hover/tool:text-primary transition-colors leading-tight line-clamp-1">
                                        {tool.name}
                                      </span>
                                      {hasActiveSearch && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 border-primary/20 text-primary">
                                          Match
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="block text-xs text-muted-foreground mt-1 font-light leading-relaxed line-clamp-2">
                                      {tool.description}
                                    </span>
                                  </div>
                                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/60 group-hover/tool:text-primary group-hover/tool:translate-x-1.5 transition-all mt-2 ml-auto" />
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center text-xs text-muted-foreground">
                            No direct matches in this category for "{searchQuery}".
                          </div>
                        )}

                        {/* Collapsible Other Category Tools when Searching */}
                        {hasActiveSearch && otherCategoryTools.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border/40 relative z-10">
                            <button
                              type="button"
                              onClick={() => toggleCategoryExpand(category.id)}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-muted/40 hover:bg-muted/70 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <span className="flex items-center gap-2">
                                <Tag className="h-3.5 w-3.5 text-primary" />
                                {isExpanded
                                  ? `Hide remaining ${otherCategoryTools.length} tools in ${category.name}`
                                  : `+ Show ${otherCategoryTools.length} other tools in ${category.name}`}
                              </span>
                              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                                >
                                  {otherCategoryTools.map((tool) => (
                                    <Link
                                      key={`other-${tool.id}`}
                                      to={tool.path}
                                      className="p-3 rounded-lg border border-border/50 bg-background/60 hover:bg-background hover:border-border text-left transition-all group/other"
                                    >
                                      <span className="block font-medium text-xs text-foreground group-hover/other:text-primary transition-colors truncate">
                                        {tool.name}
                                      </span>
                                      <span className="block text-[11px] text-muted-foreground truncate mt-0.5 font-light">
                                        {tool.description}
                                      </span>
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* SEARCH ACTIVE SECTIONS: Direct Matches & Similar Tools */}
            {hasActiveSearch && (
              <div className="space-y-12 pt-6">
                {/* 2. SECOND: DIRECT TOOL MATCHES SECTION */}
                {directMatchingTools.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                  >
                    {/* Glowing background light */}
                    <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary mb-2 border border-primary/30">
                          <Flame className="h-3.5 w-3.5 fill-primary text-primary" />
                          <span>Direct Match</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                          Direct Tool Matches for "{searchQuery}"
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Showing exact tools matching your search term. Click any tool to launch immediately.
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs bg-background/80 border-primary/30 px-3 py-1 font-semibold text-primary">
                        {directMatchingTools.length} {directMatchingTools.length === 1 ? 'Tool' : 'Tools'} Found
                      </Badge>
                    </div>

                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
                      {directMatchingTools.map(({ tool, category }, idx) => {
                        const CatIcon = category.icon;
                        return (
                          <motion.div
                            key={`direct-${tool.id}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.04 }}
                          >
                            <Link
                              to={tool.path}
                              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-primary/25 bg-background/90 shadow-md hover:shadow-2xl hover:border-primary transition-all duration-300 hover:-translate-y-1.5 h-full overflow-hidden"
                              style={{
                                boxShadow: `0 10px 30px -10px hsl(${category.color} / 0.15)`
                              }}
                            >
                              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                              
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `hsl(${category.color} / 0.12)`, color: `hsl(${category.color})` }}>
                                    <CatIcon className="h-3.5 w-3.5" />
                                    <span>{category.name}</span>
                                  </div>
                                  <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    Exact Match
                                  </span>
                                </div>

                                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                                  {tool.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-light leading-relaxed line-clamp-3">
                                  {tool.description}
                                </p>
                              </div>

                              <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Ready to use
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                                  Launch Tool
                                  <ArrowUpRight className="h-4 w-4" />
                                </span>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 px-6 rounded-3xl border border-border bg-card/60"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted border border-border/60">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No exact tool matches found for "{searchQuery}"</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
                      Check your spelling or explore the categories and similar tools below.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all text-sm font-medium shadow-md"
                    >
                      <X className="h-4 w-4" />
                      Clear search
                    </button>
                  </motion.div>
                )}

                {/* 3. THIRD: SIMILAR & RELATED TOOLS SECTION */}
                {similarTools.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-8 backdrop-blur-md"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 border border-amber-500/20">
                          <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>Recommended</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                          Similar & Related Tools
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Other tools related to your search that you might find useful
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {similarTools.map(({ tool, category }, idx) => (
                        <motion.div
                          key={`similar-${tool.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <Link
                            to={tool.path}
                            className="group flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-background/80 hover:bg-background hover:border-primary/40 hover:shadow-lg transition-all duration-200 h-full"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[11px] font-semibold text-muted-foreground truncate">
                                  {category.name}
                                </span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground">
                                  Similar
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {tool.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-light">
                                {tool.description}
                              </p>
                            </div>

                            <div className="mt-3 flex items-center justify-end text-xs font-medium text-primary group-hover:translate-x-1 transition-transform">
                              <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

          </div>
        </section>

        {/* Enhanced Platform Stats Section */}
        <section className="border-t border-border bg-gradient-to-b from-muted/30 to-background py-12 sm:py-16 md:py-20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Platform Statistics
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
                Trusted by thousands of users worldwide with our comprehensive suite of professional tools
              </p>
            </motion.div>

            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative group"
              >
                <div className="text-center p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                  <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">{totalTools}+</p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Tools</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="text-center p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg">
                  <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                    <Grid3x3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">{toolCategories.length}</p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Categories</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative group"
              >
                <div className="text-center p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg">
                  <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                    <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-1">100%</p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Free Tools</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <div className="text-center p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg">
                  <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">10K+</p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Daily Users</p>
                </div>
              </motion.div>
            </div>

            {/* Additional Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 sm:mt-16 text-center max-w-3xl mx-auto"
            >
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 via-background to-primary/5 border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Why Choose Our Tools?</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 text-sm sm:text-base">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <p className="font-medium text-foreground">Easy to Use</p>
                    <p className="text-xs text-muted-foreground">Intuitive interfaces</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50">
                    <Zap className="h-6 w-6 text-primary" />
                    <p className="font-medium text-foreground">Lightning Fast</p>
                    <p className="text-xs text-muted-foreground">Instant results</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <p className="font-medium text-foreground">100% Secure</p>
                    <p className="text-xs text-muted-foreground">Privacy first</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <CategoryFAQSection faqs={universalToolFaqs} categoryName="tools" />
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
