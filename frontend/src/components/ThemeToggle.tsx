import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-xl border border-border/80 bg-background/50 ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card/80 text-foreground shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-muted/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          rotate: isDark ? 0 : 90,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="h-4.5 w-4.5 text-primary" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          rotate: isDark ? -90 : 0,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="h-4.5 w-4.5 text-amber-500" />
      </motion.div>
    </button>
  );
};
