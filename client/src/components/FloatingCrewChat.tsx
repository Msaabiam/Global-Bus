import { useState } from "react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { MessageCircle, Minimize2, GripVertical, X } from "lucide-react";
import { CrewChat, Passenger, Message } from "./CrewChat";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingCrewChatProps {
  passengers: Passenger[];
  currentUser: Passenger | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onVote?: (pollId: string, optionId: string) => void;
  onStartPoll?: () => void;
}

export function FloatingCrewChat({
  passengers,
  currentUser,
  messages,
  onSendMessage,
  onVote,
  onStartPoll
}: FloatingCrewChatProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const dragControls = useDragControls();
  const isMobile = useIsMobile();

  const unreadCount = messages.length;

  const handleCollapse = () => {
    setIsCollapsed(true);
  };

  const handleExpand = () => {
    setIsCollapsed(false);
  };

  if (isMobile) {
    return (
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.button
            key="fab-mobile"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleExpand}
            className="fixed bottom-[47%] right-3 z-[100] w-12 h-12 rounded-full glass border border-white/20 shadow-xl flex items-center justify-center"
            data-testid="button-expand-chat-mobile"
          >
            <MessageCircle className="w-5 h-5 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="panel-mobile"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 z-[100] h-[70%] flex flex-col"
            data-testid="chat-panel-mobile"
          >
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={handleCollapse}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center"
              >
                <X size={16} className="text-white/70" />
              </button>
            </div>

            <div className="flex-1 min-h-0">
              <CrewChat
                passengers={passengers}
                currentUser={currentUser}
                messages={messages}
                onSendMessage={onSendMessage}
                onVote={onVote}
                onStartPoll={onStartPoll}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isCollapsed ? (
        <motion.button
          key="fab"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExpand}
          className="fixed bottom-24 right-6 z-[100] w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm border-2 border-white/30 shadow-2xl flex items-center justify-center cursor-pointer hover:bg-primary transition-colors"
          data-testid="button-expand-chat"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-6 h-6 bg-white text-primary text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
              data-testid="status-unread-count"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </motion.button>
      ) : (
        <motion.div
          key="panel"
          initial={{ scale: 0.9, opacity: 0, x: 100 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.9, opacity: 0, x: 100 }}
          drag
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ top: -200, left: -600, right: 100, bottom: 200 }}
          dragElastic={0.1}
          className="fixed z-[100] w-80 md:w-96 h-[60vh] max-h-[600px] min-h-[400px] flex flex-col"
          style={{
            right: 24,
            top: "50%",
            translateY: "-50%",
            x: panelPosition.x,
            y: panelPosition.y
          }}
          onDragEnd={(_, info) => {
            setPanelPosition(prev => ({
              x: prev.x + info.offset.x,
              y: prev.y + info.offset.y
            }));
          }}
          data-testid="floating-chat-panel"
        >
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 cursor-grab active:cursor-grabbing z-10"
            onPointerDown={(e) => dragControls.start(e)}
            data-testid="drag-handle-chat"
          >
            <GripVertical size={12} className="text-white/40" />
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Drag to move</span>
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <button
              onClick={handleCollapse}
              className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Minimize"
              data-testid="button-minimize-chat"
            >
              <Minimize2 size={12} className="text-white/70" />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <CrewChat
              passengers={passengers}
              currentUser={currentUser}
              messages={messages}
              onSendMessage={onSendMessage}
              onVote={onVote}
              onStartPoll={onStartPoll}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
