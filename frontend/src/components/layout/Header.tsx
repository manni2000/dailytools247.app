import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wrench, Menu, X, ChevronDown, Search, Sparkles, ArrowRight, Layers, Code, Command } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toolCategories, getAllTools } from "@/data/toolCategories";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Global Keyboard listener (Cmd+K / Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const matchingTools = quickSearchQuery.trim()
    ? getAllTools().filter(t =>
      t.name.toLowerCase().includes(quickSearchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(quickSearchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm transition-all duration-300">
        <div className="container px-4">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden">
                <img
                  src="/dailytools247.webp"
                  alt="DailyTools247 logo"
                  className="h-28 w-28 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Wrench className="h-16 w-16 text-primary hidden" />
              </div>
              <div className="flex flex-col -ml-6">
                <span className="text-xl font-bold tracking-tight">
                  Daily<span className="text-primary">tools247</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Free Online Tools
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-1.5 lg:flex">
              <NavLink to="/" active={isActive("/")}>Home</NavLink>

              {/* Categories Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${location.pathname.startsWith("/category")
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                >
                  <Layers className="h-4 w-4 text-primary" />
                  Categories
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${showCategories ? "rotate-180 text-primary" : ""}`} />
                </button>

                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-full pt-3 -translate-x-1/2 z-50"
                    >
                      <div className="grid w-[720px] grid-cols-3 gap-1.5 rounded-3xl border border-border/80 bg-background/95 p-4 shadow-2xl backdrop-blur-2xl">
                        {toolCategories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <Link
                              key={category.id}
                              to={`/category/${category.id}`}
                              className="flex items-center gap-3 rounded-2xl p-2.5 transition-all hover:bg-primary/10 hover:border-primary/20 border border-transparent group/item"
                            >
                              <div
                                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-transform group-hover/item:scale-110 shadow-sm"
                                style={{ backgroundColor: `hsl(${category.color} / 0.15)` }}
                              >
                                <Icon className="h-4.5 w-4.5" style={{ color: `hsl(${category.color})` }} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-foreground group-hover/item:text-primary transition-colors truncate">
                                  {category.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-light truncate">
                                  {category.tools.length} free tools
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                        <div className="col-span-3 mt-2 pt-3 border-t border-border/50 flex items-center justify-between px-2 text-xs font-semibold text-primary">
                          <span className="text-muted-foreground font-light">Explore 200+ online utilities</span>
                          <Link to="/categories" className="flex items-center gap-1 hover:gap-2 transition-all">
                            View All Categories →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/categories" active={isActive("/categories")}>All Tools</NavLink>
              <NavLink to="/blogs" active={location.pathname.startsWith("/blogs")}>Blogs</NavLink>
              <NavLink to="/api-docs" active={isActive("/api-docs")}>
                <span className="flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-primary" />
                  API
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/30">NEW</span>
                </span>
              </NavLink>
            </nav>

            {/* Quick Header Tools Search & CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search trigger button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted hover:border-primary/40 text-xs text-muted-foreground transition-all duration-200"
              >
                <Search className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline font-medium">Search tools...</span>
                <span className="hidden md:inline-flex items-center gap-0.5 rounded bg-background px-1.5 py-0.5 text-[10px] font-semibold border border-border">
                  <Command className="h-2.5 w-2.5" /> K
                </span>
              </button>

              <Link
                to="/categories"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Explore Tools</span>
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                aria-label="Toggle Navigation Menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-background lg:hidden hover:bg-accent transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-2xl shadow-2xl"
            >
              <div className="container px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto">

                {/* Search Bar in Mobile Drawer */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search 200+ tools..."
                    value={quickSearchQuery}
                    onChange={(e) => setQuickSearchQuery(e.target.value)}
                    className="w-full h-11 pl-9 pr-4 rounded-xl border border-border bg-muted/50 text-sm focus:border-primary focus:outline-none"
                  />
                  {matchingTools.length > 0 && (
                    <div className="mt-2 space-y-1 rounded-xl border border-border bg-card p-2 shadow-lg">
                      {matchingTools.map(t => (
                        <Link
                          key={t.id}
                          to={t.path}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setQuickSearchQuery("");
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-accent text-xs font-medium text-foreground"
                        >
                          <span>{t.name}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-primary" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary Nav Links */}
                <div className="grid grid-cols-2 gap-2">
                  <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
                  <MobileNavLink to="/categories" onClick={() => setIsMenuOpen(false)}>All Categories</MobileNavLink>
                  <MobileNavLink to="/blogs" onClick={() => setIsMenuOpen(false)}>Blogs</MobileNavLink>
                  <MobileNavLink to="/api-docs" onClick={() => setIsMenuOpen(false)}>API Docs</MobileNavLink>
                </div>

                {/* Category List Accordion */}
                <div className="pt-3 border-t border-border/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Tool Categories</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {toolCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl p-2.5 border border-border/50 bg-card/60 hover:bg-accent transition-colors"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-xs font-bold text-foreground truncate">{category.name}</span>
                            <span className="text-[10px] text-muted-foreground">{category.tools.length} tools</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-3">
                  <Link
                    to="/categories"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    Browse All 200+ Tools
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Quick Search Modal Dialog */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-full max-w-xl rounded-3xl border border-primary/30 bg-card p-4 sm:p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Search className="h-4 w-4" />
                  <span>Search Online Tools</span>
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type tool name (e.g. 'pdf to image', 'compress', 'calculator')..."
                  value={quickSearchQuery}
                  onChange={(e) => setQuickSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-background text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Quick Results */}
              <div className="mt-4 max-h-72 overflow-y-auto space-y-2">
                {quickSearchQuery.trim().length > 0 ? (
                  matchingTools.length > 0 ? (
                    matchingTools.map((t) => (
                      <Link
                        key={`modal-${t.id}`}
                        to={t.path}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setQuickSearchQuery("");
                        }}
                        className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                      >
                        <div>
                          <span className="block font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                            {t.name}
                          </span>
                          <span className="block text-xs text-muted-foreground truncate font-light">
                            {t.description}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-center py-6 text-sm text-muted-foreground font-light">
                      No direct tools found matching "{quickSearchQuery}".
                    </p>
                  )
                ) : (
                  <div className="p-3 text-xs text-muted-foreground text-center">
                    Type any tool name or category to search instantly. Press <kbd className="px-1.5 py-0.5 rounded bg-muted border">ESC</kbd> to exit.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 text-center">
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigate(`/categories`);
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View All Categories Page →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${active
      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-foreground border border-border/60 bg-card hover:bg-primary/10 transition-colors"
  >
    <span>{children}</span>
    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
  </Link>
);

export default Header;
