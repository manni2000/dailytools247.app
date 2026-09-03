import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { Sparkles, Shield, Zap } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  tags?: string[];
  Icon?: React.ComponentType<any>;
  categoryColor?: string;
}

const ToolHero: React.FC<Props> = ({
  title,
  subtitle,
  tags = [],
  Icon,
  categoryColor = "173 80% 40%",
}) => {
  const IconComp = Icon;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-6 sm:p-8 shadow-md shadow-slate-900/5 backdrop-blur-xl"
    >
      {/* Subtle Category Ambient Radial Light */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl opacity-25"
        style={{ backgroundColor: `hsl(${categoryColor})` }}
      />

      <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {IconComp && (
          <motion.div
            whileHover={{ scale: 1.06, rotate: [0, -3, 3, 0] }}
            transition={{ duration: 0.3 }}
            className="flex h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center rounded-2xl border shadow-md shadow-black/5"
            style={{
              backgroundColor: `hsl(${categoryColor} / 0.12)`,
              borderColor: `hsl(${categoryColor} / 0.3)`,
            }}
          >
            <IconComp
              className="h-7 w-7 sm:h-8 sm:w-8"
              style={{ color: `hsl(${categoryColor})` }}
            />
          </motion.div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider border shadow-xs"
              style={{
                backgroundColor: `hsl(${categoryColor} / 0.08)`,
                color: `hsl(${categoryColor})`,
                borderColor: `hsl(${categoryColor} / 0.25)`,
              }}
            >
              <Sparkles className="h-3 w-3" />
              Verified Local Browser Tool
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-2xs"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ToolHero;
