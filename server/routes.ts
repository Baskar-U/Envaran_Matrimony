import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProfileSchema, insertLikeSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const profile = await storage.getProfile(userId);
      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Development route to test with sample data (remove in production)
  app.get('/api/auth/test-user', async (req, res) => {
    try {
      if (process.env.NODE_ENV !== 'development') {
        return res.status(404).json({ message: "Not found" });
      }
      
      const user = await storage.getUser('user1');
      const profile = await storage.getProfile('user1');
      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching test user:", error);
      res.status(500).json({ message: "Failed to fetch test user" });
    }
  });

  // Profile routes
  app.post('/api/profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertProfileSchema.parse({ ...req.body, userId });
      
      const existingProfile = await storage.getProfile(userId);
      if (existingProfile) {
        const updatedProfile = await storage.updateProfile(userId, profileData);
        res.json(updatedProfile);
      } else {
        const profile = await storage.createProfile(profileData);
        res.json(profile);
      }
    } catch (error) {
      console.error("Error creating/updating profile:", error);
      res.status(400).json({ message: "Failed to create/update profile" });
    }
  });

  app.get('/api/profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profiles = await storage.getProfiles(userId);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Development route to test profiles (remove in production)
  app.get('/api/test-profiles', async (req, res) => {
    try {
      if (process.env.NODE_ENV !== 'development') {
        return res.status(404).json({ message: "Not found" });
      }
      
      const profiles = await storage.getProfiles('user1');
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching test profiles:", error);
      res.status(500).json({ message: "Failed to fetch test profiles" });
    }
  });

  // Like routes
  app.post('/api/likes', isAuthenticated, async (req: any, res) => {
    try {
      const likerId = req.user.claims.sub;
      const { likedId } = req.body;
      
      const existingLike = await storage.getLike(likerId, likedId);
      if (existingLike) {
        return res.status(400).json({ message: "Already liked this profile" });
      }

      const like = await storage.createLike({ likerId, likedId });
      
      // Check for mutual like and create match
      const isMutual = await storage.checkMutualLike(likerId, likedId);
      if (isMutual) {
        await storage.createMatch(likerId, likedId);
      }
      
      res.json({ like, matched: isMutual });
    } catch (error) {
      console.error("Error creating like:", error);
      res.status(400).json({ message: "Failed to create like" });
    }
  });

  // Match routes
  app.get('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Message routes
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({ ...req.body, senderId });
      
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Failed to create message" });
    }
  });

  app.get('/api/messages/:matchId', isAuthenticated, async (req: any, res) => {
    try {
      const { matchId } = req.params;
      const messages = await storage.getMatchMessages(matchId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Event vendor routes
  app.get('/api/event-vendors', async (req, res) => {
    try {
      const { category } = req.query;
      const vendors = await storage.getEventVendors(category as string);
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching event vendors:", error);
      res.status(500).json({ message: "Failed to fetch event vendors" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

export { registerRoutes };
