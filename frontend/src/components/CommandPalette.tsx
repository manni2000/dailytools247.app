import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Clock,
  Star,
  Layers,
  Code,
  FileText,
  Terminal,
  BookOpen,
  X,
  CornerDownLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toolCategories, getAllTools, Tool } from "@/data/toolCategories";
import { useUserTools } from "@/lib/userToolsStore";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { recentTools, favorites, isFavorite, toggleFavorite } = useUserTools();

  const allTools = useMemo(() => getAllTools(), []);

  // Quick action items
  const quickActions = useMemo(
    () => [
      {
        id: "action-all-tools",
        name: "Explore All 200+ Tools",
        description: "Browse the full catalog with search & filters",
        icon: Layers,
        category: "Navigation",
        action: () => {
          navigate("/categories");
          onClose();
        },
      },
      {
        id: "action-api-docs",
        name: "Developer API Documentation",
        description: "Explore endpoints & WebAssembly APIs",
        icon: Terminal,
        category: "Developers",
        action: () => {
          navigate("/api-docs");
          onClose();
        },
      },
      {
        id: "action-blogs",
        name: "Engineering & Productivity Blogs",
        description: "Read tech guides, tool comparisons & workflows",
        icon: BookOpen,
        category: "Resources",
        action: () => {
          navigate("/blogs");
          onClose();
        },
      },
      {
        id: "action-toggle-theme",
        name: `Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Theme`,
        description: "Toggle UI appearance mode",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        category: "System",
        action: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
        },
      },
    ],
    [navigate, onClose, resolvedTheme, setTheme]
  );

  // Filtered tools
  const filteredTools = useMemo(() => {
    let list = allTools;
    if (selectedCategory !== "all") {
      const cat = toolCategories.find((c) => c.id === selectedCategory);
      if (cat) {
        list = cat.tools;
      }
    }

    if (!query.trim()) {
      return list.slice(0, 12);
    }

    const q = query.toLowerCase().trim();
    return list
      .filter((tool) => {
        const nameMatch = tool.name.toLowerCase().includes(q);
        const descMatch = tool.description?.toLowerCase().includes(q);
        return nameMatch || descMatch;
      })
      .slice(0, 24);
  }, [allTools, query, selectedCategory]);

  // Combined list for keyboard index selection
  const flatSelectableItems = useMemo(() => {
    if (query.trim().length > 0) {
      return filteredTools.map((tool) => ({
        type: "tool" as const,
        id: tool.id,
        item: tool,
      }));
    }

    const items: Array<
      | { type: "recent"; id: string; item: (typeof recentTools)[0] }
      | { type: "action"; id: string; item: (typeof quickActions)[0] }
      | { type: "tool"; id: string; item: Tool }
    > = [];

    // Add recent tools if available
    recentTools.slice(0, 3).forEach((r) => {
      items.push({ type: "recent", id: `recent-${r.id}`, item: r });
    });

    // Add quick actions
    quickActions.forEach((a) => {
      items.push({ type: "action", id: a.id, item: a });
    });

    // Add top featured tools
    filteredTools.slice(0, 6).forEach((t) => {
      items.push({ type: "tool", id: `tool-${t.id}`, item: t });
    });

    return items;
  }, [filteredTools, query, quickActions, recentTools]);

  // Reset selection index on filter/query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
      setSelectedCategory("all");
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (!resultsContainerRef.current) return;
    const activeEl = resultsContainerRef.current.querySelector(
      `[data-palette-index="${selectedIndex}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    if (flatSelectableItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatSelectableItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? flatSelectableItems.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = flatSelectableItems[selectedIndex];
      if (!current) return;

      if (current.type === "tool") {
        navigate(current.item.path);
        onClose();
      } else if (current.type === "recent") {
        navigate(current.item.path);
        onClose();
      } else if (current.type === "action") {
        current.item.action();
      }
    }
  };

  const getToolCategory = (toolId: string) => {
    return toolCategories.find((c) => c.tools.some((t) => t.id === toolId));
  };

  const categoryPills = [
    { id: "all", label: "All Tools" },
    { id: "ai", label: "AI" },
    { id: "pdf", label: "PDF" },
    { id: "image", label: "Image" },
    { id: "dev", label: "Developer" },
    { id: "finance", label: "Finance" },
    { id: "seo", label: "SEO" },
    { id: "security", label: "Security" },
    { id: "text", label: "Text" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity"
          />

          {/* Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl shadow-primary/5 dark:border-white/10 dark:bg-[#0D1017] dark:shadow-black/60"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-border/60 px-4 py-3.5 dark:border-white/10">
              <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 200+ utilities or jump to command..."
                className="w-full bg-transparent text-base font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border/80 bg-muted/60 px-2 py-0.5 text-[11px] font-mono text-muted-foreground ml-2">
                ESC
              </kbd>
            </div>

            {/* Quick Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/40 px-4 py-2 scrollbar-none dark:border-white/5">
              {categoryPills.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Results Container */}
            <div
              ref={resultsContainerRef}
              className="max-h-[380px] overflow-y-auto p-2 space-y-1 scrollbar-thin"
            >
              {flatSelectableItems.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-medium text-foreground">No matching tools found</p>
                  <p className="mt-1 text-xs text-muted-foreground font-light">
                    Try searching for another keyword like "compress", "pdf", or "json"
                  </p>
                </div>
              ) : (
                flatSelectableItems.map((entry, idx) => {
                  const isSelected = selectedIndex === idx;

                  if (entry.type === "recent") {
                    const r = entry.item;
                    return (
                      <div
                        key={entry.id}
                        data-palette-index={idx}
                        onClick={() => {
                          navigate(r.path);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted/60 text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isSelected ? "bg-primary-foreground/20" : "bg-muted"
                            }`}
                          >
                            <Clock
                              className={`h-4 w-4 ${
                                isSelected ? "text-primary-foreground" : "text-primary"
                              }`}
                            />
                          </div>
                          <div className="truncate">
                            <span className="block truncate">{r.name}</span>
                            <span
                              className={`block text-[11px] truncate ${
                                isSelected
                                  ? "text-primary-foreground/80 font-normal"
                                  : "text-muted-foreground font-light"
                              }`}
                            >
                              Recently used utility
                            </span>
                          </div>
                        </div>
                        <CornerDownLeft
                          className={`h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 ${
                            isSelected ? "opacity-100 text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                    );
                  }

                  if (entry.type === "action") {
                    const a = entry.item;
                    const Icon = a.icon;
                    return (
                      <div
                        key={entry.id}
                        data-palette-index={idx}
                        onClick={a.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted/60 text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isSelected ? "bg-primary-foreground/20" : "bg-muted"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                isSelected ? "text-primary-foreground" : "text-primary"
                              }`}
                            />
                          </div>
                          <div className="truncate">
                            <span className="block truncate">{a.name}</span>
                            <span
                              className={`block text-[11px] truncate ${
                                isSelected
                                  ? "text-primary-foreground/80 font-normal"
                                  : "text-muted-foreground font-light"
                              }`}
                            >
                              {a.description}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isSelected
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {a.category}
                        </span>
                      </div>
                    );
                  }

                  // Standard Tool Item
                  const tool = entry.item;
                  const cat = getToolCategory(tool.id);
                  const isFav = isFavorite(tool.path);

                  return (
                    <div
                      key={entry.id}
                      data-palette-index={idx}
                      onClick={() => {
                        navigate(tool.path);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isSelected ? "bg-primary-foreground/20" : "bg-primary/10"
                          }`}
                        >
                          <Sparkles
                            className={`h-4 w-4 ${
                              isSelected ? "text-primary-foreground" : "text-primary"
                            }`}
                          />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="block truncate font-medium">{tool.name}</span>
                            {isFav && (
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                            )}
                          </div>
                          <span
                            className={`block text-[11px] truncate ${
                              isSelected
                                ? "text-primary-foreground/80 font-normal"
                                : "text-muted-foreground font-light"
                            }`}
                          >
                            {tool.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        {cat && (
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                              isSelected
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {cat.name}
                          </span>
                        )}
                        <CornerDownLeft
                          className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 ${
                            isSelected ? "opacity-100 text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Status Bar */}
            <div className="flex items-center justify-between border-t border-border/40 bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground dark:border-white/5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono">↵</kbd> Select
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{allTools.length} total browser utilities</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
