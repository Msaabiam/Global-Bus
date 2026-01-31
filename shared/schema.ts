import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  currentDestinationId: text("current_destination_id").notNull().default("shinjuku"),
  locationState: text("location_state").notNull().default("transit"),
  busStyle: text("bus_style").notNull().default("party"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const passengers = pgTable("passengers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  role: text("role").notNull(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  isVip: boolean("is_vip").notNull().default(false),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  passengerId: varchar("passenger_id").references(() => passengers.id, { onDelete: "set null" }),
  user: text("user").notNull(),
  avatar: text("avatar").notNull().default(""),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const polls = pgTable("polls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pollOptions = pgTable("poll_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pollId: varchar("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  destinationId: text("destination_id").notNull(),
  text: text("text").notNull(),
  votes: integer("votes").notNull().default(0),
});

export const pollVotes = pgTable("poll_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pollId: varchar("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  passengerId: varchar("passenger_id").notNull().references(() => passengers.id, { onDelete: "cascade" }),
  optionId: varchar("option_id").notNull().references(() => pollOptions.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({ id: true, createdAt: true });
export const insertPassengerSchema = createInsertSchema(passengers).omit({ id: true, joinedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertPollSchema = createInsertSchema(polls).omit({ id: true, createdAt: true });
export const insertPollOptionSchema = createInsertSchema(pollOptions).omit({ id: true });
export const insertPollVoteSchema = createInsertSchema(pollVotes).omit({ id: true, createdAt: true });

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export type InsertPassenger = z.infer<typeof insertPassengerSchema>;
export type Passenger = typeof passengers.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertPoll = z.infer<typeof insertPollSchema>;
export type Poll = typeof polls.$inferSelect;

export type InsertPollOption = z.infer<typeof insertPollOptionSchema>;
export type PollOption = typeof pollOptions.$inferSelect;

export type InsertPollVote = z.infer<typeof insertPollVoteSchema>;
export type PollVote = typeof pollVotes.$inferSelect;
