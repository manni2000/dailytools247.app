import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  toolCount: number;
  delay?: number;
}

const CategoryCard = ({
  id,
  name,
  description,
  icon: Icon,
  color,
  toolCount,
  delay = 0,
}: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="group h-full"
    >
      <Link to={`/category/${id}`} className="block h-full">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#0D1017] dark:hover:border-primary/50 dark:hover:shadow-black/60">

          <div>
            {/* Icon Header */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-sm"
                style={{
                  backgroundColor: `hsl(${color} / 0.12)`,
                  border: `1px solid hsl(${color} / 0.25)`,
                }}
              >
                <Icon className="h-6 w-6" style={{ color: `hsl(${color})` }} />
              </div>

              <span
                className="rounded-full px-3 py-1 text-xs font-bold border"
                style={{
                  backgroundColor: `hsl(${color} / 0.1)`,
                  color: `hsl(${color})`,
                  borderColor: `hsl(${color} / 0.25)`,
                }}
              >
                {toolCount} {id === "ai" ? "AI Models" : "Utilities"}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
              {name}
            </h3>

            {/* Description */}
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          {/* Footer Arrow Action */}
          <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3.5 text-xs font-semibold text-primary dark:border-white/5">
            <span className="text-muted-foreground text-[11px] font-normal">
              100% Free & Private
            </span>
            <div className="flex items-center gap-1 transition-transform duration-200 group-hover:translate-x-1">
              <span>Explore tools</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
