import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Bus, Clock, Sparkles, Brain, Users, MapPin, Globe, GraduationCap, Building2, Video, Eye, Home, ArrowLeft } from "lucide-react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Message, Passenger } from "@/components/CrewChat";
import { FloatingCrewChat } from "@/components/FloatingCrewChat";
import { BusVibration } from "@/components/MotionEffects";
import { JoinPartyModal } from "@/components/JoinPartyModal";
import { TriviaChallenge } from "@/components/TriviaChallenge";
import { TourSelector, Tour, TourRegion } from "@/components/TourSelector";
import { NeonFactsBanner } from "@/components/NeonFactsBanner";
import { TravelTransition } from "@/components/TravelTransition";
import { AmbientParticles, getParticleType } from "@/components/AmbientParticles";
import { BusWindowView } from "@/components/BusWindowView";
import { useRegionTheme } from "@/components/RegionTheme";
import { PassengerNotification, usePassengerNotifications } from "@/components/PassengerNotification";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

const TOUR_REGIONS: TourRegion[] = [
  {
    id: "tokyo",
    name: "Tokyo, Japan",
    icon: <span className="text-lg">🗼</span>,
    description: "Night tour through Tokyo's vibrant districts",
    tours: [
      {
        id: "shinjuku",
        name: "Shinjuku District",
        region: "tokyo",
        video: "",
        description: "The busiest railway station in the world, neon lights and bustling nightlife",
        passengerCount: 12,
        flag: "🏙️",
        funFacts: [
          "Shinjuku Station handles 3.6 million passengers daily — the busiest in the world",
          "The neon signs of Kabukicho use enough electricity to power 10,000 homes",
          "There are over 200 exits at Shinjuku Station",
          "Godzilla's head overlooks Kabukicho from the Toho Cinema building"
        ]
      },
      {
        id: "shibuya",
        name: "Shibuya Crossing",
        region: "tokyo",
        video: "",
        description: "The world's busiest pedestrian crossing, iconic scramble intersection",
        passengerCount: 8,
        flag: "🚶",
        funFacts: [
          "Up to 3,000 people cross Shibuya Crossing at once during rush hour",
          "Hachiko the loyal dog statue has waited here since 1934",
          "The crossing appears in countless films including Lost in Translation",
          "Shibuya 109 mall helped launch Japan's gyaru fashion movement"
        ]
      },
      {
        id: "ginza",
        name: "Ginza District",
        region: "tokyo",
        video: "",
        description: "Upscale shopping, luxury boutiques, and fine dining",
        passengerCount: 5,
        flag: "💎",
        funFacts: [
          "Ginza land prices are among the highest in the world",
          "The name means 'silver mint' — coins were once made here",
          "Ginza was Japan's first district with electric streetlights in 1882",
          "The Wako clock tower has been a Ginza landmark since 1932"
        ]
      },
      {
        id: "tokyo_tower",
        name: "Tokyo Tower Area",
        region: "tokyo",
        video: "",
        description: "Iconic red tower, panoramic views of the city",
        passengerCount: 15,
        flag: "🗼",
        funFacts: [
          "Tokyo Tower is 13 meters taller than the Eiffel Tower",
          "It was built in 1958 using steel from American tanks",
          "The tower uses 28,000 liters of paint for its iconic orange color",
          "Over 150 million people have visited since opening"
        ]
      },
      {
        id: "nakameguro",
        name: "Nakameguro",
        region: "tokyo",
        video: "",
        description: "Cherry blossom lined canals, trendy cafes and boutiques",
        passengerCount: 3,
        flag: "🌸",
        funFacts: [
          "800 cherry trees line the Meguro River — a top sakura spot",
          "Home to Tokyo's first Starbucks Reserve Roastery",
          "The area transformed from industrial zone to hipster haven in the 1990s",
          "Nakameguro is known for Japan's best vintage clothing stores"
        ]
      }
    ]
  },
  {
    id: "dubai",
    name: "Dubai, UAE",
    icon: <Building2 className="w-5 h-5" />,
    description: "Luxury tour through the city of gold",
    tours: [
      {
        id: "dubai_downtown",
        name: "Downtown Dubai",
        region: "dubai",
        video: "",
        description: "Burj Khalifa, Dubai Mall, and the famous dancing fountains",
        passengerCount: 18,
        flag: "🏙️",
        funFacts: [
          "Burj Khalifa is 828 meters tall — the world's tallest building",
          "Dubai Mall has over 1,200 shops and an indoor aquarium",
          "The Dubai Fountain shoots water 150 meters into the air",
          "Downtown Dubai was built on former desert in just 10 years"
        ]
      },
      {
        id: "dubai_marina",
        name: "Dubai Marina",
        region: "dubai",
        video: "",
        description: "Stunning waterfront with yachts and skyscrapers",
        passengerCount: 14,
        flag: "⛵",
        funFacts: [
          "Dubai Marina is the world's largest man-made marina",
          "The marina canal stretches 3km through the district",
          "JBR Beach sees 2 million visitors annually",
          "The area has over 200 restaurants and cafes"
        ]
      }
    ]
  },
  {
    id: "cairo",
    name: "Cairo, Egypt",
    icon: <span className="text-lg">🏛️</span>,
    description: "Ancient wonders meet modern city life",
    tours: [
      {
        id: "giza",
        name: "Giza Pyramids",
        region: "cairo",
        video: "",
        description: "The last surviving wonder of the ancient world",
        passengerCount: 20,
        flag: "⚱️",
        funFacts: [
          "The Great Pyramid was the tallest structure for 3,800 years",
          "It took 20 years and 100,000 workers to build",
          "The Sphinx is 4,500 years old and faces due east",
          "The pyramids were originally covered in white limestone"
        ]
      },
      {
        id: "cairo_downtown",
        name: "Downtown Cairo",
        region: "cairo",
        video: "",
        description: "Bustling streets, historic architecture, and vibrant markets",
        passengerCount: 11,
        flag: "🕌",
        funFacts: [
          "Cairo is the largest city in the Arab world with 20 million people",
          "The Egyptian Museum has over 120,000 artifacts",
          "Khan el-Khalili bazaar has been trading since 1382",
          "Cairo has more than 1,000 mosques"
        ]
      }
    ]
  },
  {
    id: "university",
    name: "University Tour",
    icon: <GraduationCap className="w-5 h-5" />,
    description: "Visit world-famous university campuses",
    tours: [
      {
        id: "stanford",
        name: "Stanford University",
        region: "university",
        video: "",
        description: "Palm Drive, red-tile roofs, and iconic Hoover Tower",
        passengerCount: 11,
        flag: "🌲",
        funFacts: [
          "Stanford has produced 30 living billionaires — more than any other university",
          "The campus spans 8,180 acres — bigger than NYC's Central Park",
          "Google, Yahoo, Nike, and Netflix were all founded by Stanford alumni",
          "Hoover Tower houses 2 million rare documents on war and peace"
        ]
      },
      {
        id: "ucla",
        name: "UCLA Westwood",
        region: "university",
        video: "",
        description: "Romanesque architecture, Royce Hall, and sunny California vibes",
        passengerCount: 9,
        flag: "🐻",
        funFacts: [
          "UCLA has won 118 NCAA championships — the most of any university",
          "Royce Hall was modeled after a church in Milan, Italy",
          "The Bruin Walk sees 50,000 students pass through daily",
          "UCLA's Powell Library appeared in Legally Blonde and many other films"
        ]
      },
      {
        id: "harvard",
        name: "Harvard University",
        region: "university",
        video: "",
        description: "Historic red brick buildings, ivy-covered walls, and autumn charm",
        passengerCount: 16,
        flag: "🎓",
        funFacts: [
          "Harvard is the oldest university in America, founded in 1636",
          "8 U.S. Presidents graduated from Harvard including Obama and JFK",
          "Harvard's endowment of $50+ billion is the largest of any university",
          "The statue of John Harvard is called the 'Statue of Three Lies'"
        ]
      },
      {
        id: "mit",
        name: "MIT",
        region: "university",
        video: "",
        description: "Futuristic architecture, innovation labs, and Charles River views",
        passengerCount: 13,
        flag: "🔬",
        funFacts: [
          "MIT has produced 98 Nobel laureates and countless tech pioneers",
          "The infinite corridor aligns with the sun twice a year — MIThenge",
          "MIT pranks are legendary — students once put a car on top of the dome",
          "The first video game, Spacewar!, was created at MIT in 1962"
        ]
      },
      {
        id: "berkeley",
        name: "UC Berkeley",
        region: "university",
        video: "",
        description: "Sather Tower, eucalyptus groves, and Bay Area golden sunsets",
        passengerCount: 14,
        flag: "🐻",
        funFacts: [
          "UC Berkeley has produced 114 Nobel Prize winners",
          "Sather Tower (the Campanile) is 307 feet tall with 61 bells",
          "The Free Speech Movement was born here in 1964",
          "Berkeley discovered 16 elements of the periodic table"
        ]
      },
      {
        id: "nyu",
        name: "NYU",
        region: "university",
        video: "",
        description: "Urban campus in the heart of Greenwich Village",
        passengerCount: 10,
        flag: "🗽",
        funFacts: [
          "NYU has no traditional campus — the city is its campus",
          "Washington Square Park is the heart of student life",
          "NYU has more international students than any US university",
          "Famous alumni include Lady Gaga, Spike Lee, and Martin Scorsese"
        ]
      }
    ]
  }
];

interface BusToursProps {
  category?: "cities" | "campuses";
}

export default function BusTours({ category }: BusToursProps) {
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  
  const [currentUser, setCurrentUser] = useState<Passenger | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTour, setCurrentTour] = useState<Tour | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [showTrivia, setShowTrivia] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [view, setView] = useState<"window" | "interior">("window");
  
  const { notifications, addNotification, dismissNotification } = usePassengerNotifications();

  const filteredRegions = category === "campuses" 
    ? TOUR_REGIONS.filter(r => r.id === "university")
    : category === "cities"
    ? TOUR_REGIONS.filter(r => r.id !== "university")
    : TOUR_REGIONS;

  useRegionTheme(currentTour?.region || null);

  const { isConnected, sendChat, sendVote } = useWebSocket({
    roomId,
    passengerId: currentUser?.id || null,
    onPassengers: (newPassengers) => {
      setPassengers(newPassengers);
    },
    onChat: (message) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: message.user,
        avatar: message.avatar,
        message: message.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: message.user === currentUser?.name
      }]);
    },
    onTravel: (destinationId) => {
      const allTours = filteredRegions.flatMap(r => r.tours);
      const newTour = allTours.find(t => t.id === destinationId);
      if (newTour) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentTour(newTour);
          setIsTransitioning(false);
        }, 2000);
      }
    }
  });

  const handleJoin = async (user: { name: string; avatar: string; role: string }) => {
    try {
      const roomName = category === "campuses" ? "campus-tour" : "city-tour";
      
      let room;
      try {
        const response = await fetch(`/api/rooms/${roomName}`);
        if (response.ok) {
          room = await response.json();
        }
      } catch (e) {
        // Room doesn't exist, create it
      }
      
      if (!room) {
        room = await apiRequest("POST", "/api/rooms", { name: roomName });
      }
      
      const passenger = await apiRequest("POST", "/api/passengers", {
        roomId: room.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        xp: 0,
        level: 1,
        isVip: false
      });
      
      setCurrentUser(passenger);
      setRoomId(room.id);
      setShowJoinModal(false);
      
      if (filteredRegions.length > 0 && filteredRegions[0].tours.length > 0) {
        setCurrentTour(filteredRegions[0].tours[0]);
      }
    } catch (error) {
      console.error("Failed to join:", error);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;
    sendChat(currentUser.name, currentUser.avatar, text);
  };

  const handleVote = (pollId: string, optionId: string) => {
    sendVote(pollId, optionId);
  };

  const handleTriviaComplete = (xp: number) => {
    if (currentUser) {
      const newXp = currentUser.xp + xp;
      const newLevel = Math.floor(newXp / 1000) + 1;
      setCurrentUser({ ...currentUser, xp: newXp, level: newLevel });
    }
    setShowTrivia(false);
  };

  const handleJoinTour = (tour: Tour) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTour(tour);
      setIsTransitioning(false);
    }, 1500);
  };

  const handleLeaveTour = () => {
    setCurrentTour(null);
  };

  const getBackgroundGradient = (region: string) => {
    switch (region) {
      case "tokyo":
        return "from-pink-900/80 via-purple-900/60 to-slate-900";
      case "dubai":
        return "from-cyan-900/80 via-blue-900/60 to-slate-900";
      case "cairo":
        return "from-amber-900/80 via-orange-900/60 to-slate-900";
      case "university":
        return "from-green-900/80 via-emerald-900/60 to-slate-900";
      default:
        return "from-purple-900/80 via-slate-900/60 to-slate-900";
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-900">
      {showJoinModal && <JoinPartyModal onJoin={handleJoin} />}
      {showTrivia && <TriviaChallenge onClose={() => setShowTrivia(false)} onComplete={handleTriviaComplete} />}
      
      <TravelTransition 
        isTransitioning={isTransitioning} 
        toLocation={currentTour?.name} 
      />
      
      <PassengerNotification 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />

      {!isMobile && (
        <div className="w-80 h-full border-r border-white/10 bg-black/40 backdrop-blur-lg flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-xs text-white/60">{isConnected ? 'Connected' : 'Connecting...'}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <TourSelector
              regions={filteredRegions}
              currentTourId={currentTour?.id || null}
              onJoinTour={handleJoinTour}
              onLeaveTour={handleLeaveTour}
              isOnTour={!!currentTour}
            />
          </div>
        </div>
      )}

      <div className="flex-1 h-full relative overflow-hidden">
        {currentTour ? (
          <>
<>
              <BusWindowView 
                tourId={currentTour.id} 
                region={currentTour.region} 
                tourName={currentTour.name}
              />
              <AmbientParticles type={getParticleType(currentTour.region)} count={20} />
</>

            <div className="absolute top-4 left-4 right-4 z-20">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-2xl">
                      {currentTour.flag || "🚌"}
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">{currentTour.name}</h1>
                      <p className="text-sm text-white/60">{currentTour.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setView(view === "window" ? "interior" : "window")}
                      className="border-white/20 text-white hover:bg-white/10"
                      data-testid="button-toggle-view"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {view === "window" ? "Interior" : "Window"} View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowTrivia(true)}
                      className="bg-secondary hover:bg-secondary/90 text-black"
                      data-testid="button-start-trivia"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Trivia
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {currentTour.funFacts && currentTour.funFacts.length > 0 && (
              <div className="absolute bottom-20 left-4 right-4 z-20">
                <NeonFactsBanner facts={currentTour.funFacts} tourName={currentTour.name} />
              </div>
            )}

          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Bus className="w-16 h-16 text-primary/50 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Select a Tour</h2>
              <p className="text-white/60">Choose a destination from the sidebar to start your journey</p>
            </motion.div>
          </div>
        )}

        {currentUser && (
          <FloatingCrewChat
            passengers={passengers}
            currentUser={currentUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            onVote={handleVote}
          />
        )}
      </div>

      <MusicPlayer />

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-safe">
          <div className="glass rounded-3xl border border-white/10 p-2 flex items-center justify-around gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex-1 h-12 rounded-2xl flex flex-col items-center gap-0.5 text-white/60"
              data-testid="button-mobile-home"
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium">Home</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView(view === "window" ? "interior" : "window")}
              className="flex-1 h-12 rounded-2xl flex flex-col items-center gap-0.5 text-white/60"
              data-testid="button-mobile-view"
            >
              <Eye className="w-5 h-5" />
              <span className="text-[10px] font-medium">View</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setShowTrivia(true)}
              disabled={!currentUser}
              className="w-16 h-16 -mt-6 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/40 flex flex-col items-center gap-0.5 border-4 border-background"
              data-testid="button-mobile-trivia"
            >
              <Brain className="w-6 h-6" />
              <span className="text-[9px] font-bold">PLAY</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-12 rounded-2xl flex flex-col items-center gap-0.5 text-white/60"
              data-testid="button-mobile-passengers"
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-medium">Crew</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-12 rounded-2xl flex flex-col items-center gap-0.5 text-white/60"
              data-testid="button-mobile-map"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] font-medium">Tours</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
