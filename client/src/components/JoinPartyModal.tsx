import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinPartyModalProps {
  onJoin: (user: { name: string; avatar: string; role: string }) => void;
}

const EMOJI_OPTIONS = [
  "👩", "👨", "🧑", "👧", "👦", "🧔", "👱‍♀️", "👱‍♂️",
  "👩🏻", "👨🏻", "👩🏽", "👨🏽", "👩🏾", "👨🏾", "👩🏿", "👨🏿",
  "🧕", "👳‍♂️", "🦸", "🦹", "🤠", "🥷", "👻", "🤖"
];

export function JoinPartyModal({ onJoin }: JoinPartyModalProps) {
  const [guestNumber] = useState(() => Math.floor(Math.random() * 999) + 1);
  const [name, setName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(() =>
    EMOJI_OPTIONS[Math.floor(Math.random() * EMOJI_OPTIONS.length)]
  );
  const [showCustomize, setShowCustomize] = useState(false);

  const displayName = name.trim() || `User ${guestNumber}`;

  const handleQuickJoin = () => {
    onJoin({ name: displayName, avatar: selectedEmoji, role: "Passenger" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickJoin();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-zinc-900/90 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 pointer-events-none" />

        <div className="relative p-6 flex flex-col items-center text-center space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-primary">
              <Sparkles size={12} /> TOUR VIBES
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Hop On!</h2>
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 w-full border border-white/10">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl border-2 border-primary/30">
              {selectedEmoji}
            </div>
            <div className="text-left flex-1">
              <p className="text-white font-bold">{displayName}</p>
              <p className="text-white/50 text-xs">Ready to ride</p>
            </div>
          </div>

          <Button
            onClick={handleQuickJoin}
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl"
            data-testid="button-quick-join"
          >
            Join the Bus <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <button
            type="button"
            onClick={() => setShowCustomize(!showCustomize)}
            className="flex items-center gap-1 text-white/50 text-xs hover:text-white/80 transition-colors"
            data-testid="button-customize"
          >
            {showCustomize ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Customize name or avatar
          </button>

          {showCustomize && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleSubmit}
              className="w-full space-y-4"
            >
              <Input
                placeholder="Enter a nickname (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10 rounded-xl focus-visible:ring-primary/50"
                data-testid="input-user-name"
              />

              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <div className="grid grid-cols-8 gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all hover:bg-white/20 ${
                        selectedEmoji === emoji
                          ? "bg-primary/30 ring-2 ring-primary"
                          : "bg-transparent"
                      }`}
                      data-testid={`emoji-${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
