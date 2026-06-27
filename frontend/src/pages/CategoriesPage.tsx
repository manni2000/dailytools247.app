import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Grid3x3, 
  List, 
  Star, 
  TrendingUp, 
  Zap, 
  Search, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toolCategories, getAllTools } from "@/data/toolCategories";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEOHelmet from "@/components/SEOHelmet";
import { useIsMobile } from "@/hooks/use-mobile";
import { universalToolFaqs } from "@/data/toolSeoEnhancements";
import CategoryFAQSection from "@/components/CategoryFAQSection";

type SortOption = "alphabetical" | "most-tools" | "default";

const CategoriesPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const totalTools = getAllTools().length;

  useEffect(() => {
    if (isMobile && viewMode !== "list") {
      setViewMode("list");
    }
  }, [isMobile, viewMode]);

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let filtered = toolCategories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.tools.some(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    // Sort categories
    switch (sortBy) {
      case "alphabetical":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "most-tools":
        return [...filtered].sort((a, b) => b.tools.length - a.tools.length);
      default:
        return filtered;
    }
  }, [searchQuery, sortBy]);

  const popularTools = getAllTools().slice(0, 6);

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
        {/* Enhanced Header Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-primary/5 py-16 sm:py-20 md:py-24">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute inset-0 h-full w-full stroke-primary/[0.04] [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]" aria-hidden="true">
              <defs>
                <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse" x="-1" y="-1">
                  <path d="M.5 24V.5H24" fill="none" strokeDasharray="0" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
            <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl opacity-60" />
            <div className="absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl opacity-50" />
          </div>

          <div className="container relative px-4">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm mb-6 sm:mb-8 justify-center"
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
              className="mx-auto max-w-4xl rounded-3xl border border-border/70 bg-background/60 p-6 text-center shadow-xl backdrop-blur-md sm:p-8 md:p-10"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-4 sm:mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Complete Tool Collection</span>
                <span className="sm:hidden">All Tools</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                All
                <span className="relative ml-1 sm:ml-2">
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
                className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-light"
              >
                Browse {totalTools}+ professional tools across {toolCategories.length} categories
              </motion.p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs sm:text-sm bg-muted/60 backdrop-blur-sm border border-border">
                  {toolCategories.length} Categories
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs sm:text-sm bg-muted/60 backdrop-blur-sm border border-border">
                  {totalTools}+ Tools
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs sm:text-sm bg-muted/60 backdrop-blur-sm border border-border">
                  No Signup Required
                </Badge>
              </div>

              {/* Search & Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 sm:mt-10 mx-auto max-w-2xl"
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5" />
                  <Input
                    type="text"
                    placeholder="Search categories or tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 border-2 bg-background/90 pl-11 pr-20 text-sm shadow-md backdrop-blur-sm transition-all focus:border-primary sm:h-14 sm:text-base rounded-2xl"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      title="Clear search"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-14 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Toggle filters"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-300 ${
                      showFilters ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <SlidersHorizontal className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Filter Options */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/80 text-left"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className="text-sm font-medium text-foreground">Sort by:</span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSortBy("default")}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                              sortBy === "default"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                                : "bg-background border border-border text-muted-foreground hover:bg-background/80"
                            }`}
                          >
                            Default
                          </button>
                          <button
                            onClick={() => setSortBy("alphabetical")}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                              sortBy === "alphabetical"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                                : "bg-background border border-border text-muted-foreground hover:bg-background/80"
                            }`}
                          >
                            A-Z
                          </button>
                          <button
                            onClick={() => setSortBy("most-tools")}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                              sortBy === "most-tools"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                                : "bg-background border border-border text-muted-foreground hover:bg-background/80"
                            }`}
                          >
                            Most Tools
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* View Mode Toggle & Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-6"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
                  <span>
                    Showing {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
                  </span>
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

        {/* Categories Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-background/50">
          <div className="container px-4">
            {/* No Results State */}
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
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSortBy("default");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 shadow-lg shadow-primary/10 font-medium"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              </motion.div>
            )}

            {/* Categories List */}
            <div className={viewMode === "grid" ? "grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3" : "space-y-6 sm:space-y-8"}>
              <AnimatePresence mode="popLayout">
                {filteredCategories.map((category, categoryIndex) => {
                  const Icon = category.icon;
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
                        borderColor: hoveredCategory === category.id ? `hsl(${category.color} / 0.35)` : `hsl(${category.color} / 0.12)`,
                        boxShadow: hoveredCategory === category.id 
                          ? `0 20px 40px -15px hsl(${category.color} / 0.12), 0 0 0 1px hsl(${category.color} / 0.15)` 
                          : `0 4px 20px -2px hsl(${category.color} / 0.02)`,
                        background: hoveredCategory === category.id
                          ? `linear-gradient(145deg, hsl(${category.color} / 0.03) 0%, hsl(var(--card)) 100%)`
                          : `linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.1) 100%)`,
                        transform: hoveredCategory === category.id ? 'translateY(-4px)' : 'none',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="group relative rounded-2xl border p-5 sm:p-6"
                    >
                      {/* Glow ring background */}
                      <div 
                        className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 pointer-events-none"
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pl-0 sm:pl-18 border-t border-border/40 pt-4 mt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              <Zap className="h-3.5 w-3.5" />
                              {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              100% Free
                            </span>
                          </div>
                          <Link
                            to={`/category/${category.id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-all hover:gap-2"
                          >
                            Explore category
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Tools Grid/List */}
                      {viewMode === "grid" ? (
                        <div className="space-y-2.5 sm:space-y-3 relative z-10">
                          {category.tools.map((tool, toolIndex) => (
                            <motion.div
                              key={tool.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: toolIndex * 0.02 }}
                            >
                              <Link
                                to={tool.path}
                                onMouseEnter={() => setHoveredTool(tool.id)}
                                onMouseLeave={() => setHoveredTool(null)}
                                style={{
                                  borderColor: hoveredTool === tool.id ? `hsl(${category.color} / 0.35)` : 'hsl(var(--border) / 0.5)',
                                  backgroundColor: hoveredTool === tool.id ? `hsl(${category.color} / 0.05)` : 'hsl(var(--card))',
                                  boxShadow: hoveredTool === tool.id ? `0 8px 20px -8px hsl(${category.color} / 0.12)` : 'none',
                                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                className="group/tool flex items-center justify-between rounded-xl border p-3.5 transition-all min-h-[70px]"
                              >
                                <div className="flex-1 min-w-0 pr-3">
                                  <span className="block font-semibold text-sm text-foreground group-hover/tool:text-primary truncate transition-colors">
                                    {tool.name}
                                  </span>
                                  <span className="block text-xs text-muted-foreground truncate mt-0.5 font-light">
                                    {tool.description}
                                  </span>
                                </div>
                                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/60 group-hover/tool:text-primary group-hover/tool:translate-x-1 transition-all" />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10">
                          {category.tools.map((tool, toolIndex) => (
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
                                  borderColor: hoveredTool === tool.id ? `hsl(${category.color} / 0.35)` : 'hsl(var(--border) / 0.5)',
                                  backgroundColor: hoveredTool === tool.id ? `hsl(${category.color} / 0.05)` : 'hsl(var(--card))',
                                  boxShadow: hoveredTool === tool.id ? `0 8px 24px -10px hsl(${category.color} / 0.15)` : 'none',
                                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                className="flex flex-col p-4 rounded-xl border min-h-[110px] justify-between h-full group/tool"
                              >
                                <div className="flex-1">
                                  <span className="block font-semibold text-sm text-card-foreground group-hover/tool:text-primary transition-colors leading-tight line-clamp-1">
                                    {tool.name}
                                  </span>
                                  <span className="block text-xs text-muted-foreground mt-1.5 font-light leading-relaxed line-clamp-2">
                                    {tool.description}
                                  </span>
                                </div>
                                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/60 group-hover/tool:text-primary group-hover/tool:translate-x-1.5 transition-all mt-3 ml-auto" />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
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
