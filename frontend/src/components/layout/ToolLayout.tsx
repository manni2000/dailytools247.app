import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, ShieldCheck, Lock, Trash2, HelpCircle, Bug, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

interface ToolLayoutProps {
  title?: string;
  description?: string;
  breadcrumbTitle?: string;
  category: string;
  categoryPath: string;
  toolSlug?: string;
  children: ReactNode;
}

const ToolLayout = ({ title, description, breadcrumbTitle, category, categoryPath, children }: ToolLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1" role="main">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-4">
            <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto">
              <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground whitespace-nowrap">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Link to={categoryPath} className="text-muted-foreground hover:text-foreground whitespace-nowrap">
                {category}
              </Link>
              {(breadcrumbTitle || title) && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground whitespace-nowrap">{breadcrumbTitle || title}</span>
                </>
              )}
            </nav>
          </div>
        </div>

        {title && (
          <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
            <div className="container py-6 sm:py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
                {description && <p className="mt-2 text-base sm:text-lg text-muted-foreground">{description}</p>}
              </motion.div>
            </div>
          </section>
        )}

        <section className="py-6 sm:py-8">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {children}
            </motion.div>
          </div>
        </section>

        {/* Privacy & Trust Guarantee Section */}
        <section className="border-t border-border/50 bg-muted/10 py-8 mt-8">
          <div className="container">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Privacy & Trust Guarantee
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-emerald-500" />
                    100% Local Processing
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All calculations, formatting, and file processing happen directly in your browser. We never upload or save your files, text, or keys to our servers.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Trash2 className="h-4 w-4 text-emerald-500" />
                    Zero File Retention
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your data is stored in temporary browser memory and is instantly destroyed as soon as you close or reload this tab. Your files never leave your device.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-emerald-500" />
                    Help & Resources
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Want to learn more? Read our <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link> or <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>. Learn <Link to="/about" className="text-primary hover:underline font-medium">About Us</Link> or email support at <a href="mailto:manishmandal9734@gmail.com" className="text-primary hover:underline font-medium font-mono">manishmandal9734@gmail.com</a>.
                  </p>
                </div>
              </div>
              <div className="border-t border-border mt-6 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Secure Client-Side Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:manishmandal9734@gmail.com?subject=Bug Report - ${breadcrumbTitle || title || "Tool"}`}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
                  >
                    <Bug className="h-3.5 w-3.5" />
                    Report a Bug
                  </a>
                  <span className="text-border">|</span>
                  <a
                    href={`mailto:manishmandal9734@gmail.com?subject=Feedback - ${breadcrumbTitle || title || "Tool"}`}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Contact Us
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
