import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { MapPin, GraduationCap, Bus, Sparkles, Globe, Building2 } from "lucide-react";

export default function HomePage() {
  const [, navigate] = useLocation();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.h1
          className="md:text-5xl lg:text-6xl text-white/90 text-[50px]"
          style={{
            fontFamily: "'Dancing Script', cursive",
            letterSpacing: "0.02em"
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            textShadow: ["0 0 10px rgba(255,255,255,0.3)", "0 0 20px rgba(255,255,255,0.5)", "0 0 10px rgba(255,255,255,0.3)"]
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          Tour Vibes
        </motion.h1>
      </motion.div>
      
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative h-1/2 cursor-pointer group overflow-hidden"
        onClick={() => navigate("/tours/cities")}
        data-testid="city-tours-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-800/40 to-pink-900/50">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center mx-auto mb-4"
            >
              <MapPin className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-2">
              City Tours
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-xs mx-auto mb-4">For teens, travel through the world with your friends</p>
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full group-hover:bg-primary/30 transition-colors">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-white text-sm font-medium">Explore Cities</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </motion.section>
      
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative h-1/2 cursor-pointer group overflow-hidden"
        onClick={() => navigate("/tours/campuses")}
        data-testid="campus-tours-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-green-800/40 to-teal-900/50">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/80" />

        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="w-16 h-16 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30 flex items-center justify-center mx-auto mb-4"
            >
              <GraduationCap className="w-8 h-8 text-secondary" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-2">
              Campus Tours
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-xs mx-auto mb-4">
              Also for teens, visit college campuses with other teens
            </p>
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-md border border-secondary/30 px-4 py-2 rounded-full group-hover:bg-secondary/30 transition-colors">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-white text-sm font-medium">Explore Campuses</span>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
