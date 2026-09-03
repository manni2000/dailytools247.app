import { useState, useEffect } from "react";
import { Loader2, Clock, Sparkles } from "lucide-react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProcessingStateProps {
  isProcessing: boolean;
  progress?: number;
  message?: string;
  showTimer?: boolean;
  className?: string;
}

export const ProcessingState = ({
  isProcessing,
  progress,
  message = "Processing request...",
  showTimer = true,
  className,
}: ProcessingStateProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setElapsedTime(0);
      return;
    }

    if (showTimer) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isProcessing, showTimer]);

  if (!isProcessing) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-5 rounded-2xl border border-primary/20 bg-card/80 p-8 sm:p-10 text-center shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#0D1017]/90",
        className
      )}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-primary/10 blur-2xl animate-pulse" />

      {/* Spinner / Progress Ring */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-lg shadow-primary/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 max-w-sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <p className="text-sm sm:text-base font-bold text-foreground">{message}</p>
        </div>

        {progress !== undefined ? (
          <div className="w-full max-w-xs mx-auto pt-1">
            <Progress value={progress} className="h-2 rounded-full" />
          </div>
        ) : (
          <div className="w-48 mx-auto h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        )}

        {showTimer && elapsedTime > 0 && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-mono pt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(elapsedTime)} elapsed</span>
          </div>
        )}

        {elapsedTime > 25 && (
          <p className="text-xs text-amber-500 font-light pt-1">
            Processing large file in local memory. Thank you for your patience...
          </p>
        )}
      </div>
    </motion.div>
  );
};

interface InlineLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const InlineLoading = ({ message, size = "md" }: InlineLoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {message && <span className="text-xs sm:text-sm text-muted-foreground">{message}</span>}
    </div>
  );
};
