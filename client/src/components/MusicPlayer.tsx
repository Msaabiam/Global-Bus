import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Music, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const TRACKS = [
  {
    title: "Synthwave Nights",
    artist: "NCS Vibe",
    duration: 243,
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_8cb749d484.mp3"
  },
  {
    title: "Neon Dreams",
    artist: "Synthwave Artist",
    duration: 200,
    url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b0939c4.mp3"
  },
  {
    title: "Retrowave Drive",
    artist: "Electronic Vibes",
    duration: 180,
    url: "https://cdn.pixabay.com/download/audio/2023/04/24/audio_2fb61a1bf2.mp3"
  }
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev === TRACKS.length - 1 ? 0 : prev + 1));
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value[0] / 100) * duration;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="fixed bottom-20 left-4 right-4 z-50 glass rounded-2xl p-3 border border-white/20 shadow-2xl"
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={12} className="text-white/70" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary shrink-0 flex items-center justify-center relative overflow-hidden">
                  <Music size={16} className="text-white/80" />
                  {isPlaying && (
                    <div className="absolute bottom-0.5 flex gap-[1px] items-end h-3">
                      {[1,2,3].map(i => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-white/80 rounded-t-sm"
                          animate={{ height: [2, 8, 4, 10, 2] }}
                          transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-xs truncate">{currentTrack.title}</h3>
                  <p className="text-white/60 text-[10px] truncate">{currentTrack.artist}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={handlePrev} className="text-white/70 hover:text-white rounded-full w-8 h-8">
                    <SkipBack size={14} />
                  </Button>
                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className="w-9 h-9 bg-white text-black hover:bg-white/90 rounded-full"
                  >
                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleNext} className="text-white/70 hover:text-white rounded-full w-8 h-8">
                    <SkipForward size={14} />
                  </Button>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[9px] text-white/40 w-7 text-right">{formatTime(currentTime)}</span>
                <Slider value={[progress]} max={100} step={0.1} onValueChange={handleSeek} className="grow" />
                <span className="text-[9px] text-white/40 w-7">{formatTime(duration)}</span>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(true)}
              className="fixed bottom-24 left-4 z-50 w-12 h-12 rounded-full glass border border-white/20 shadow-xl flex items-center justify-center"
              data-testid="button-expand-music"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative overflow-hidden">
                <Music size={14} className="text-white" />
                {isPlaying && (
                  <div className="absolute bottom-0.5 flex gap-[1px] items-end h-2">
                    {[1,2,3].map(i => (
                      <motion.div
                        key={i}
                        className="w-0.5 bg-white/80 rounded-t-sm"
                        animate={{ height: [2, 6, 3, 8, 2] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[400px] h-14 glass rounded-2xl flex items-center px-3 gap-3 z-50 shadow-xl shadow-primary/10 border-primary/20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary shrink-0 flex items-center justify-center relative overflow-hidden">
        <Music className="text-white/80 w-4 h-4" />
        {isPlaying && (
          <div className="absolute bottom-0.5 flex gap-[1px] items-end h-3">
            {[1,2,3].map(i => (
              <motion.div
                key={i}
                className="w-0.5 bg-white/80 rounded-t-sm"
                animate={{ height: [2, 8, 4, 10, 2] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col grow min-w-0 z-10">
        <h3 className="font-bold text-white text-xs truncate">{currentTrack.title}</h3>
        <p className="text-white/50 text-[10px] truncate">{currentTrack.artist}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0 z-10">
        <Button size="icon" variant="ghost" onClick={handlePrev} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full w-7 h-7">
          <SkipBack size={12} />
        </Button>

        <Button
          size="icon"
          onClick={togglePlay}
          className="w-8 h-8 bg-white text-black hover:bg-white/90 rounded-full shadow-md"
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </Button>

        <Button size="icon" variant="ghost" onClick={handleNext} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full w-7 h-7">
          <SkipForward size={12} />
        </Button>
      </div>

      <div className="h-6 w-[1px] bg-white/10 mx-1" />

      <div className="flex items-center gap-1 shrink-0 z-10">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsMuted(!isMuted)}
          className="text-white/60 hover:text-white hover:bg-white/5 rounded-full w-6 h-6"
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </Button>
      </div>
    </motion.div>
  );
}
