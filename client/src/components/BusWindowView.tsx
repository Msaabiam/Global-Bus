import { motion } from "framer-motion";
import { useMemo, useRef, useEffect } from "react";

import tokyoVideo from "@/assets/videos/tokyo-shinjuku.mp4";
import dubaiVideo from "@/assets/videos/dubai-burj.mp4";
import cairoVideo from "@/assets/videos/cairo-tour.mp4";

import tokyoScene from "@/assets/images/tokyo-scene.jpg";
import dubaiScene from "@/assets/images/dubai-scene.jpg";
import cairoScene from "@/assets/images/cairo-scene.jpg";
import stanfordScene from "@/assets/images/stanford-scene.jpg";
import uclaScene from "@/assets/images/ucla-scene.jpg";
import berkeleyScene from "@/assets/images/berkeley-scene.jpg";
import harvardScene from "@/assets/images/harvard-scene.jpg";
import mitScene from "@/assets/images/mit-scene.jpg";
import nyuScene from "@/assets/images/nyu-scene.jpg";

const TOUR_VIDEOS: Record<string, string> = {
  tokyo: tokyoVideo,
  shinjuku: tokyoVideo,
  shibuya: tokyoVideo,
  ginza: tokyoVideo,
  tokyo_tower: tokyoVideo,
  nakameguro: tokyoVideo,
  dubai: dubaiVideo,
  burj_khalifa: dubaiVideo,
  palm_jumeirah: dubaiVideo,
  cairo: cairoVideo,
  pyramids_giza: cairoVideo,
  khan_el_khalili: cairoVideo,
};

const SCENE_IMAGES: Record<string, string> = {
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const tourVideo = TOUR_VIDEOS[tourId] || TOUR_VIDEOS[region];
  const sceneImage = SCENE_IMAGES[tourId] || SCENE_IMAGES[region];
  const hasVideo = !!tourVideo;

  useEffect(() => {
    if (videoRef.current && hasVideo) {
      videoRef.current.play().catch(() => {});
    }
  }, [tourId, hasVideo]);

  const overlayColor = useMemo(() => {
    switch (region) {
      case "tokyo": return "from-purple-900/30 via-transparent to-pink-900/30";
      case "dubai": return "from-amber-900/30 via-transparent to-orange-900/30";
      case "cairo": return "from-yellow-900/30 via-transparent to-amber-900/30";
      case "stanford": return "from-red-900/30 via-transparent to-green-900/30";
      case "ucla": return "from-blue-900/30 via-transparent to-yellow-900/30";
      case "berkeley": return "from-blue-900/30 via-transparent to-yellow-900/30";
      case "harvard": return "from-red-900/30 via-transparent to-black/30";
      case "mit": return "from-red-900/30 via-transparent to-gray-900/30";
      case "nyu": return "from-purple-900/30 via-transparent to-white/10";
      default: return "from-slate-900/30 via-transparent to-slate-900/30";
    }
  }, [region]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-950">
      <style dangerouslySetInnerHTML={{ __html: "\
        @keyframes panScene { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }\
        .pan-anim { animation: panScene 60s linear infinite; }\
      " }} />

      {/* BUS INTERIOR - dark surround with window cutout */}
      {/* Top ceiling area */}
      <div className="absolute top-0 left-0 right-0 h-[18%] bg-gray-900 z-20" style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[60%] h-[3px] bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent rounded-full" />
        </div>
        <div className="absolute bottom-0 left-[10%] right-[10%] h-[4px]" style={{ background: "linear-gradient(90deg, transparent, #c4a35a, transparent)" }} />
      </div>

      {/* Left seat area */}
      <div className="absolute top-[18%] bottom-[22%] left-0 w-[8%] z-20" style={{ background: "linear-gradient(90deg, #1a1520 0%, #2a2035 100%)" }}>
        <div className="absolute top-[20%] bottom-[20%] right-0 w-[60%] bg-gray-800 rounded-l-lg opacity-80" />
      </div>

      {/* Right seat area */}
      <div className="absolute top-[18%] bottom-[22%] right-0 w-[8%] z-20" style={{ background: "linear-gradient(270deg, #1a1520 0%, #2a2035 100%)" }}>
        <div className="absolute top-[20%] bottom-[20%] left-0 w-[60%] bg-gray-800 rounded-r-lg opacity-80" />
      </div>

      {/* Bottom floor/seats area */}
      <div className="absolute bottom-0 left-0 right-0 h-[22%] z-20" style={{ background: "linear-gradient(0deg, #0f0f1a 0%, #1a1520 100%)" }}>
        <div className="absolute top-0 left-[5%] right-[5%] h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #c4a35a60, transparent)" }} />
        {/* Seat backs */}
        <div className="absolute top-[15%] left-[12%] w-[25%] h-[70%] bg-gray-800 rounded-t-lg opacity-70" style={{ background: "linear-gradient(180deg, #3d3040, #2a2035)" }} />
        <div className="absolute top-[15%] right-[12%] w-[25%] h-[70%] bg-gray-800 rounded-t-lg opacity-70" style={{ background: "linear-gradient(180deg, #3d3040, #2a2035)" }} />
      </div>

      {/* Window frame border */}
      <div className="absolute top-[18%] bottom-[22%] left-[8%] right-[8%] z-20 pointer-events-none">
        <div className="absolute inset-0 border-2 border-gray-700 rounded-sm opacity-60" />
        <div className="absolute inset-[2px] border border-gray-600 rounded-sm opacity-30" />
      </div>

      {/* THE SCENE - visible through the bus window */}
      <div className="absolute top-[18%] bottom-[22%] left-[8%] right-[8%] overflow-hidden z-10">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={tourVideo}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : sceneImage ? (
          <div className="pan-anim absolute inset-0 w-[200%] h-full flex">
            <div className="w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: "url(" + sceneImage + ")" }} />
            <div className="w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: "url(" + sceneImage + ")" }} />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        )}

        {/* Color overlay on scene */}
        <div className={"absolute inset-0 bg-gradient-to-r " + overlayColor} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </div>

      {/* Glass reflection effect on window */}
      <div className="absolute top-[18%] bottom-[22%] left-[8%] right-[8%] z-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-gradient-to-br from-white/5 to-transparent rounded-br-full" />
      </div>

      {/* Touring label */}
      <motion.div
        className="absolute bottom-[24%] left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 z-40"
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
        <span className="text-white/90 text-sm font-medium">
          Touring {tourName}
        </span>
      </motion.div>
    </div>
  );
}
