import React, { useState, useEffect, createContext, useContext } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange, getUserById, createMissingDocuments, User } from '@/lib/firebaseAuth';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      console.log('=== AUTH STATE CHANGE ===');
      console.log('Firebase user:', firebaseUser);
      console.log('Firebase user UID:', firebaseUser?.uid);
      console.log('Firebase user email:', firebaseUser?.email);
      console.log('Firebase user displayName:', firebaseUser?.displayName);
      
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          console.log('Fetching user data for:', firebaseUser.uid);
          let userData = await getUserById(firebaseUser.uid);
          
          // If user document doesn't exist, create missing documents
          if (!userData) {
            console.log('User document not found, creating missing documents...');
            await createMissingDocuments(firebaseUser);
            userData = await getUserById(firebaseUser.uid);
          }
          
          console.log('User data fetched:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        console.log('No firebase user, setting user to null');
        setUser(null);
      }
      
      setLoading(false);
      console.log('=== END AUTH STATE CHANGE ===');
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // This will be handled by the login component
    // The auth state change will automatically update the user
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    // This will be handled by the registration component
    // The auth state change will automatically update the user
  };

  const logout = async () => {
    // This will be handled by the logout component
    // The auth state change will automatically update the user
  };

  const value = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider');
    // Return a default context to prevent crashes during development
    return {
      user: null,
      firebaseUser: null,
      loading: true,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
    };
  }
  return context;
}
