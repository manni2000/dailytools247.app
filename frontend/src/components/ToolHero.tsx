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
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted/60 text-foreground/90 border border-border"
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
