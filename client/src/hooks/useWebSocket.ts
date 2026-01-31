import { useEffect, useRef, useState, useCallback } from "react";

interface UseWebSocketProps {
  roomId: string | null;
  passengerId: string | null;
  onMessage?: (data: any) => void;
  onPassengers?: (passengers: any[]) => void;
  onChat?: (message: any) => void;
  onPollUpdate?: (pollId: string, options: any[]) => void;
  onNewPoll?: (poll: any) => void;
  onPollClosed?: (pollId: string) => void;
  onTravel?: (destinationId: string) => void;
  onBusStyle?: (busStyle: string) => void;
}

export function useWebSocket({
  roomId,
  passengerId,
  onMessage,
  onPassengers,
  onChat,
  onPollUpdate,
  onNewPoll,
  onPollClosed,
  onTravel,
  onBusStyle,
}: UseWebSocketProps) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId || !passengerId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({
        type: "join",
        roomId,
        passengerId,
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (onMessage) onMessage(data);

      switch (data.type) {
        case "passengers":
          if (onPassengers) onPassengers(data.passengers);
          break;
        case "chat":
          if (onChat) onChat(data.message);
          break;
        case "poll_update":
          if (onPollUpdate) onPollUpdate(data.pollId, data.options);
          break;
        case "new_poll":
          if (onNewPoll) onNewPoll(data.poll);
          break;
        case "poll_closed":
          if (onPollClosed) onPollClosed(data.pollId);
          break;
        case "travel":
          if (onTravel) onTravel(data.destinationId);
          break;
        case "bus_style":
          if (onBusStyle) onBusStyle(data.busStyle);
          break;
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [roomId, passengerId]);

  const sendMessage = useCallback((type: string, payload: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, ...payload }));
    }
  }, []);

  const sendChat = useCallback((user: string, avatar: string, message: string) => {
    sendMessage("chat", { user, avatar, message });
  }, [sendMessage]);

  const sendVote = useCallback((pollId: string, optionId: string) => {
    sendMessage("vote", { pollId, optionId });
  }, [sendMessage]);

  return {
    isConnected,
    sendChat,
    sendVote,
  };
}
