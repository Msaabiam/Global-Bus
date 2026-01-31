import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Crown, Zap, User, Send, Sparkles, MessageCircle, MapPin,
  CheckCircle2, Users, ChevronDown, ChevronUp
} from "lucide-react";

function isEmojiAvatar(avatar: string): boolean {
  return !avatar.startsWith('http') && !avatar.startsWith('/');
}

export function UserAvatar({ avatar, name, size = "md" }: { avatar: string; name: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-lg",
    lg: "w-10 h-10 text-2xl"
  };

  if (isEmojiAvatar(avatar)) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-white/10 border border-white/20 flex items-center justify-center`}>
        {avatar}
      </div>
    );
  }

  return (
    <Avatar className={`${sizeClasses[size]} border border-white/20`}>
      <AvatarImage src={avatar} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  );
}

export interface Passenger {
  id: string;
  name: string;
  role: string;
  avatar: string;
  xp: number;
  level: number;
  isVip?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  totalVotes: number;
  userVotedId?: string;
}

export interface Message {
  id: number;
  user: string;
  avatar: string;
  message: string;
  time: string;
  isMe?: boolean;
  poll?: PollData;
}

interface CrewChatProps {
  passengers: Passenger[];
  currentUser: Passenger | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onVote?: (pollId: string, optionId: string) => void;
  onStartPoll?: () => void;
}

export function CrewChat({
  passengers,
  currentUser,
  messages,
  onSendMessage,
  onVote,
  onStartPoll
}: CrewChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [crewExpanded, setCrewExpanded] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayList = currentUser
    ? [currentUser, ...passengers.filter(p => p.id !== currentUser.id)]
    : passengers;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !currentUser) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full glass rounded-3xl overflow-hidden border-white/5 shadow-2xl">
      <div
        className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-xl cursor-pointer hover:bg-white/10 transition-colors shrink-0"
        onClick={() => setCrewExpanded(!crewExpanded)}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-white flex items-center gap-2">
            <Users className="text-secondary w-4 h-4" />
            Crew
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
              {displayList.length} Online
            </Badge>
            {crewExpanded ? (
              <ChevronUp size={16} className="text-white/50" />
            ) : (
              <ChevronDown size={16} className="text-white/50" />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {crewExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-white/5 overflow-hidden shrink-0"
          >
            <div className="p-3 max-h-36 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {displayList.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-full transition-all ${
                      currentUser?.id === p.id
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                    data-testid={`crew-member-${p.id}`}
                  >
                    <div className="relative">
                      <UserAvatar avatar={p.avatar} name={p.name} size="sm" />
                      {currentUser?.id === p.id && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-black" />
                      )}
                    </div>
                    <span className={`text-xs font-medium truncate max-w-20 ${currentUser?.id === p.id ? "text-primary" : "text-white/80"}`}>
                      {p.name}
                    </span>
                    {p.isVip && <Crown size={10} className="text-yellow-400 fill-yellow-400" />}
                    <span className="text-[10px] text-white/40 bg-white/10 px-1.5 rounded-full">
                      {p.role === "Bus Driver" ? "🚌" : `Lv${p.level}`}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-2 border-b border-white/5 bg-white/5 backdrop-blur-xl flex items-center justify-between shrink-0">
        <h3 className="font-display font-bold text-white flex items-center gap-2 text-sm">
          <MessageCircle className="text-primary w-4 h-4" />
          Party Chat
        </h3>
        <div className="text-xs text-white/40 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> Live
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 min-h-0">
        <div className="flex flex-col gap-4 pb-2">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={msg.id}
                className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}
              >
                {!msg.isMe && msg.avatar && (
                  <div className="shrink-0">
                    <UserAvatar avatar={msg.avatar} name={msg.user} size="md" />
                  </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.isMe ? "items-end" : "items-start"}`}>
                  <div className={`flex items-baseline gap-2 ${msg.isMe ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs font-bold text-white/90">{msg.user}</span>
                    <span className="text-[10px] text-white/40">{msg.time}</span>
                  </div>

                  {msg.poll ? (
                    <div className="w-64 bg-black/40 border border-white/10 rounded-xl p-3 shadow-lg backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span className="font-bold text-white text-sm">{msg.poll.question}</span>
                      </div>
                      <div className="space-y-2">
                        {msg.poll.options.map(opt => {
                          const percentage = msg.poll!.totalVotes > 0 ? (opt.votes / msg.poll!.totalVotes) * 100 : 0;
                          const isWinning = percentage > 0 && opt.votes === Math.max(...msg.poll!.options.map(o => o.votes));

                          return (
                            <button
                              key={opt.id}
                              disabled={!msg.poll!.isActive || !!msg.poll!.userVotedId}
                              onClick={() => onVote?.(msg.poll!.id, opt.id)}
                              className={`w-full relative overflow-hidden rounded-lg border transition-all ${
                                msg.poll?.userVotedId === opt.id
                                  ? "border-primary/50 bg-primary/10"
                                  : "border-white/5 bg-white/5 hover:bg-white/10"
                              }`}
                            >
                              <div
                                className={`absolute inset-0 opacity-20 transition-all duration-500 ${isWinning ? "bg-green-500" : "bg-primary"}`}
                                style={{ width: `${percentage}%` }}
                              />

                              <div className="relative z-10 flex items-center justify-between p-2 text-xs">
                                <span className="text-white font-medium truncate">{opt.text}</span>
                                <div className="flex items-center gap-2">
                                  {msg.poll?.userVotedId === opt.id && <CheckCircle2 size={12} className="text-primary" />}
                                  <span className="text-white/60">{opt.votes}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-3 text-[10px] text-white/40 text-center uppercase tracking-widest font-bold">
                        {msg.poll.isActive ? `${msg.poll.totalVotes} votes - Voting Open` : "Voting Closed"}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm border ${
                        msg.isMe
                          ? "bg-primary text-white rounded-tr-none border-primary/50 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                          : "bg-white/10 text-white/90 rounded-tl-none border-white/5"
                      }`}
                    >
                      {msg.message}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-3 md:p-4 bg-white/5 border-t border-white/5 shrink-0 flex gap-2">
        {onStartPoll && (
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full text-white/70 hover:text-white hover:bg-white/10 shrink-0"
            onClick={onStartPoll}
            disabled={!currentUser}
            title="Start Destination Poll"
            data-testid="button-start-poll"
          >
            <MapPin size={18} />
          </Button>
        )}
        <form onSubmit={handleSend} className="relative flex-1">
          <Input
            placeholder={currentUser ? "Say something..." : "Join the party to chat!"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!currentUser}
            className="bg-black/20 border-white/10 text-white placeholder:text-white/30 rounded-full pr-12 focus-visible:ring-primary/50 h-10 md:h-11"
            data-testid="input-chat-message"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || !currentUser}
            className="absolute right-1 top-1 h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:bg-white/10"
            data-testid="button-send-message"
          >
            <Send size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
}
