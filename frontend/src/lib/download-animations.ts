/**
 * Download-specific animations and transitions
 * Provides smooth, professional animations for download actions
 */

export const downloadAnimations = {
  // Button press animation
  buttonPress: {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    transition: { duration: 0.1 },
  },

  // Download complete animation
  downloadComplete: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  },

  // Progress animation
  progress: {
    initial: { width: 0 },
    animate: { width: '100%' },
    transition: { duration: 2.5, ease: 'easeInOut' },
  },

  // File icon animation
  fileIcon: {
    initial: { scale: 0, rotate: -45 },
    animate: { scale: 1, rotate: 0 },
    transition: { duration: 0.3, type: 'spring', stiffness: 200 },
  },

  // Format badge animation
  formatBadge: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2, delay: 0.1 },
  },

  // Checkmark animation (successful download)
  checkmark: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3, type: 'spring', stiffness: 300 },
  },

  // Spinner animation
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
  },

  // Download card entrance
  cardEntrance: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },

  // Hover scale
  hoverScale: {
    initial: { scale: 1 },
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },

  // Pulse animation (for active downloads)
  pulse: {
    animate: { opacity: [1, 0.7, 1] },
    transition: { duration: 1.5, repeat: Infinity },
  },

  // Success bounce
  successBounce: {
    animate: { y: [-5, 0, -2, 0] },
    transition: { duration: 0.5, times: [0, 0.33, 0.66, 1] },
  },

  // Slide in from right
  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },

  staggerChild: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },

  // Size pulse (emphasize action)
  sizePulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 0.6, repeat: Infinity },
  },

  // Icon rotate
  iconRotate: {
    animate: { rotate: [0, -5, 5, 0] },
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1 },
  },
};

/**
 * Get animation for a specific download state
 */
export function getDownloadStateAnimation(state: 'idle' | 'loading' | 'success' | 'error') {
  switch (state) {
    case 'loading':
      return downloadAnimations.progress;
    case 'success':
      return downloadAnimations.successBounce;
    case 'error':
      return { animate: { x: [-5, 5, -5, 0], transition: { duration: 0.4 } } };
    case 'idle':
    default:
      return downloadAnimations.fadeIn;
  }
}

/**
 * CSS-in-JS animation variants for Tailwind
 */
export const downloadKeyframes = `
  @keyframes download-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @keyframes download-spinner {
    to { transform: rotate(360deg); }
  }

  @keyframes download-slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes download-scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes download-success-bounce {
    0% { transform: translateY(0); }
    25% { transform: translateY(-5px); }
    50% { transform: translateY(0); }
    75% { transform: translateY(-2px); }
    100% { transform: translateY(0); }
  }

  @keyframes download-shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

/**
 * Tailwind animation classes
 */
export const downloadAnimationClasses = {
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  slideUp: 'animation-download-slide-up',
  scaleIn: 'animation-download-scale-in',
  successBounce: 'animation-download-success-bounce',
};

/**
 * Hook-friendly animation config
 */
export const animationConfig = {
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 1,
  },
  delay: {
    none: 0,
    fast: 0.1,
    normal: 0.2,
    slow: 0.5,
  },
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

/**
 * Create custom download animation
 */
export function createDownloadAnimation(
  duration: number = 0.3,
  delay: number = 0,
  easing: string = 'ease-out'
) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration,
      delay,
      ease: easing,
    },
  };
}

/**
 * Combine animations
 */
export function combineAnimations(...animations: any[]) {
  return {
    animate: Object.assign({}, ...animations.map((a) => a.animate)),
    transition: animations[animations.length - 1]?.transition,
  };
}
