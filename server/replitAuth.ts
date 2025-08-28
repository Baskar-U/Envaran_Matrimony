import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import MemoryStore from "memorystore";
import { storage } from "./localStorage";

// For development, we'll use a simple local authentication
const isDevelopment = process.env.NODE_ENV === 'development';

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const MemoryStoreSession = MemoryStore(session);
  const sessionStore = new MemoryStoreSession({
    checkPeriod: 86400000, // prune expired entries every 24h
  });
  return session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
    },
  });
}

async function createTestUser() {
  const testUserId = 'test-user-1';
  const existingUser = await storage.getUser(testUserId);
  if (!existingUser) {
    await storage.upsertUser({
      id: testUserId,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      profileImageUrl: '',
      fullName: 'Test User',
      gender: 'male',
      dateOfBirth: '01/01/1990',
      religion: 'Other',
      mobileNo: '+919999999999',
      password: 'defaultPassword123!',
    });
  }
  return testUserId;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Simple local strategy for development
  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  // Create a test user for development
  if (isDevelopment) {
    await createTestUser();
  }

  // Firebase authentication is now used instead of server-side auth
  // Disabled old login endpoint to avoid conflicts
  app.get("/api/login", (req, res) => {
    res.status(404).json({ message: "Use Firebase authentication instead" });
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (isDevelopment) {
    // For development, always allow access
    if (!req.user) {
      // Auto-login for development
      const user = {
        id: 'test-user-1',
        email: 'test@example.com',
        name: 'Test User',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      };
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Authentication failed" });
        }
        next();
      });
    } else {
      next();
    }
  } else {
    // Production authentication logic would go here
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  }
};
