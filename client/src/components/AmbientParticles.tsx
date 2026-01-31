import { motion } from "framer-motion";
import { useMemo } from "react";

type ParticleType = "cherry_blossom" | "stars" | "golden_dust" | "city_lights" | "palm_leaves" | "default";

interface AmbientParticlesProps {
  type: ParticleType;
  count?: number;
}

const PARTICLE_CONFIGS: Record<ParticleType, { emoji?: string; color?: string; size: string; speed: number }> = {
  cherry_blossom: { emoji: "🌸", size: "text-lg", speed: 8 },
  stars: { color: "bg-white", size: "w-1 h-1", speed: 15 },
  golden_dust: { color: "bg-amber-400/60", size: "w-1.5 h-1.5", speed: 10 },
  city_lights: { color: "bg-cyan-400/40", size: "w-2 h-2", speed: 12 },
  palm_leaves: { emoji: "🌴", size: "text-sm", speed: 20 },
  default: { color: "bg-white/30", size: "w-1 h-1", speed: 12 }
};

export function AmbientParticles({ type, count = 15 }: AmbientParticlesProps) {
  const config = PARTICLE_CONFIGS[type] || PARTICLE_CONFIGS.default;

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * config.speed,
      duration: config.speed + Math.random() * 5,
      size: 0.5 + Math.random() * 0.5
    })),
    [count, config.speed]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${config.emoji ? config.size : `${config.size} ${config.color} rounded-full`}`}
          style={{
            left: `${particle.left}%`,
            scale: particle.size,
          }}
          initial={{ y: "-10%", opacity: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 1, 1, 0],
            x: type === "cherry_blossom" ? [0, 20, -20, 10, 0] : 0,
            rotate: type === "cherry_blossom" ? [0, 180, 360] : 0,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {config.emoji}
        </motion.div>
      ))}

      {type === "stars" && (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={`twinkle-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 40}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 3,
                repeat: Infinity,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

export function getParticleType(regionId: string): ParticleType {
  switch (regionId) {
    case "tokyo":
      return "cherry_blossom";
    case "america":
    case "university":
      return "palm_leaves";
    case "cairo":
    case "dubai":
      return "golden_dust";
    case "beirut":
    case "mexico_city":
      return "city_lights";
    default:
      return "stars";
  }
}
