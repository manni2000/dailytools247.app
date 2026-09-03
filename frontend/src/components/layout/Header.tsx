import { Link, useLocation } from "react-router-dom";
import { Wrench, Menu, X, ChevronDown, Sparkles, ArrowRight, Layers, Code, Sparkle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toolCategories } from "@/data/toolCategories";
import { CommandPalette } from "@/components/CommandPalette";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm transition-all duration-300">
        <div className="container px-4">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-3">
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
            <nav className="hidden items-center gap-1 lg:flex">
              <NavLink to="/" active={isActive("/")}>
                Home
              </NavLink>

              {/* Categories Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${location.pathname.startsWith("/category")
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                >
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Categories</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${showCategories ? "rotate-180 text-primary" : ""
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full pt-2 -translate-x-1/2 z-50"
                    >
                      <div className="grid w-[740px] grid-cols-3 gap-1.5 rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#0D1017]/95">
                        {toolCategories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <Link
                              key={category.id}
                              to={`/category/${category.id}`}
                              onClick={() => setShowCategories(false)}
                              className="flex items-center gap-3 rounded-xl p-2.5 transition-all hover:bg-primary/10 hover:border-primary/20 border border-transparent group/item"
                            >
                              <div
                                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-transform group-hover/item:scale-110 shadow-sm"
                                style={{
                                  backgroundColor: `hsl(${category.color} / 0.15)`,
                                }}
                              >
                                <Icon
                                  className="h-4 w-4"
                                  style={{ color: `hsl(${category.color})` }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors truncate">
                                  {category.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-light truncate">
                                  {category.tools.length} browser utilities
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                        <div className="col-span-3 mt-2 pt-2.5 border-t border-border/50 flex items-center justify-between px-2 text-xs font-semibold text-primary">
                          <span className="text-muted-foreground font-light">
                            200+ fast, client-side tools
                          </span>
                          <Link
                            to="/categories"
                            onClick={() => setShowCategories(false)}
                            className="flex items-center gap-1 hover:gap-1.5 transition-all"
                          >
                            View All Categories →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/categories" active={isActive("/categories")}>
                All Tools
              </NavLink>
              <NavLink to="/blogs" active={location.pathname.startsWith("/blogs")}>
                Blogs
              </NavLink>
              <NavLink to="/api-docs" active={isActive("/api-docs")}>
                <span className="flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-primary" />
                  <span>API</span>
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[9px] font-bold text-primary border border-primary/30">
                    NEW
                  </span>
                </span>
              </NavLink>
            </nav>

            {/* Actions: CTA & Mobile Menu */}
            <div className="flex items-center gap-2.5">
              {/* Explore Tools CTA */}
              <Link
                to="/categories"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-teal-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Explore Tools</span>
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                aria-label="Toggle Navigation Menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card/80 lg:hidden hover:bg-muted transition-colors text-foreground"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              <div className="container px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">

                {/* Primary Nav Links */}
                <div className="grid grid-cols-2 gap-2">
                  <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </MobileNavLink>
                  <MobileNavLink to="/categories" onClick={() => setIsMenuOpen(false)}>
                    All Tools
                  </MobileNavLink>
                  <MobileNavLink to="/blogs" onClick={() => setIsMenuOpen(false)}>
                    Blogs
                  </MobileNavLink>
                  <MobileNavLink to="/api-docs" onClick={() => setIsMenuOpen(false)}>
                    API Docs
                  </MobileNavLink>
                </div>

                {/* Category Grid */}
                <div className="pt-3 border-t border-border/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Categories
                  </p>
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
                            <span className="block text-xs font-bold text-foreground truncate">
                              {category.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {category.tools.length} utilities
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-2">
                  <Link
                    to="/categories"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    <span>Browse All Tools</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Universal Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
};

const NavLink = ({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${active
      ? "bg-primary/10 text-primary border border-primary/20 shadow-xs"
      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground border border-border/60 bg-card hover:bg-primary/10 transition-colors"
  >
    <span>{children}</span>
    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
  </Link>
);

export default Header;
