import React from "react";
import { FileX, Inbox, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 sm:p-12 text-center backdrop-blur-sm dark:border-white/10 dark:bg-[#0D1017]/50",
        className
      )}
    >
      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-border/80 bg-background/80 text-muted-foreground shadow-sm mb-4">
        {icon || <Inbox className="h-7 w-7 text-primary/70" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm font-light leading-relaxed mb-5">
        {description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  );
};

export const NoFileSelected = ({
  message = "Please upload or drop a document to begin processing.",
}: {
  message?: string;
}) => {
  return (
    <EmptyState
      icon={<FileX className="h-7 w-7 text-primary/70" />}
      title="No File Selected"
      description={message}
    />
  );
};

export const NoResults = ({ searchTerm }: { searchTerm?: string }) => {
  return (
    <EmptyState
      icon={<Search className="h-7 w-7 text-primary/70" />}
      title="No Results Found"
      description={
        searchTerm
          ? `We couldn't find any tools matching "${searchTerm}". Try different keywords or browse our categories.`
          : "No utilities found matching your current filter criteria."
      }
    />
  );
};

export const NoData = ({
  message = "No calculated data or results available yet.",
}: {
  message?: string;
}) => {
  return (
    <EmptyState
      icon={<Inbox className="h-7 w-7 text-primary/70" />}
      title="No Data Available"
      description={message}
    />
  );
};
