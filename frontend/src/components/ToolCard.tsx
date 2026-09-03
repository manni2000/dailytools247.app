import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import { useUserTools } from "@/lib/userToolsStore";

export interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  path: string;
  categoryColor?: string;
  categoryName?: string;
  isTrending?: boolean;
  isNew?: boolean;
  delay?: number;
}

const ToolCard = forwardRef<HTMLDivElement, ToolCardProps>(
  (
    {
      id,
      name,
      description,
      path,
      categoryColor = "173 80% 40%",
      categoryName,
      isTrending = false,
      isNew = false,
      delay = 0,
    },
    ref
  ) => {
    const { isFavorite, toggleFavorite } = useUserTools();
    const isFav = isFavorite(path);

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(path);
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="group h-full"
      >
        <Link to={path} className="block h-full">
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#0D1017] dark:hover:border-primary/50 dark:hover:shadow-black/60">
            {/* Header row: Badge + Favorite button */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {categoryName && (
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
                    style={{
                      backgroundColor: `hsl(${categoryColor} / 0.1)`,
                      color: `hsl(${categoryColor})`,
                      borderColor: `hsl(${categoryColor} / 0.25)`,
                    }}
                  >
                    {categoryName}
                  </span>
                )}
                {isTrending && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-amber-500/20">
                    <Zap className="h-3 w-3" />
                    Popular
                  </span>
                )}
                {isNew && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/25">
                    <Sparkles className="h-3 w-3" />
                    New
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleFavoriteClick}
                aria-label={isFav ? "Remove favorite" : "Add to favorites"}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                  isFav
                    ? "border-amber-400/40 bg-amber-400/15 text-amber-500 opacity-100"
                    : "border-transparent text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${isFav ? "fill-amber-400" : ""}`} />
              </button>
            </div>

            {/* Body Content */}
            <div className="relative z-10 flex-1">
              <h3 className="text-base font-bold text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-1">
                {name}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Footer Action */}
            <div className="relative z-10 mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs font-semibold text-primary dark:border-white/5">
              <span className="text-muted-foreground text-[11px] font-normal">
                Instant Browser Run
              </span>
              <div className="flex items-center gap-1 transition-transform duration-200 group-hover:translate-x-1">
                <span>Open Tool</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }
);

ToolCard.displayName = "ToolCard";

export default ToolCard;
