import type { Express } from "express";
import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import {
  insertRoomSchema,
  insertPassengerSchema,
  insertMessageSchema,
  insertPollSchema,
  insertPollOptionSchema,
  insertPollVoteSchema,
} from "@shared/schema";

interface WSClient extends WebSocket {
  roomId?: string;
  passengerId?: string;
}

const roomClients = new Map<string, Set<WSClient>>();

function broadcast(roomId: string, message: any) {
  const clients = roomClients.get(roomId);
  if (clients) {
    const payload = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<void> {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WSClient) => {
    console.log("[ws] WebSocket client connected");

    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "join":
            ws.roomId = message.roomId;
            ws.passengerId = message.passengerId;

            if (!roomClients.has(message.roomId)) {
              roomClients.set(message.roomId, new Set());
            }
            roomClients.get(message.roomId)!.add(ws);

            const passengers = await storage.getPassengersByRoom(message.roomId);
            broadcast(message.roomId, {
              type: "passengers",
              passengers,
            });

            console.log(`[ws] Passenger ${message.passengerId} joined room ${message.roomId}`);
            break;

          case "chat":
            if (ws.roomId) {
              const msg = await storage.createMessage({
                roomId: ws.roomId,
                passengerId: ws.passengerId || null,
                user: message.user,
                avatar: message.avatar,
                message: message.message,
              });

              broadcast(ws.roomId, {
                type: "chat",
                message: msg,
              });
            }
            break;

          case "vote":
            if (ws.roomId && ws.passengerId) {
              const poll = await storage.getActivePoll(ws.roomId);
              if (!poll || poll.id !== message.pollId || !poll.isActive) {
                break;
              }

              const hasVoted = await storage.hasVoted(message.pollId, ws.passengerId);

              if (!hasVoted) {
                await storage.createPollVote({
                  pollId: message.pollId,
                  passengerId: ws.passengerId,
                  optionId: message.optionId,
                });

                await storage.incrementOptionVotes(message.optionId);

                const options = await storage.getPollOptions(message.pollId);
                broadcast(ws.roomId, {
                  type: "poll_update",
                  pollId: message.pollId,
                  options,
                });

                const passengers = await storage.getPassengersByRoom(ws.roomId);
                const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

                if (totalVotes >= passengers.length) {
                  const winner = options.reduce((max, opt) =>
                    opt.votes > max.votes ? opt : max
                  );

                  await storage.closePoll(message.pollId);
                  await storage.updateRoomDestination(ws.roomId, winner.destinationId, "transit");

                  broadcast(ws.roomId, {
                    type: "poll_closed",
                    pollId: message.pollId,
                  });

                  broadcast(ws.roomId, {
                    type: "travel",
                    destinationId: winner.destinationId,
                  });
                }
              }
            }
            break;
        }
      } catch (error) {
        console.log(`[ws] WebSocket error: ${error}`);
      }
    });

    ws.on("close", async () => {
      if (ws.roomId) {
        const clients = roomClients.get(ws.roomId);
        if (clients) {
          clients.delete(ws);

          if (ws.passengerId) {
            await storage.removePassenger(ws.passengerId);

            const passengers = await storage.getPassengersByRoom(ws.roomId);
            broadcast(ws.roomId, {
              type: "passengers",
              passengers,
            });
          }
        }
      }
      console.log("[ws] WebSocket client disconnected");
    });
  });

  app.post("/api/rooms", async (req, res) => {
    try {
      const data = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(data);
      res.json(room);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/rooms/:name", async (req, res) => {
    try {
      const room = await storage.getRoomByName(req.params.name);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/rooms/:id/bus-style", async (req, res) => {
    try {
      await storage.updateRoomBusStyle(req.params.id, req.body.busStyle);

      broadcast(req.params.id, {
        type: "bus_style",
        busStyle: req.body.busStyle,
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/passengers", async (req, res) => {
    try {
      const data = insertPassengerSchema.parse(req.body);
      const passenger = await storage.createPassenger(data);
      res.json(passenger);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/rooms/:roomId/passengers", async (req, res) => {
    try {
      const passengers = await storage.getPassengersByRoom(req.params.roomId);
      res.json(passengers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/passengers/:id/xp", async (req, res) => {
    try {
      await storage.updatePassengerXP(req.params.id, req.body.xp, req.body.level);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/rooms/:roomId/messages", async (req, res) => {
    try {
      const messages = await storage.getMessagesByRoom(req.params.roomId);
      res.json(messages.reverse());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/polls", async (req, res) => {
    try {
      const pollData = insertPollSchema.parse(req.body);
      const poll = await storage.createPoll(pollData);

      const options = await Promise.all(
        req.body.options.map((opt: any) =>
          storage.createPollOption({
            pollId: poll.id,
            destinationId: opt.destinationId,
            text: opt.text,
          })
        )
      );

      broadcast(pollData.roomId, {
        type: "new_poll",
        poll: { ...poll, options },
      });

      res.json({ ...poll, options });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/rooms/:roomId/active-poll", async (req, res) => {
    try {
      const poll = await storage.getActivePoll(req.params.roomId);
      if (!poll) {
        return res.json(null);
      }

      const options = await storage.getPollOptions(poll.id);
      res.json({ ...poll, options });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
