import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Additional registration fields
  fullName: varchar("full_name").notNull(),
  gender: varchar("gender").notNull(), // male, female
  dateOfBirth: varchar("date_of_birth").notNull(), // DD/MM/YYYY format
  religion: varchar("religion").notNull(),
  caste: varchar("caste"),
  subCaste: varchar("sub_caste"),
  mobileNo: varchar("mobile_no").notNull(),
  password: varchar("password").notNull(), // will be hashed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Extended profile information for matrimony
export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  age: integer("age").notNull(),
  gender: varchar("gender").notNull(),
  location: varchar("location").notNull(),
  profession: varchar("profession").notNull(),
  bio: text("bio"),
  education: varchar("education"),
  verified: boolean("verified").default(false),
  kidsPreference: varchar("kids_preference"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Likes system
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  likerId: varchar("liker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  likedId: varchar("liked_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Matches when both users like each other
export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: varchar("user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  user2Id: varchar("user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  messageType: varchar("message_type").default("text"), // text, audio, video
  createdAt: timestamp("created_at").defaultNow(),
});

// Event vendors
export const eventVendors = pgTable("event_vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // wedding_halls, catering, photography, makeup
  description: text("description"),
  location: varchar("location").notNull(),
  contactPhone: varchar("contact_phone"),
  contactEmail: varchar("contact_email"),
  startingPrice: integer("starting_price"),
  imageUrl: varchar("image_url"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  sentLikes: many(likes, { relationName: "liker" }),
  receivedLikes: many(likes, { relationName: "liked" }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  liker: one(users, {
    fields: [likes.likerId],
    references: [users.id],
    relationName: "liker",
  }),
  liked: one(users, {
    fields: [likes.likedId],
    references: [users.id],
    relationName: "liked",
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  user1: one(users, {
    fields: [matches.user1Id],
    references: [users.id],
    relationName: "user1",
  }),
  user2: one(users, {
    fields: [matches.user2Id],
    references: [users.id],
    relationName: "user2",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  match: one(matches, {
    fields: [messages.matchId],
    references: [matches.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// Constants for validation and restricted values
export const RELIGIONS = [
  "Hindu", "Islam", "Christian", "Sikh", "Buddhist", "Jain", "Parsi", "Jewish", "Other"
] as const;

export const CASTES = [
  "Brahmin", "Kshatriya", "Vaishya", "Shudra", "SC", "ST", "OBC", "General", "No Caste", "Other"
] as const;

export const SUB_CASTES = [
  "Iyer", "Iyengar", "Reddy", "Naidu", "Chettiar", "Pillai", "Nair", "Menon", "Sharma", "Gupta",
  "Agarwal", "Bansal", "Jain", "Marwari", "Punjabi", "Gujarati", "Bengali", "Tamil", "Telugu",
  "Kannada", "Malayalam", "Marathi", "Other"
] as const;

// Restricted name patterns (should not be allowed)
export const RESTRICTED_NAME_PATTERNS = [
  "admin", "test", "demo", "null", "undefined", "admin123", "user123", "temp", "fake",
  "example", "sample", "default", "guest", "anonymous", "unknown", "notset"
] as const;

// Restricted email domains
export const RESTRICTED_EMAIL_DOMAINS = [
  "tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com",
  "temp-mail.org", "throwaway.email", "fakeemail.com", "example.com", "test.com"
] as const;

// Registration schema with validation
export const userRegistrationSchema = z.object({
  fullName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .refine((name) => {
      const lowerName = name.toLowerCase();
      return !RESTRICTED_NAME_PATTERNS.some(pattern => lowerName.includes(pattern));
    }, "Please enter a valid name"),
  
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a valid gender" })
  }),
  
  dateOfBirth: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format")
    .refine((date) => {
      const [day, month, year] = date.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 70;
    }, "Age must be between 18 and 70 years"),
  
  religion: z.enum(RELIGIONS, {
    errorMap: () => ({ message: "Please select a valid religion" })
  }),
  
  caste: z.enum(CASTES).optional(),
  
  subCaste: z.enum(SUB_CASTES).optional(),
  
  mobileNo: z.string()
    .regex(/^\+91[6-9]\d{9}$/, "Please enter a valid Indian mobile number (+91XXXXXXXXXX)")
    .refine((mobile) => {
      // Check for patterns like repeated digits
      const digits = mobile.slice(3); // Remove +91
      return !/(\d)\1{7,}/.test(digits); // No more than 7 consecutive same digits
    }, "Please enter a valid mobile number"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .refine((email) => {
      const domain = email.split('@')[1]?.toLowerCase();
      return !RESTRICTED_EMAIL_DOMAINS.includes(domain as any);
    }, "Please use a valid email address"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain uppercase, lowercase, number and special character")
});

// Schemas for validation
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type Match = typeof matches.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type EventVendor = typeof eventVendors.$inferSelect;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
