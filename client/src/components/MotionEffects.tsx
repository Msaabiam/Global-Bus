import { motion } from "framer-motion";

export function SpeedEffects({ intensity = 1 }: { intensity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`light-${i}`}
          className="absolute top-0 h-full w-[200px] bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-x-12 blur-xl"
          initial={{ left: "120%" }}
          animate={{ left: "-20%" }}
          transition={{
            duration: 2 / intensity,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear",
          }}
        />
      ))}

      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-[2px] w-[100px] bg-white/20 blur-[1px] rounded-full"
          style={{ top: `${Math.random() * 100}%` }}
          initial={{ left: "120%", opacity: 0 }}
          animate={{ left: "-20%", opacity: [0, 1, 0] }}
          transition={{
            duration: 0.5 / intensity,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export function BusVibration({ children, isMoving = true }: { children: React.ReactNode, isMoving?: boolean }) {
  return (
    <motion.div
      animate={isMoving ? {
        y: [0, 1, 0, -1, 0],
        x: [0, -1, 0, 1, 0],
      } : {}}
      transition={{
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "linear"
      }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
