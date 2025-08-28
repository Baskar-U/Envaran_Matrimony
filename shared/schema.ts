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
  professionOther: varchar("profession_other"),
  bio: text("bio"),
  education: varchar("education"),
  educationOther: varchar("education_other"),
  educationSpecification: varchar("education_specification"),
  educationSpecificationOther: varchar("education_specification_other"),
  relationshipStatus: varchar("relationship_status"), // never_married, divorced, widowed, separated
  religion: varchar("religion"),
  caste: varchar("caste"),
  subCaste: varchar("sub_caste"),
  motherTongue: varchar("mother_tongue"),
  smoking: varchar("smoking"), // yes, no, occasionally
  drinking: varchar("drinking"), // yes, no, occasionally
  lifestyle: varchar("lifestyle"), // vegetarian, non-vegetarian, vegan, eggetarian
  hobbies: text("hobbies"), // JSON array of hobbies
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

export const MOTHER_TONGUES = [
  "Hindi", "English", "Bengali", "Telugu", "Marathi", "Tamil", "Gujarati", "Kannada", "Malayalam", 
  "Punjabi", "Odia", "Assamese", "Sanskrit", "Urdu", "Sindhi", "Kashmiri", "Konkani", "Manipuri", 
  "Nepali", "Bodo", "Santhali", "Dogri", "Maithili", "Other"
] as const;

export const SMOKING_OPTIONS = [
  "Yes", "No", "Occasionally", "Quit"
] as const;

export const DRINKING_OPTIONS = [
  "Yes", "No", "Occasionally", "Quit"
] as const;

export const LIFESTYLE_OPTIONS = [
  "Vegetarian", "Non-Vegetarian", "Vegan", "Eggetarian", "Jain"
] as const;

export const HOBBIES_OPTIONS = [
  "Reading", "Writing", "Traveling", "Cooking", "Gardening", "Photography", "Painting", "Drawing",
  "Music", "Dancing", "Singing", "Sports", "Gym", "Yoga", "Meditation", "Swimming", "Cycling",
  "Hiking", "Trekking", "Fishing", "Gaming", "Watching Movies", "Listening to Music", "Shopping",
  "Fashion", "Beauty", "Technology", "Coding", "Blogging", "Social Media", "Volunteering",
  "Teaching", "Learning New Languages", "Playing Instruments", "Chess", "Puzzles", "Collecting",
  "DIY Projects", "Interior Design", "Fashion Design", "Other"
] as const;

// Religion-specific caste and sub-caste mappings
export const RELIGION_CASTE_MAPPING = {
  "Hindu": [
    "Brahmin", "Kshatriya", "Vaishya", "Shudra", "SC", "ST", "OBC", "General", "No Caste", "Other"
  ],
  "Islam": [
    "Sunni", "Shia", "Ahmadiyya", "Sufi", "Other"
  ],
  "Christian": [
    "Catholic", "Protestant", "Orthodox", "Anglican", "Baptist", "Methodist", "Lutheran", "Other"
  ],
  "Sikh": [
    "Jat", "Khatri", "Ramgharia", "Ahluwalia", "Other"
  ],
  "Buddhist": [
    "Mahayana", "Theravada", "Vajrayana", "Zen", "Other"
  ],
  "Jain": [
    "Digambara", "Shwetambara", "Other"
  ],
  "Parsi": [
    "Zoroastrian", "Other"
  ],
  "Jewish": [
    "Ashkenazi", "Sephardi", "Mizrahi", "Other"
  ],
  "Other": [
    "Other"
  ]
} as const;

export const CASTE_SUBCASTE_MAPPING = {
  "Brahmin": [
    "Iyer", "Iyengar", "Sharma", "Bhatt", "Pandit", "Mishra", "Tiwari", "Trivedi", "Chaturvedi", "Vajpayee", "Other"
  ],
  "Kshatriya": [
    "Rajput", "Thakur", "Singh", "Chauhan", "Tomar", "Pratihar", "Rathore", "Other"
  ],
  "Vaishya": [
    "Agarwal", "Bansal", "Goyal", "Gupta", "Jain", "Marwari", "Oswal", "Other"
  ],
  "Shudra": [
    "Yadav", "Kurmi", "Lodhi", "Jat", "Other"
  ],
  "SC": [
    "Chamar", "Mahar", "Mang", "Bhanghi", "Other"
  ],
  "ST": [
    "Gond", "Bhil", "Santal", "Munda", "Other"
  ],
  "OBC": [
    "Kurmi", "Yadav", "Lodhi", "Gujjar", "Other"
  ],
  "General": [
    "General", "Other"
  ],
  "No Caste": [
    "No Caste", "Other"
  ],
  "Other": [
    "Other"
  ]
} as const;

export const RELATIONSHIP_STATUSES = [
  "never_married", "divorced", "widowed", "separated"
] as const;

export const EDUCATION_LEVELS = [
  "High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Professional Degree", "Other"
] as const;

export const PROFESSIONS = [
  "Software Engineer", "Doctor", "Teacher", "Business Owner", "Manager", "Accountant", "Lawyer", "Designer", "Marketing", "Sales", "Healthcare", "Education", "Finance", "Technology", "Other"
] as const;

export const EDUCATION_SPECIFICATIONS = {
  "Bachelor's Degree": [
    "Computer Science", "Information Technology", "Electronics", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Chemical Engineering", "Biotechnology", "Business Administration", "Commerce", "Economics", "Finance", "Marketing", "Human Resources", "Psychology", "Sociology", "English Literature", "History", "Political Science", "Mathematics", "Physics", "Chemistry", "Biology", "Medicine", "Nursing", "Pharmacy", "Law", "Architecture", "Design", "Arts", "Music", "Other"
  ],
  "Master's Degree": [
    "Computer Science", "Information Technology", "Data Science", "Artificial Intelligence", "Machine Learning", "Software Engineering", "Cybersecurity", "Business Administration (MBA)", "Finance", "Marketing", "Human Resources", "Economics", "Psychology", "Sociology", "Education", "Public Health", "Law", "Architecture", "Design", "Arts", "Other"
  ],
  "PhD": [
    "Computer Science", "Information Technology", "Data Science", "Artificial Intelligence", "Machine Learning", "Business Administration", "Finance", "Economics", "Psychology", "Sociology", "Education", "Public Health", "Law", "Architecture", "Design", "Arts", "Other"
  ],
  "Professional Degree": [
    "Medicine (MBBS)", "Law (LLB)", "Architecture (B.Arch)", "Pharmacy (B.Pharm)", "Nursing (B.Sc Nursing)", "Dental Surgery (BDS)", "Veterinary Science (BVSc)", "Other"
  ],
  "Diploma": [
    "Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Electrical", "Chemical", "Business Administration", "Commerce", "Design", "Arts", "Other"
  ]
} as const;

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
export const insertProfileSchema = z.object({
  userId: z.string(),
  age: z.number().min(18).max(100),
  gender: z.string(),
  location: z.string(),
  profession: z.string(),
  professionOther: z.string().optional(),
  bio: z.string().optional(),
  education: z.string().optional(),
  educationOther: z.string().optional(),
  educationSpecification: z.string().optional(),
  educationSpecificationOther: z.string().optional(),
  relationshipStatus: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  motherTongue: z.string().optional(),
  smoking: z.string().optional(),
  drinking: z.string().optional(),
  lifestyle: z.string().optional(),
  hobbies: z.string().optional(),
  verified: z.boolean().optional(),
  kidsPreference: z.string().optional(),
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
