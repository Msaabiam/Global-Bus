import { motion } from "framer-motion";
import { useMemo } from "react";

import tokyoScene from "@/assets/images/tokyo-scene.jpg";
import dubaiScene from "@/assets/images/dubai-scene.jpg";
import cairoScene from "@/assets/images/cairo-scene.jpg";
import stanfordScene from "@/assets/images/stanford-scene.jpg";
import uclaScene from "@/assets/images/ucla-scene.jpg";
import berkeleyScene from "@/assets/images/berkeley-scene.jpg";
import harvardScene from "@/assets/images/harvard-scene.jpg";
import mitScene from "@/assets/images/mit-scene.jpg";
import nyuScene from "@/assets/images/nyu-scene.jpg";

const SCENE_IMAGES: Record<string, string> = {
  tokyo: tokyoScene,
  shinjuku: tokyoScene,
  shibuya: tokyoScene,
  ginza: tokyoScene,
  tokyo_tower: tokyoScene,
  nakameguro: tokyoScene,
  dubai: dubaiScene,
  burj_khalifa: dubaiScene,
  palm_jumeirah: dubaiScene,
  cairo: cairoScene,
  pyramids_giza: cairoScene,
  khan_el_khalili: cairoScene,
  stanford: stanfordScene,
  ucla: uclaScene,
  berkeley: berkeleyScene,
  harvard: harvardScene,
  mit: mitScene,
  nyu: nyuScene,
};

interface BusWindowViewProps {
  tourId: string;
  region: string;
  tourName: string;
}

export function BusWindowView({ tourId, region, tourName }: BusWindowViewProps) {
  const sceneImage = SCENE_IMAGES[tourId] || SCENE_IMAGES[region] || tokyoScene;
  
  const overlayColor = useMemo(() => {
    switch (region) {
      case "tokyo": return "from-purple-900/40 via-transparent to-pink-900/40";
      case "dubai": return "from-amber-900/40 via-transparent to-orange-900/40";
      case "cairo": return "from-yellow-900/40 via-transparent to-amber-900/40";
      case "stanford": return "from-red-900/40 via-transparent to-green-900/40";
      case "ucla": return "from-blue-900/40 via-transparent to-yellow-900/40";
      case "berkeley": return "from-blue-900/40 via-transparent to-yellow-900/40";
      case "harvard": return "from-red-900/40 via-transparent to-black/40";
      case "mit": return "from-red-900/40 via-transparent to-gray-900/40";
      case "nyu": return "from-purple-900/40 via-transparent to-white/20";
      default: return "from-slate-900/40 via-transparent to-slate-900/40";
    }
  }, [region]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 w-[200%] h-full flex"
        animate={{
          x: [0, "-50%"],
        }}
        transition={{
          x: {
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <div 
          className="w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${sceneImage})` }}
        />
        <div 
          className="w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${sceneImage})` }}
        />
      </motion.div>

      <div className={`absolute inset-0 bg-gradient-to-r ${overlayColor}`} />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/60 to-transparent" />
      </div>

      <motion.div
        className="absolute inset-0 bg-white/5"
        animate={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-lg"
        >
          🚌
        </motion.div>
        <span className="text-white/80 text-sm font-medium">
          Touring {tourName}
        </span>
      </motion.div>
    </div>
  );
}
