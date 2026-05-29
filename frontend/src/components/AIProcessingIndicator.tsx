import { useEffect, useState } from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIProcessingIndicatorProps {
  steps: string[];
  onComplete: () => void;
  durationPerStep?: number;
}

export default function AIProcessingIndicator({
  steps,
  onComplete,
  durationPerStep = 800,
}: AIProcessingIndicatorProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    
    if (currentStep < steps.length) {
      stepTimer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, durationPerStep);
    } else {
      // Small buffer before completing to let the user see the final checkmark
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(completeTimer);
    }

    return () => clearTimeout(stepTimer);
  }, [currentStep, steps.length, durationPerStep, onComplete]);

  const progressPercent = Math.min((currentStep / steps.length) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-6 shadow-xl relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl animate-pulse" />
      <div className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl animate-pulse" />

      <div className="relative flex flex-col items-center text-center space-y-6">
        {/* Animated Icon Header */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
            AI Engine Processing
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Running smart semantic algorithms to format optimal results...
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-md bg-muted rounded-full h-2 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>

        {/* Step-by-Step Task List */}
        <div className="w-full max-w-md text-left space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={index}
                className={`flex items-start gap-3 transition-colors duration-300 ${
                  isActive ? "text-foreground font-medium" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-600"
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </motion.div>
                  ) : isActive ? (
                    <div className="flex h-5 w-5 items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-muted-foreground/20 text-muted-foreground/30 text-[10px]">
                      {index + 1}
                    </div>
                  )}
                </div>
                <span className="text-sm leading-tight">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
