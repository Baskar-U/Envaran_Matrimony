import {
  users,
  profiles,
  likes,
  matches,
  messages,
  eventVendors,
  type User,
  type UpsertUser,
  type Profile,
  type InsertProfile,
  type Like,
  type InsertLike,
  type Match,
  type Message,
  type InsertMessage,
  type EventVendor,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ne } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Profile operations
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile>;
  getProfiles(excludeUserId?: string, limit?: number): Promise<(Profile & { user: User })[]>;
  
  // Like operations
  createLike(like: InsertLike): Promise<Like>;
  getLike(likerId: string, likedId: string): Promise<Like | undefined>;
  checkMutualLike(user1Id: string, user2Id: string): Promise<boolean>;
  
  // Match operations
  createMatch(user1Id: string, user2Id: string): Promise<Match>;
  getUserMatches(userId: string): Promise<Match[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMatchMessages(matchId: string): Promise<(Message & { sender: User })[]>;
  
  // Event vendor operations
  getEventVendors(category?: string): Promise<EventVendor[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Profile operations
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  async getProfiles(excludeUserId?: string, limit = 50): Promise<(Profile & { user: User })[]> {
    const baseQuery = db
      .select({
        id: profiles.id,
        userId: profiles.userId,
        age: profiles.age,
        gender: profiles.gender,
        location: profiles.location,
        profession: profiles.profession,
        bio: profiles.bio,
        education: profiles.education,
        verified: profiles.verified,
        kidsPreference: profiles.kidsPreference,
        createdAt: profiles.createdAt,
        updatedAt: profiles.updatedAt,
        user: users,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .limit(limit);

    if (excludeUserId) {
      return await baseQuery.where(ne(profiles.userId, excludeUserId));
    }

    return await baseQuery;
  }

  // Like operations
  async createLike(like: InsertLike): Promise<Like> {
    const [newLike] = await db.insert(likes).values(like).returning();
    return newLike;
  }

  async getLike(likerId: string, likedId: string): Promise<Like | undefined> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.likerId, likerId), eq(likes.likedId, likedId)));
    return like;
  }

  async checkMutualLike(user1Id: string, user2Id: string): Promise<boolean> {
    const like1 = await this.getLike(user1Id, user2Id);
    const like2 = await this.getLike(user2Id, user1Id);
    return !!(like1 && like2);
  }

  // Match operations
  async createMatch(user1Id: string, user2Id: string): Promise<Match> {
    const [match] = await db
      .insert(matches)
      .values({ user1Id, user2Id })
      .returning();
    return match;
  }

  async getUserMatches(userId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)));
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMatchMessages(matchId: string): Promise<(Message & { sender: User })[]> {
    return await db
      .select({
        id: messages.id,
        matchId: messages.matchId,
        senderId: messages.senderId,
        content: messages.content,
        messageType: messages.messageType,
        createdAt: messages.createdAt,
        sender: users,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.matchId, matchId))
      .orderBy(messages.createdAt);
  }

  // Event vendor operations
  async getEventVendors(category?: string): Promise<EventVendor[]> {
    const baseQuery = db.select().from(eventVendors);
    
    if (category) {
      return await baseQuery.where(eq(eventVendors.category, category));
    }
    
    return await baseQuery;
  }
}

export const storage = new DatabaseStorage();
