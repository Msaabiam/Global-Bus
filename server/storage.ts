import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, and, desc } from "drizzle-orm";
import {
  rooms,
  passengers,
  messages,
  polls,
  pollOptions,
  pollVotes,
  type Room,
  type InsertRoom,
  type Passenger,
  type InsertPassenger,
  type Message,
  type InsertMessage,
  type Poll,
  type InsertPoll,
  type PollOption,
  type InsertPollOption,
  type PollVote,
  type InsertPollVote,
} from "@shared/schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  createRoom(room: InsertRoom): Promise<Room>;
  getRoom(id: string): Promise<Room | undefined>;
  getRoomByName(name: string): Promise<Room | undefined>;
  updateRoomDestination(roomId: string, destinationId: string, locationState: string): Promise<void>;
  updateRoomBusStyle(roomId: string, busStyle: string): Promise<void>;

  createPassenger(passenger: InsertPassenger): Promise<Passenger>;
  getPassenger(id: string): Promise<Passenger | undefined>;
  getPassengersByRoom(roomId: string): Promise<Passenger[]>;
  updatePassengerXP(passengerId: string, xp: number, level: number): Promise<void>;
  removePassenger(id: string): Promise<void>;

  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByRoom(roomId: string, limit?: number): Promise<Message[]>;

  createPoll(poll: InsertPoll): Promise<Poll>;
  getPollsByRoom(roomId: string): Promise<Poll[]>;
  getActivePoll(roomId: string): Promise<Poll | undefined>;
  closePoll(pollId: string): Promise<void>;

  createPollOption(option: InsertPollOption): Promise<PollOption>;
  getPollOptions(pollId: string): Promise<PollOption[]>;
  incrementOptionVotes(optionId: string): Promise<void>;

  createPollVote(vote: InsertPollVote): Promise<PollVote>;
  hasVoted(pollId: string, passengerId: string): Promise<boolean>;
}

export class DBStorage implements IStorage {
  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const [room] = await db.insert(rooms).values(insertRoom).returning();
    return room;
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  async getRoomByName(name: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.name, name));
    return room;
  }

  async updateRoomDestination(roomId: string, destinationId: string, locationState: string): Promise<void> {
    await db
      .update(rooms)
      .set({ currentDestinationId: destinationId, locationState })
      .where(eq(rooms.id, roomId));
  }

  async updateRoomBusStyle(roomId: string, busStyle: string): Promise<void> {
    await db.update(rooms).set({ busStyle }).where(eq(rooms.id, roomId));
  }

  async createPassenger(insertPassenger: InsertPassenger): Promise<Passenger> {
    const [passenger] = await db.insert(passengers).values(insertPassenger).returning();
    return passenger;
  }

  async getPassenger(id: string): Promise<Passenger | undefined> {
    const [passenger] = await db.select().from(passengers).where(eq(passengers.id, id));
    return passenger;
  }

  async getPassengersByRoom(roomId: string): Promise<Passenger[]> {
    return db.select().from(passengers).where(eq(passengers.roomId, roomId));
  }

  async updatePassengerXP(passengerId: string, xp: number, level: number): Promise<void> {
    await db.update(passengers).set({ xp, level }).where(eq(passengers.id, passengerId));
  }

  async removePassenger(id: string): Promise<void> {
    await db.delete(passengers).where(eq(passengers.id, id));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getMessagesByRoom(roomId: string, limit = 50): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.roomId, roomId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async createPoll(insertPoll: InsertPoll): Promise<Poll> {
    const [poll] = await db.insert(polls).values(insertPoll).returning();
    return poll;
  }

  async getPollsByRoom(roomId: string): Promise<Poll[]> {
    return db.select().from(polls).where(eq(polls.roomId, roomId)).orderBy(desc(polls.createdAt));
  }

  async getActivePoll(roomId: string): Promise<Poll | undefined> {
    const [poll] = await db
      .select()
      .from(polls)
      .where(and(eq(polls.roomId, roomId), eq(polls.isActive, true)))
      .limit(1);
    return poll;
  }

  async closePoll(pollId: string): Promise<void> {
    await db.update(polls).set({ isActive: false }).where(eq(polls.id, pollId));
  }

  async createPollOption(insertOption: InsertPollOption): Promise<PollOption> {
    const [option] = await db.insert(pollOptions).values(insertOption).returning();
    return option;
  }

  async getPollOptions(pollId: string): Promise<PollOption[]> {
    return db.select().from(pollOptions).where(eq(pollOptions.pollId, pollId));
  }

  async incrementOptionVotes(optionId: string): Promise<void> {
    const [option] = await db.select().from(pollOptions).where(eq(pollOptions.id, optionId));
    if (option) {
      await db
        .update(pollOptions)
        .set({ votes: option.votes + 1 })
        .where(eq(pollOptions.id, optionId));
    }
  }

  async createPollVote(insertVote: InsertPollVote): Promise<PollVote> {
    const [vote] = await db.insert(pollVotes).values(insertVote).returning();
    return vote;
  }

  async hasVoted(pollId: string, passengerId: string): Promise<boolean> {
    const [vote] = await db
      .select()
      .from(pollVotes)
      .where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.passengerId, passengerId)))
      .limit(1);
    return !!vote;
  }
}

export const storage = new DBStorage();
