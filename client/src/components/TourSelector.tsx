import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, MapPin, Users, ChevronRight, Globe, GraduationCap, Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Tour {
  id: string;
  name: string;
  region: string;
  video: string;
  interiorVideo?: string;
  description: string;
  passengerCount: number;
  flag?: string;
  funFacts?: string[];
}

export interface TourRegion {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  tours: Tour[];
}

interface TourSelectorProps {
  regions: TourRegion[];
  currentTourId: string | null;
  onJoinTour: (tour: Tour) => void;
  onLeaveTour: () => void;
  isOnTour: boolean;
}

export function TourSelector({
  regions,
  currentTourId,
  onJoinTour,
  onLeaveTour,
  isOnTour
}: TourSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    regions.length === 1 ? regions[0].id : null
  );
  const [isLeaving, setIsLeaving] = useState(false);

  const handleJoinTour = (tour: Tour) => {
    if (isOnTour && currentTourId !== tour.id) {
      setIsLeaving(true);
      setTimeout(() => {
        onLeaveTour();
        setTimeout(() => {
          onJoinTour(tour);
          setIsLeaving(false);
        }, 500);
      }, 500);
    } else {
      onJoinTour(tour);
    }
  };

  const activeRegion = regions.find(r => r.id === selectedRegion);
  const showBackButton = regions.length > 1;

  return (
    <div className="h-full flex flex-col">
      {regions.length > 1 && (
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Tour Vibes
          </h2>
          <p className="text-xs text-white/50 mt-1">Choose a destination</p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          {!selectedRegion ? (
            <motion.div
              key="regions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3 space-y-2"
            >
              {regions.map((region, index) => (
                <motion.button
                  key={region.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedRegion(region.id)}
                  className="w-full p-4 glass rounded-xl border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all text-left group"
                  data-testid={`region-${region.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {region.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                        {region.name}
                      </h3>
                      <p className="text-xs text-white/50">{region.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40">{region.tours.length} buses</span>
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="tours"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3 pb-20"
            >
              {showBackButton && (
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="flex items-center gap-2 text-white/60 hover:text-white mb-4 text-sm"
                  data-testid="button-back-to-regions"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to regions
                </button>
              )}

              {activeRegion && (
                <>
                  {showBackButton && (
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        {activeRegion.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{activeRegion.name}</h3>
                        <p className="text-xs text-white/50">{activeRegion.tours.length} buses available</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {activeRegion.tours.map((tour, index) => {
                      const isCurrentTour = currentTourId === tour.id;

                      return (
                        <motion.div
                          key={tour.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-xl border transition-all ${
                            isCurrentTour
                              ? 'bg-primary/20 border-primary'
                              : 'glass border-white/10 hover:border-white/30'
                          }`}
                          data-testid={`tour-${tour.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-2xl">
                              {tour.flag || "🚌"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white truncate">{tour.name}</h4>
                              <p className="text-xs text-white/50 line-clamp-2">{tour.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="flex items-center gap-1 text-xs text-white/40">
                                  <Users className="w-3 h-3" />
                                  {tour.passengerCount} riding
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3">
                            {isCurrentTour ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={onLeaveTour}
                                className="w-full border-white/20 text-white hover:bg-white/10"
                                data-testid={`button-leave-${tour.id}`}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Leave Bus
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleJoinTour(tour)}
                                disabled={isLeaving}
                                className="w-full bg-primary hover:bg-primary/90"
                                data-testid={`button-join-${tour.id}`}
                              >
                                <Bus className="w-4 h-4 mr-2" />
                                {isLeaving ? "Switching..." : "Hop On"}
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isLeaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-white font-bold">Switching buses...</p>
              <p className="text-white/50 text-sm">Please wait</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
