import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Home,
  ShieldCheck,
  Lock,
  Cpu,
  Star,
  Bug,
  Mail,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { userToolsStore, useUserTools } from "@/lib/userToolsStore";

interface ToolLayoutProps {
  title?: string;
  description?: string;
  breadcrumbTitle?: string;
  category: string;
  categoryPath: string;
  toolSlug?: string;
  children: ReactNode;
}

const ToolLayout = ({
  title,
  description,
  breadcrumbTitle,
  category,
  categoryPath,
  children,
}: ToolLayoutProps) => {
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useUserTools();
  const toolName = breadcrumbTitle || title || "Browser Tool";
  const isFav = isFavorite(location.pathname);

  // Auto-record tool in user recent tools history
  useEffect(() => {
    if (toolName) {
      userToolsStore.addRecentTool({
        id: location.pathname.replace(/^\//, ""),
        path: location.pathname,
        name: toolName,
        category,
      });
    }
  }, [location.pathname, toolName, category]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main id="main-content" className="flex-1" role="main">
        {/* Sleek Tool Navigation & Meta Bar */}
        <div className="border-b border-border/50 bg-card/40 backdrop-blur-md">
          <div className="container px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-1.5 text-xs sm:text-sm overflow-x-auto scrollbar-none">
              <Link
                to="/"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
              <Link
                to={categoryPath}
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap font-medium"
              >
                {category}
              </Link>
              {toolName && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
                  <span className="text-foreground font-semibold whitespace-nowrap truncate max-w-[200px] sm:max-w-none">
                    {toolName}
                  </span>
                </>
              )}
            </nav>

            {/* Quick Badges & Favorite Action */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                100% Online Free
              </span>

              <button
                type="button"
                onClick={() => toggleFavorite(location.pathname)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                  isFav
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-500"
                    : "border-border/80 bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={isFav ? "Remove from Favorites" : "Save to Favorites"}
              >
                <Star
                  className={`h-3.5 w-3.5 ${isFav ? "fill-amber-400" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Optional Page Title Header */}
        {title ? (
          <section className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-background/50">
            <div className="container px-4 py-6 sm:py-8">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
                  {title}
                </h1>
                {description && (
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground font-light max-w-3xl leading-relaxed">
                    {description}
                  </p>
                )}
              </motion.div>
            </div>
          </section>
        ) : (
          breadcrumbTitle && <h1 className="sr-only">{breadcrumbTitle}</h1>
        )}

        {/* Workspace Canvas */}
        <section className="py-6 sm:py-10">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {children}
            </motion.div>
          </div>
        </section>

        {/* Modern Security & Architecture Trust Panel */}
        <section className="border-t border-border/40 bg-muted/20 py-10 mt-10">
          <div className="container px-4">
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border/40 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Security & Architecture</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Zero-Server Data Transmission Guarantee
                  </h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-background/80 border border-border/80 px-3 py-1.5 text-xs text-muted-foreground font-mono">
                  <Cpu className="h-3.5 w-3.5 text-primary" />
                  <span>Local WebAssembly & Web APIs</span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                    <Lock className="h-4 w-4 text-emerald-500" />
                    100% Client-Side Compute
                  </h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    All calculations, document transformations, and media formatting execute directly in your browser tab. Your files never touch external servers.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Ephemeral Memory
                  </h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Data exists strictly in volatile RAM memory during this session and is automatically purged the instant you close or reload the browser.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    No Limits & No Paywalls
                  </h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Unlimited usage with zero credit quotas, subscriptions, or watermarks. Built as open, fast digital utility tools.
                  </p>
                </div>
              </div>

              <div className="border-t border-border/50 mt-6 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <Link to="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                  <span className="text-border">•</span>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                  <span className="text-border">•</span>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    About DailyTools247
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:manishmandal9734@gmail.com?subject=Bug Report - ${toolName}`}
                    className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
                  >
                    <Bug className="h-3.5 w-3.5" />
                    Report a Bug
                  </a>
                  <span className="text-border">|</span>
                  <a
                    href={`mailto:manishmandal9734@gmail.com?subject=Feedback - ${toolName}`}
                    className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ToolLayout;
