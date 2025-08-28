import {
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
import fs from 'fs';
import path from 'path';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(userData: UpsertUser): Promise<User>;
  
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

class LocalStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private profiles: Map<string, Profile> = new Map();
  private likes: Map<string, Like> = new Map();
  private matches: Map<string, Match> = new Map();
  private messages: Map<string, Message> = new Map();
  private eventVendors: EventVendor[] = [];
  private dataDir = path.join(process.cwd(), '.local-data');

  constructor() {
    this.ensureDataDirectory();
    this.loadData();
    this.initializeSampleData();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private getDataFilePath(filename: string): string {
    return path.join(this.dataDir, filename);
  }

  private loadData() {
    try {
      // Load users
      const usersPath = this.getDataFilePath('users.json');
      if (fs.existsSync(usersPath)) {
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        this.users = new Map(Object.entries(usersData));
      }

      // Load profiles
      const profilesPath = this.getDataFilePath('profiles.json');
      if (fs.existsSync(profilesPath)) {
        const profilesData = JSON.parse(fs.readFileSync(profilesPath, 'utf-8'));
        console.log('Loaded profiles data:', profilesData);
        this.profiles = new Map(Object.entries(profilesData));
      }

      // Load likes
      const likesPath = this.getDataFilePath('likes.json');
      if (fs.existsSync(likesPath)) {
        const likesData = JSON.parse(fs.readFileSync(likesPath, 'utf-8'));
        this.likes = new Map(Object.entries(likesData));
      }

      // Load matches
      const matchesPath = this.getDataFilePath('matches.json');
      if (fs.existsSync(matchesPath)) {
        const matchesData = JSON.parse(fs.readFileSync(matchesPath, 'utf-8'));
        this.matches = new Map(Object.entries(matchesData));
      }

      // Load messages
      const messagesPath = this.getDataFilePath('messages.json');
      if (fs.existsSync(messagesPath)) {
        const messagesData = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
        this.messages = new Map(Object.entries(messagesData));
      }

      // Load event vendors
      const vendorsPath = this.getDataFilePath('eventVendors.json');
      if (fs.existsSync(vendorsPath)) {
        this.eventVendors = JSON.parse(fs.readFileSync(vendorsPath, 'utf-8'));
      }
    } catch (error) {
      console.log('No existing data found, starting fresh');
    }
  }

  private saveData() {
    try {
      // Save users
      const usersData = Object.fromEntries(this.users);
      fs.writeFileSync(this.getDataFilePath('users.json'), JSON.stringify(usersData, null, 2));

      // Save profiles
      const profilesData = Object.fromEntries(this.profiles);
      console.log('Saving profiles data:', profilesData);
      fs.writeFileSync(this.getDataFilePath('profiles.json'), JSON.stringify(profilesData, null, 2));

      // Save likes
      const likesData = Object.fromEntries(this.likes);
      fs.writeFileSync(this.getDataFilePath('likes.json'), JSON.stringify(likesData, null, 2));

      // Save matches
      const matchesData = Object.fromEntries(this.matches);
      fs.writeFileSync(this.getDataFilePath('matches.json'), JSON.stringify(matchesData, null, 2));

      // Save messages
      const messagesData = Object.fromEntries(this.messages);
      fs.writeFileSync(this.getDataFilePath('messages.json'), JSON.stringify(messagesData, null, 2));

      // Save event vendors
      fs.writeFileSync(this.getDataFilePath('eventVendors.json'), JSON.stringify(this.eventVendors, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  private initializeSampleData() {
    // Initialize sample event vendors if none exist
    if (this.eventVendors.length === 0) {
      this.eventVendors = [
        {
          id: '1',
          name: 'Grand Plaza Hotel',
          category: 'wedding_halls',
          description: 'Elegant wedding venue with modern amenities',
          location: 'Downtown',
          contactPhone: '+1-555-0123',
          contactEmail: 'info@grandplaza.com',
          startingPrice: 50000,
          imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
          verified: true,
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Delicious Catering Co.',
          category: 'catering',
          description: 'Premium catering services for all occasions',
          location: 'City Center',
          contactPhone: '+1-555-0124',
          contactEmail: 'info@deliciouscatering.com',
          startingPrice: 25000,
          imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
          verified: true,
          createdAt: new Date()
        },
        {
          id: '3',
          name: 'Perfect Moments Photography',
          category: 'photography',
          description: 'Professional wedding photography and videography',
          location: 'Various Locations',
          contactPhone: '+1-555-0125',
          contactEmail: 'info@perfectmoments.com',
          startingPrice: 35000,
          imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
          verified: true,
          createdAt: new Date()
        },
        {
          id: '4',
          name: 'Blissful Decorations',
          category: 'decorations',
          description: 'Beautiful floral arrangements and decorations',
          location: 'Garden District',
          contactPhone: '+1-555-0126',
          contactEmail: 'info@blissfuldecor.com',
          startingPrice: 15000,
          imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
          verified: true,
          createdAt: new Date()
        }
      ];
      this.saveData();
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id || this.generateId(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      fullName: userData.fullName,
      gender: userData.gender,
      dateOfBirth: userData.dateOfBirth,
      religion: userData.religion,
      caste: userData.caste,
      subCaste: userData.subCaste,
      mobileNo: userData.mobileNo,
      password: userData.password,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(user.id, user);
    this.saveData();
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    return this.upsertUser(userData);
  }

  // Profile operations
  async getProfile(userId: string): Promise<Profile | undefined> {
    const profile = this.profiles.get(userId);
    console.log('Getting profile for user:', userId);
    console.log('Profile found:', profile);
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    console.log('Creating new profile with data:', profile);
    
    const newProfile: Profile = {
      id: this.generateId(),
      userId: profile.userId,
      age: profile.age,
      gender: profile.gender,
      location: profile.location,
      profession: profile.profession,
      professionOther: profile.professionOther,
      bio: profile.bio,
      education: profile.education,
      educationOther: profile.educationOther,
      educationSpecification: profile.educationSpecification,
      educationSpecificationOther: profile.educationSpecificationOther,
      relationshipStatus: profile.relationshipStatus,
      religion: profile.religion,
      caste: profile.caste,
      subCaste: profile.subCaste,
      motherTongue: profile.motherTongue,
      smoking: profile.smoking,
      drinking: profile.drinking,
      lifestyle: profile.lifestyle,
      hobbies: profile.hobbies,
      verified: profile.verified || false,
      kidsPreference: profile.kidsPreference,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Created new profile:', newProfile);
    this.profiles.set(profile.userId, newProfile);
    this.saveData();
    return newProfile;
  }

  async updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile> {
    const existingProfile = this.profiles.get(userId);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    console.log('Updating profile for user:', userId);
    console.log('Existing profile:', existingProfile);
    console.log('New profile data:', profile);

    const updatedProfile: Profile = {
      ...existingProfile,
      ...profile,
      updatedAt: new Date()
    };
    
    console.log('Updated profile:', updatedProfile);
    this.profiles.set(userId, updatedProfile);
    this.saveData();
    return updatedProfile;
  }

  async getProfiles(excludeUserId?: string, limit = 50): Promise<(Profile & { user: User })[]> {
    const profiles = Array.from(this.profiles.values())
      .filter(profile => !excludeUserId || profile.userId !== excludeUserId)
      .slice(0, limit)
      .map(profile => {
        const user = this.users.get(profile.userId);
        if (!user) throw new Error(`User not found for profile ${profile.userId}`);
        return { ...profile, user };
      });
    
    return profiles;
  }

  // Like operations
  async createLike(like: InsertLike): Promise<Like> {
    const likeId = `${like.likerId}-${like.likedId}`;
    const newLike: Like = {
      id: this.generateId(),
      likerId: like.likerId,
      likedId: like.likedId,
      createdAt: new Date()
    };
    
    this.likes.set(likeId, newLike);
    this.saveData();
    return newLike;
  }

  async getLike(likerId: string, likedId: string): Promise<Like | undefined> {
    const likeId = `${likerId}-${likedId}`;
    return this.likes.get(likeId);
  }

  async checkMutualLike(user1Id: string, user2Id: string): Promise<boolean> {
    const like1 = await this.getLike(user1Id, user2Id);
    const like2 = await this.getLike(user2Id, user1Id);
    return !!(like1 && like2);
  }

  // Match operations
  async createMatch(user1Id: string, user2Id: string): Promise<Match> {
    const matchId = [user1Id, user2Id].sort().join('-');
    const newMatch: Match = {
      id: this.generateId(),
      user1Id,
      user2Id,
      createdAt: new Date()
    };
    
    this.matches.set(matchId, newMatch);
    this.saveData();
    return newMatch;
  }

  async getUserMatches(userId: string): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => match.user1Id === userId || match.user2Id === userId);
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = {
      id: this.generateId(),
      matchId: message.matchId,
      senderId: message.senderId,
      content: message.content,
      messageType: message.messageType || 'text',
      createdAt: new Date()
    };
    
    this.messages.set(newMessage.id, newMessage);
    this.saveData();
    return newMessage;
  }

  async getMatchMessages(matchId: string): Promise<(Message & { sender: User })[]> {
    return Array.from(this.messages.values())
      .filter(message => message.matchId === matchId)
      .map(message => {
        const sender = this.users.get(message.senderId);
        if (!sender) throw new Error(`User not found for message ${message.id}`);
        return { ...message, sender };
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  // Event vendor operations
  async getEventVendors(category?: string): Promise<EventVendor[]> {
    if (category) {
      return this.eventVendors.filter(vendor => vendor.category === category);
    }
    return this.eventVendors;
  }
}

export const storage = new LocalStorage();
