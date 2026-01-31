import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface NeonFactsBannerProps {
  facts: string[];
  tourName: string;
}

export function NeonFactsBanner({ facts, tourName }: NeonFactsBannerProps) {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    if (facts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [facts.length]);

  useEffect(() => {
    setCurrentFactIndex(0);
  }, [tourName]);

  if (facts.length === 0) return null;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 animate-pulse" />

      <div className="relative glass border-y border-primary/30 py-2 px-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider hidden sm:inline">
              Fun Fact
            </span>
          </div>

          <div className="flex-1 overflow-hidden relative min-h-[20px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFactIndex}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  duration: 0.5
                }}
                className="whitespace-nowrap"
              >
                <span className="text-sm text-white/90 font-medium">
                  {facts[currentFactIndex]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-shrink-0 flex gap-1">
            {facts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFactIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentFactIndex
                    ? 'bg-primary scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                data-testid={`fact-dot-${idx}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
        style={{
          animation: 'shimmer 2s linear infinite',
          width: '100%'
        }}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
