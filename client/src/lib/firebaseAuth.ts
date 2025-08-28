import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// User interface
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  profileImageUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  religion?: string;
  caste?: string;
  subCaste?: string;
  mobileNo?: string;
  notificationSettings?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    matchAlerts: boolean;
    messageAlerts: boolean;
    profileViews: boolean;
    weeklyDigest: boolean;
  };
  privacySettings?: {
    profileVisibility: string;
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    allowMessages: boolean;
    allowProfileViews: boolean;
    shareData: boolean;
  };
  languageSettings?: {
    language: string;
    timezone: string;
    dateFormat: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Profile interface
export interface Profile {
  id: string;
  userId: string;
  age: number;
  gender: string;
  location: string;
  profession: string;
  professionOther?: string;
  bio: string;
  education: string;
  educationOther?: string;
  educationSpecification?: string;
  educationSpecificationOther?: string;
  relationshipStatus: string;
  religion?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  smoking?: string;
  drinking?: string;
  lifestyle?: string;
  hobbies?: string;
  verified: boolean;
  kidsPreference: string;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication functions
export const registerWithEmail = async (email: string, password: string, userData: Partial<User>) => {
  try {
    console.log('Starting registration process...', { email, userData });
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Firebase Auth user created:', user.uid);

    // Update Firebase Auth profile
    const displayName = userData.fullName || 
      (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : '') || 
      (userData.firstName || userData.lastName || '');
    
    console.log('Updating Firebase Auth profile with:', { displayName, photoURL: userData.profileImageUrl || null });
    
    try {
      await updateFirebaseProfile(user, {
        displayName: displayName,
        photoURL: userData.profileImageUrl || null
      });
    } catch (profileError) {
      console.error('Error updating Firebase Auth profile:', profileError);
      // Continue with registration even if profile update fails
    }
    
    console.log('Firebase Auth profile updated');

    // Create user document in Firestore
    const userDoc = {
      id: user.uid,
      email: user.email!,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      fullName: userData.fullName || 
        (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : '') || 
        (userData.firstName || userData.lastName || ''),
      profileImageUrl: userData.profileImageUrl || '',
      gender: userData.gender || '',
      dateOfBirth: userData.dateOfBirth || '',
      religion: userData.religion || '',
      caste: userData.caste || '',
      subCaste: userData.subCaste || '',
      mobileNo: userData.mobileNo || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating user document in Firestore:', userDoc);
    
    try {
      console.log('Attempting to create user document in Firestore...');
      console.log('Database instance:', db);
      console.log('User UID:', user.uid);
      console.log('User document data:', userDoc);
      
      await setDoc(doc(db, 'users', user.uid), userDoc);
      console.log('✅ User document successfully created in Firestore');
      
      // Verify the document was created
      const verifyUserDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('✅ User document verification:', verifyUserDoc.exists());
      
    } catch (error: any) {
      console.error('❌ Error creating user document:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      
      // Don't throw error here, continue with profile creation
      console.log('⚠️ Continuing with profile creation despite user document error...');
    }

    // Create initial profile document
    try {
      console.log('Creating initial profile document...');
      const initialProfile = {
        userId: user.uid,
        age: userData.dateOfBirth ? calculateAge(userData.dateOfBirth) : 0,
        gender: userData.gender || '',
        location: '',
        profession: '',
        professionOther: '',
        bio: '',
        education: '',
        educationOther: '',
        educationSpecification: '',
        educationSpecificationOther: '',
        relationshipStatus: '',
        religion: userData.religion || '',
        caste: userData.caste || '',
        subCaste: userData.subCaste || '',
        motherTongue: '',
        smoking: '',
        drinking: '',
        lifestyle: '',
        hobbies: '',
        verified: false,
        kidsPreference: ''
      };

      console.log('Profile data to create:', initialProfile);
      
      await setDoc(doc(db, 'profiles', user.uid), {
        id: user.uid,
        ...initialProfile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Initial profile document created in Firestore');
      
      // Verify the document was created
      const verifyDoc = await getDoc(doc(db, 'profiles', user.uid));
      console.log('✅ Profile document verification:', verifyDoc.exists());
      
    } catch (error: any) {
      console.error('❌ Error creating profile document:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      // Don't throw error here, as user creation was successful
    }

    return { user, userData: userDoc };
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists. Please try signing in instead.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please choose a stronger password.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Email/password accounts are not enabled. Please contact support.');
    } else {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email. Please check your email or create a new account.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled. Please contact support.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please try again later.');
    } else {
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteAccount = async (password?: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    // If password is provided, re-authenticate the user
    if (password && user.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        console.log('User re-authenticated successfully');
      } catch (reauthError: any) {
        if (reauthError.code === 'auth/wrong-password') {
          throw new Error('Incorrect password. Please try again.');
        } else {
          throw new Error('Re-authentication failed. Please try again.');
        }
      }
    }

    // Delete user document from Firestore
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      console.log('User document deleted from Firestore');
    } catch (error) {
      console.error('Error deleting user document:', error);
    }

    // Delete user profile from Firestore
    try {
      await deleteDoc(doc(db, 'profiles', user.uid));
      console.log('User profile deleted from Firestore');
    } catch (error) {
      console.error('Error deleting user profile:', error);
    }

    // Delete the Firebase Auth account
    await user.delete();
    console.log('Firebase Auth account deleted');
    
    return true;
  } catch (error: any) {
    console.error('Error deleting account:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('For security reasons, please enter your password to confirm account deletion.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else {
      throw new Error(error.message || 'Failed to delete account. Please try again.');
    }
  }
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Test function to verify Firebase connectivity
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test Firebase Auth
    console.log('Firebase Auth instance:', auth);
    console.log('Firestore instance:', db);
    
    // Test reading from users collection
    try {
      const testUserDoc = await getDoc(doc(db, 'users', 'test-user-1'));
      console.log('✅ Users collection read test:', testUserDoc.exists());
      if (testUserDoc.exists()) {
        console.log('✅ User data:', testUserDoc.data());
      }
    } catch (error) {
      console.error('❌ Users collection read test failed:', error);
    }
    
    // Test reading from profiles collection
    try {
      const testProfileDoc = await getDoc(doc(db, 'profiles', 'test-user-1'));
      console.log('✅ Profiles collection read test:', testProfileDoc.exists());
      if (testProfileDoc.exists()) {
        const profileData = testProfileDoc.data();
        console.log('✅ Profile data:', profileData);
        
        // Check specific fields
        console.log('✅ Profile details:');
        console.log('  - Name (from userId):', profileData.userId);
        console.log('  - Age:', profileData.age);
        console.log('  - Location:', profileData.location);
        console.log('  - Profession:', profileData.profession);
        console.log('  - Religion:', profileData.religion);
        console.log('  - Bio:', profileData.bio);
      }
    } catch (error) {
      console.error('❌ Profiles collection read test failed:', error);
    }
    
    // Test writing to test collection
    try {
      await setDoc(doc(db, 'test', 'connection'), {
        timestamp: new Date(),
        message: 'Connection test successful'
      });
      console.log('✅ Write test successful');
      
      // Clean up test document
      await deleteDoc(doc(db, 'test', 'connection'));
      console.log('✅ Test document cleaned up');
    } catch (error) {
      console.error('❌ Write test failed:', error);
    }
    
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Function to create missing documents for existing Firebase Auth users
export const createMissingDocuments = async (firebaseUser: FirebaseUser) => {
  try {
    console.log('🔧 Creating missing documents for user:', firebaseUser.uid);
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      console.log('📝 Creating missing user document...');
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        firstName: firebaseUser.displayName?.split(' ')[0] || '',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        fullName: firebaseUser.displayName || '',
        profileImageUrl: firebaseUser.photoURL || '',
        gender: '',
        dateOfBirth: '',
        religion: '',
        caste: '',
        subCaste: '',
        mobileNo: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      console.log('✅ User document created successfully');
    } else {
      console.log('✅ User document already exists');
    }
    
    // Check if profile document exists
    const profileDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
    if (!profileDoc.exists()) {
      console.log('📝 Creating missing profile document...');
      const profileData = {
        id: firebaseUser.uid,
        userId: firebaseUser.uid,
        age: 0,
        gender: '',
        location: '',
        profession: '',
        professionOther: '',
        bio: '',
        education: '',
        educationOther: '',
        educationSpecification: '',
        educationSpecificationOther: '',
        relationshipStatus: '',
        religion: '',
        caste: '',
        subCaste: '',
        motherTongue: '',
        smoking: '',
        drinking: '',
        lifestyle: '',
        hobbies: '',
        verified: false,
        kidsPreference: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'profiles', firebaseUser.uid), profileData);
      console.log('✅ Profile document created successfully');
    } else {
      console.log('✅ Profile document already exists');
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ Error creating missing documents:', error);
    throw new Error(error.message);
  }
};

// User management functions
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    console.log('getUserById called with userId:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    console.log('User document exists:', userDoc.exists());
    if (userDoc.exists()) {
      const userData = { id: userDoc.id, ...userDoc.data() } as User;
      console.log('User data retrieved:', userData);
      return userData;
    }
    console.log('User document does not exist for userId:', userId);
    return null;
  } catch (error: any) {
    console.error('Error in getUserById:', error);
    console.error('Error details:', error.code, error.message);
    throw new Error(error.message);
  }
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Profile management functions
export const createProfile = async (profileData: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const profileRef = doc(db, 'profiles', profileData.userId);
    const profile = {
      id: profileData.userId,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(profileRef, profile);
    return profile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('getProfile called with userId:', userId);
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    console.log('Profile document exists:', profileDoc.exists());
    if (profileDoc.exists()) {
      const profileData = { id: profileDoc.id, ...profileDoc.data() } as Profile;
      console.log('Profile data retrieved:', profileData);
      return profileData;
    }
    console.log('Profile document does not exist for userId:', userId);
    return null;
  } catch (error: any) {
    console.error('Error in getProfile:', error);
    console.error('Error details:', error.code, error.message);
    throw new Error(error.message);
  }
};

// Get registration data by user ID
export const getRegistrationByUserId = async (userId: string): Promise<any | null> => {
  try {
    console.log('getRegistrationByUserId called with userId:', userId);
    
    // First try a simple query without ordering to avoid index issues
    const registrationsQuery = query(
      collection(db, 'registrations'),
      where('userId', '==', userId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(registrationsQuery);
    console.log('Registration documents found:', querySnapshot.size);
    
    if (!querySnapshot.empty) {
      // If we found documents, get the most recent one
      let latestDoc = querySnapshot.docs[0];
      let latestDate = latestDoc.data().submittedAt || new Date(0);
      
      // Find the most recent document
      querySnapshot.docs.forEach(doc => {
        const docData = doc.data();
        const docDate = docData.submittedAt || new Date(0);
        if (docDate > latestDate) {
          latestDoc = doc;
          latestDate = docDate;
        }
      });
      
      const registrationData = { id: latestDoc.id, ...latestDoc.data() };
      console.log('Registration data retrieved:', registrationData);
      return registrationData;
    }
    
    console.log('No registration document found for userId:', userId);
    return null;
  } catch (error: any) {
    console.error('Error in getRegistrationByUserId:', error);
    console.error('Error details:', error.code, error.message);
    
    // If there's an index error, try a simpler approach
    if (error.code === 'failed-precondition') {
      console.log('Index error detected, trying alternative approach...');
      try {
        // Try to get all registrations and filter client-side
        const allRegistrationsQuery = query(
          collection(db, 'registrations'),
          limit(100) // Limit to avoid performance issues
        );
        
        const allSnapshot = await getDocs(allRegistrationsQuery);
        const userRegistrations = allSnapshot.docs
          .filter(doc => doc.data().userId === userId)
          .sort((a, b) => {
            const dateA = a.data().submittedAt || new Date(0);
            const dateB = b.data().submittedAt || new Date(0);
            return dateB - dateA;
          });
        
        if (userRegistrations.length > 0) {
          const registrationData = { id: userRegistrations[0].id, ...userRegistrations[0].data() };
          console.log('Registration data retrieved (alternative method):', registrationData);
          return registrationData;
        }
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
      }
    }
    
    return null;
  }
};

export const updateProfile = async (userId: string, profileData: Partial<Profile>) => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    await updateDoc(profileRef, {
      ...profileData,
      updatedAt: new Date()
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserSettings = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No user is currently signed in');
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getProfiles = async (
  excludeUserId?: string, 
  limitCount: number = 50,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ profiles: (Profile & { user: User })[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    console.log('getProfiles called with excludeUserId:', excludeUserId);
    
    let q = query(
      collection(db, 'profiles'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    console.log('Query snapshot size:', querySnapshot.docs.length);
    
    const profiles: (Profile & { user: User })[] = [];

    for (const doc of querySnapshot.docs) {
      if (excludeUserId && doc.id === excludeUserId) {
        console.log('Skipping excluded user:', doc.id);
        continue;
      }
      
      const profileData = { id: doc.id, ...doc.data() } as Profile;
      console.log('Processing profile:', doc.id, 'userId:', profileData.userId);
      
      try {
        const userData = await getUserById(profileData.userId);
        
        if (userData) {
          profiles.push({ ...profileData, user: userData });
          console.log('Successfully added profile for user:', profileData.userId);
        } else {
          console.log('No user data found for profile:', profileData.userId);
        }
      } catch (error: any) {
        console.error('Error fetching user data for profile:', profileData.userId, error);
        // Continue with other profiles even if one fails
      }
    }

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    console.log('Final profiles count:', profiles.length);

    return { profiles, lastDoc: lastVisible };
  } catch (error: any) {
    console.error('Error in getProfiles:', error);
    throw new Error(error.message);
  }
};

// Get profiles from registrations collection
export const getProfilesFromRegistrations = async (
  excludeUserId?: string, 
  limitCount: number = 50,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ profiles: any[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    console.log('getProfilesFromRegistrations called with excludeUserId:', excludeUserId);
    
    let q = query(
      collection(db, 'registrations'),
      where('status', '==', 'completed'),
      orderBy('submittedAt', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    console.log('Registrations query snapshot size:', querySnapshot.docs.length);
    
    const profiles: any[] = [];

    for (const doc of querySnapshot.docs) {
      if (excludeUserId && doc.data().userId === excludeUserId) {
        console.log('Skipping excluded user:', doc.data().userId);
        continue;
      }
      
      const registrationData = { id: doc.id, ...doc.data() } as any;
      console.log('Processing registration:', doc.id, 'userId:', registrationData.userId);
      
      // Create a profile object from registration data
      const profile = {
        id: registrationData.userId,
        userId: registrationData.userId,
        age: registrationData.dateOfBirth ? calculateAge(registrationData.dateOfBirth) : 0,
        gender: registrationData.gender || '',
        location: registrationData.presentAddress || '',
        profession: registrationData.job || '',
        professionOther: '',
        bio: registrationData.otherDetails || '',
        education: registrationData.qualification || '',
        educationOther: '',
        educationSpecification: '',
        educationSpecificationOther: '',
        relationshipStatus: registrationData.maritalStatus || '',
        religion: registrationData.religion || '',
        caste: registrationData.caste || '',
        subCaste: registrationData.subCaste || '',
        motherTongue: registrationData.motherTongue || '',
        smoking: '',
        drinking: '',
        lifestyle: '',
        hobbies: '',
        verified: true, // All registration profiles are considered verified
        kidsPreference: '',
        createdAt: registrationData.submittedAt || new Date(),
        updatedAt: registrationData.submittedAt || new Date(),
        // Add registration data for detailed view
        registration: registrationData
      };
      
      // Create a user object from registration data
      const user = {
        id: registrationData.userId,
        email: '', // Not available in registrations
        firstName: registrationData.name ? registrationData.name.split(' ')[0] : '',
        lastName: registrationData.name ? registrationData.name.split(' ').slice(1).join(' ') : '',
        fullName: registrationData.name || '',
        profileImageUrl: '', // Not available in registrations
        gender: registrationData.gender || '',
        dateOfBirth: registrationData.dateOfBirth || '',
        religion: registrationData.religion || '',
        caste: registrationData.caste || '',
        subCaste: registrationData.subCaste || '',
        mobileNo: registrationData.contactNumber || '',
        createdAt: registrationData.submittedAt || new Date(),
        updatedAt: registrationData.submittedAt || new Date()
      };
      
      profiles.push({ ...profile, user });
      console.log('Successfully added profile from registration for user:', registrationData.userId);
    }

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    console.log('Final profiles count from registrations:', profiles.length);

    return { profiles, lastDoc: lastVisible };
  } catch (error: any) {
    console.error('Error in getProfilesFromRegistrations:', error);
    console.error('Error details:', error.code, error.message);
    
    // If there's an index error, try a simpler approach
    if (error.code === 'failed-precondition') {
      console.log('Index error detected, trying alternative approach...');
      try {
        // Try to get all registrations and filter client-side
        const allRegistrationsQuery = query(
          collection(db, 'registrations'),
          limit(100) // Limit to avoid performance issues
        );
        
        const allSnapshot = await getDocs(allRegistrationsQuery);
        const completedRegistrations = allSnapshot.docs
          .filter(doc => {
            const data = doc.data();
            return data.status === 'completed' && (!excludeUserId || data.userId !== excludeUserId);
          })
          .sort((a, b) => {
            const dateA = a.data().submittedAt || new Date(0);
            const dateB = b.data().submittedAt || new Date(0);
            return dateB - dateA;
          })
          .slice(0, limitCount);
        
        const profiles: any[] = [];

        for (const doc of completedRegistrations) {
          const registrationData = { id: doc.id, ...doc.data() } as any;
          console.log('Processing registration (fallback):', doc.id, 'userId:', registrationData.userId);
          
          // Create a profile object from registration data
          const profile = {
            id: registrationData.userId,
            userId: registrationData.userId,
            age: registrationData.dateOfBirth ? calculateAge(registrationData.dateOfBirth) : 0,
            gender: registrationData.gender || '',
            location: registrationData.presentAddress || '',
            profession: registrationData.job || '',
            professionOther: '',
            bio: registrationData.otherDetails || '',
            education: registrationData.qualification || '',
            educationOther: '',
            educationSpecification: '',
            educationSpecificationOther: '',
            relationshipStatus: registrationData.maritalStatus || '',
            religion: registrationData.religion || '',
            caste: registrationData.caste || '',
            subCaste: registrationData.subCaste || '',
            motherTongue: registrationData.motherTongue || '',
            smoking: '',
            drinking: '',
            lifestyle: '',
            hobbies: '',
            verified: true, // All registration profiles are considered verified
            kidsPreference: '',
            createdAt: registrationData.submittedAt || new Date(),
            updatedAt: registrationData.submittedAt || new Date(),
            // Add registration data for detailed view
            registration: registrationData
          };
          
          // Create a user object from registration data
          const user = {
            id: registrationData.userId,
            email: '', // Not available in registrations
            firstName: registrationData.name ? registrationData.name.split(' ')[0] : '',
            lastName: registrationData.name ? registrationData.name.split(' ').slice(1).join(' ') : '',
            fullName: registrationData.name || '',
            profileImageUrl: '', // Not available in registrations
            gender: registrationData.gender || '',
            dateOfBirth: registrationData.dateOfBirth || '',
            religion: registrationData.religion || '',
            caste: registrationData.caste || '',
            subCaste: registrationData.subCaste || '',
            mobileNo: registrationData.contactNumber || '',
            createdAt: registrationData.submittedAt || new Date(),
            updatedAt: registrationData.submittedAt || new Date()
          };
          
          profiles.push({ ...profile, user });
          console.log('Successfully added profile from registration (fallback) for user:', registrationData.userId);
        }

        console.log('Final profiles count from registrations (fallback):', profiles.length);
        return { profiles, lastDoc: null };
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
        throw new Error('Failed to fetch profiles. Please try again later.');
      }
    }
    
    throw new Error(error.message);
  }
};

// Like and Match functions
export const createLike = async (likerId: string, likedId: string) => {
  try {
    const likeId = `${likerId}-${likedId}`;
    const likeRef = doc(db, 'likes', likeId);
    const like = {
      id: likeId,
      likerId,
      likedId,
      createdAt: new Date()
    };
    
    await setDoc(likeRef, like);
    return like;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getLike = async (likerId: string, likedId: string) => {
  try {
    const likeId = `${likerId}-${likedId}`;
    const likeDoc = await getDoc(doc(db, 'likes', likeId));
    if (likeDoc.exists()) {
      return { id: likeDoc.id, ...likeDoc.data() };
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const checkMutualLike = async (user1Id: string, user2Id: string): Promise<boolean> => {
  try {
    const like1 = await getLike(user1Id, user2Id);
    const like2 = await getLike(user2Id, user1Id);
    return !!(like1 && like2);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createMatch = async (user1Id: string, user2Id: string) => {
  try {
    const matchId = [user1Id, user2Id].sort().join('-');
    const matchRef = doc(db, 'matches', matchId);
    const match = {
      id: matchId,
      user1Id,
      user2Id,
      createdAt: new Date()
    };
    
    await setDoc(matchRef, match);
    return match;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserMatches = async (userId: string) => {
  try {
    const matchesQuery = query(
      collection(db, 'matches'),
      where('user1Id', '==', userId)
    );
    
    const matchesQuery2 = query(
      collection(db, 'matches'),
      where('user2Id', '==', userId)
    );

    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(matchesQuery),
      getDocs(matchesQuery2)
    ]);

    const matches: any[] = [];
    
    snapshot1.forEach(doc => {
      matches.push({ id: doc.id, ...doc.data() });
    });
    
    snapshot2.forEach(doc => {
      matches.push({ id: doc.id, ...doc.data() });
    });

    return matches;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get detailed matches with user information
export const getDetailedMatches = async (userId: string) => {
  try {
    const matches = await getUserMatches(userId);
    const detailedMatches = [];

    for (const match of matches) {
      // Determine the other user's ID
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      
      // Get the other user's profile and user data
      const [profileData, userData] = await Promise.all([
        getProfile(otherUserId),
        getUserById(otherUserId)
      ]);

      if (profileData && userData) {
        detailedMatches.push({
          ...match,
          otherUser: {
            id: otherUserId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            fullName: `${userData.firstName} ${userData.lastName}`,
            profileImageUrl: userData.profileImageUrl,
            age: profileData.age,
            location: profileData.location,
            profession: profileData.profession
          }
        });
      }
    }

    return detailedMatches;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get profiles that the user has liked
export const getLikedProfiles = async (userId: string) => {
  try {
    const likesQuery = query(
      collection(db, 'likes'),
      where('likerId', '==', userId)
    );
    
    const snapshot = await getDocs(likesQuery);
    const likedProfiles = [];

    for (const likeDoc of snapshot.docs) {
      const likeData = likeDoc.data();
      const likedUserId = likeData.likedId;
      
      // Get the liked user's registration data (we only need this)
      const registrationData = await getRegistrationByUserId(likedUserId);

      if (registrationData) {
        likedProfiles.push({
          id: likeDoc.id,
          likeId: likeDoc.id,
          likedAt: likeData.createdAt,
          user: {
            id: likedUserId,
            name: registrationData.name,
            profileImageUrl: registrationData.profileImageUrl,
            age: registrationData.age,
            location: registrationData.presentAddress,
            profession: registrationData.job,
            education: registrationData.qualification
          }
        });
      }
    }

    return likedProfiles;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Notification functions
export const createNotification = async (userId: string, type: string, data: any) => {
  try {
    const notificationRef = doc(collection(db, 'notifications'));
    const notification = {
      id: notificationRef.id,
      userId,
      type, // 'like', 'match', 'message', etc.
      data,
      read: false,
      createdAt: new Date()
    };
    
    await setDoc(notificationRef, notification);
    return notification;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserNotifications = async (userId: string) => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(notificationsQuery);
    const notifications: any[] = [];
    
    snapshot.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    return notifications;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Enhanced like function with notification
export const createLikeWithNotification = async (likerId: string, likedId: string) => {
  try {
    // Create the like
    const like = await createLike(likerId, likedId);
    
    // Get liker's registration data for notification (since users collection is deleted)
    const likerRegistration = await getRegistrationByUserId(likerId);
    
    // Create notification for the liked user
    await createNotification(likedId, 'like', {
      likerId,
      likerName: likerRegistration?.name || 'Someone',
      likerProfileImage: '' // Not available in registrations
    });
    
    return like;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Enhanced match creation with notification
export const createMatchWithNotification = async (user1Id: string, user2Id: string) => {
  try {
    // Create the match
    const match = await createMatch(user1Id, user2Id);
    
    // Get both users' registration data for notifications (since users collection is deleted)
    const [user1Registration, user2Registration] = await Promise.all([
      getRegistrationByUserId(user1Id),
      getRegistrationByUserId(user2Id)
    ]);
    
    // Create notifications for both users
    await Promise.all([
      createNotification(user1Id, 'match', {
        matchedUserId: user2Id,
        matchedUserName: user2Registration?.name || 'Someone',
        matchedUserProfileImage: '' // Not available in registrations
      }),
      createNotification(user2Id, 'match', {
        matchedUserId: user1Id,
        matchedUserName: user1Registration?.name || 'Someone',
        matchedUserProfileImage: '' // Not available in registrations
      })
    ]);
    
    return match;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
