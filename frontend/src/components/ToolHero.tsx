import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface Props {
  title: string;
  subtitle?: string;
  tags?: string[];
  Icon?: React.ComponentType<any>;
  categoryColor?: string;
}

const tagColors = [
  "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50",
  "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
  "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50",
  "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50",
  "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50",
  "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/50",
  "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50",
];

const ToolHero: React.FC<Props> = ({ title, subtitle, tags = [], Icon, categoryColor = "220 80% 60%" }) => {
  const IconComp = Icon;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-muted/50 via-background to-muted/30 p-6 sm:p-8"
    >
      <div
        className="absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl"
        style={{ backgroundColor: `hsl(${categoryColor} / 0.15)` }}
      />

      <div className="relative flex items-start gap-4">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: `hsl(${categoryColor} / 0.15)`,
            boxShadow: `0 8px 30px hsl(${categoryColor} / 0.3)`,
          }}
        >
          {IconComp ? <IconComp className="h-7 w-7" style={{ color: `hsl(${categoryColor})` }} /> : null}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((t, idx) => {
                const colorClass = tagColors[idx % tagColors.length];
                return (
                  <span
                    key={t}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ToolHero;
