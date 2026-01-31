import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";

interface TravelTransitionProps {
  isTransitioning: boolean;
  fromLocation?: string;
  toLocation?: string;
}

export function TravelTransition({ isTransitioning, fromLocation, toLocation }: TravelTransitionProps) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            <motion.div
              animate={{
                x: ["-100%", "100%"],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-6xl mb-6"
            >
              🚌
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-1 rounded-full mx-auto mb-4"
              style={{ background: 'linear-gradient(to right, var(--region-accent), var(--color-secondary), var(--region-accent))' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-sm uppercase tracking-widest"
            >
              Traveling to
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-display font-bold text-white mt-2"
            >
              {toLocation || "New Destination"}
            </motion.h2>
          </motion.div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  height: `${Math.random() * 100 + 50}px`,
                }}
                initial={{ y: "-100%", opacity: 0 }}
                animate={{
                  y: "100vh",
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 0.8,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 0.3
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
