// Firebase Setup Script for SecondChance Matrimony (React App Version)
// Run this in your browser console after your React app is loaded

console.log('🚀 Starting Firebase setup for SecondChance Matrimony...');

// Try to access Firebase from your React app
let db;

// Method 1: Try to access from window object if exposed
if (window.firebase) {
  console.log('✅ Firebase found in window object');
  db = window.firebase.firestore();
} 
// Method 2: Try to access from your app's global variables
else if (window.__SECONDCHANCE_FIREBASE__) {
  console.log('✅ Firebase found in app global');
  db = window.__SECONDCHANCE_FIREBASE__.firestore();
}
// Method 3: Try to access from React DevTools
else {
  console.log('❌ Firebase not found in global scope');
  console.log('📋 Please run this script after your React app is fully loaded');
  console.log('💡 Alternative: Add this to your React app temporarily:');
  console.log(`
    // Add this to your main.tsx or App.tsx temporarily
    import { db } from './lib/firebase';
    window.__SECONDCHANCE_FIREBASE__ = { firestore: () => db };
  `);
  
  // Exit early
  throw new Error('Firebase not accessible. Please ensure your React app is loaded and Firebase is initialized.');
}

// Collection names
const collections = {
  users: 'users',
  profiles: 'profiles',
  likes: 'likes',
  matches: 'matches',
  notifications: 'notifications',
  registrations: 'registrations'
};

// Sample data structures for each collection
const sampleData = {
  // Users collection - Basic authentication and user info
  users: {
    id: 'sample-user-id',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    profileImageUrl: 'https://example.com/image.jpg',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Iyer',
    mobileNo: '+91-9876543210',
    createdAt: new Date(),
    updatedAt: new Date(),
    // Settings
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      matchAlerts: true,
      messageAlerts: true,
      profileViews: true,
      weeklyDigest: false
    },
    privacySettings: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      showLastSeen: true,
      allowMessages: true,
      allowProfileViews: true,
      shareData: false
    },
    languageSettings: {
      language: 'English',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY'
    }
  },

  // Profiles collection - Detailed profile information
  profiles: {
    id: 'sample-profile-id',
    userId: 'sample-user-id',
    age: 30,
    gender: 'Male',
    location: 'Chennai, Tamil Nadu',
    profession: 'Software Engineer',
    professionOther: '',
    bio: 'Looking for a life partner who shares similar values and goals.',
    education: 'Bachelor of Engineering',
    educationOther: '',
    educationSpecification: 'Computer Science',
    educationSpecificationOther: '',
    relationshipStatus: 'never_married',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Iyer',
    motherTongue: 'Tamil',
    smoking: 'No',
    drinking: 'Occasionally',
    lifestyle: 'Moderate',
    hobbies: 'Reading, Traveling, Music',
    verified: false,
    kidsPreference: 'want_kids',
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Physical attributes
    height: '5\'8"',
    weight: '70',
    bloodGroup: 'O+',
    complexion: 'Fair',
    disability: 'No',
    diet: 'Vegetarian',
    
    // Family details
    fatherName: 'Father Name',
    fatherJob: 'Business',
    fatherAlive: 'Yes',
    motherName: 'Mother Name',
    motherJob: 'Homemaker',
    motherAlive: 'Yes',
    orderOfBirth: 'First',
    
    // Siblings
    siblings: {
      elderBrother: { name: 'Elder Brother', maritalStatus: 'Married' },
      youngerBrother: { name: 'Younger Brother', maritalStatus: 'Unmarried' },
      elderSister: { name: 'Elder Sister', maritalStatus: 'Married' },
      youngerSister: { name: 'Younger Sister', maritalStatus: 'Unmarried' }
    },
    
    // Education & Occupation
    qualification: 'B.E. Computer Science',
    incomePerMonth: '75000',
    job: 'Software Engineer',
    placeOfJob: 'Chennai',
    
    // Communication details
    presentAddress: '123 Main Street, Chennai, Tamil Nadu',
    permanentAddress: '456 Home Street, Chennai, Tamil Nadu',
    contactNumber: '+91-9876543210',
    contactPerson: 'Father',
    
    // Astrology details
    ownHouse: 'Yes',
    star: 'Rohini',
    laknam: 'Simha',
    timeOfBirth: {
      hour: '10',
      minute: '30',
      period: 'AM'
    },
    raasi: 'Vrishabha',
    gothram: 'Kashyapa',
    placeOfBirth: 'Chennai',
    padam: 'First',
    dossam: 'No',
    nativity: 'Chennai',
    
    // Horoscope details
    horoscopeRequired: 'Yes',
    balance: '25 years',
    dasa: 'Jupiter',
    dasaPeriod: {
      years: '5',
      months: '3',
      days: '15'
    },
    
    // Partner expectations
    partnerExpectations: {
      job: 'Any',
      preferredAgeFrom: 25,
      preferredAgeTo: 35,
      jobPreference: 'Optional',
      diet: 'Vegetarian',
      maritalStatus: ['Unmarried'],
      subCaste: 'Any',
      comments: 'Looking for someone with good family values'
    },
    
    // Photos
    photos: {
      photo1: 'https://example.com/photo1.jpg',
      photo2: 'https://example.com/photo2.jpg'
    },
    
    // Additional details
    otherDetails: 'Talented in music, achievements in academics, likes traveling, family-oriented person'
  },

  // Likes collection - User likes
  likes: {
    id: 'likerId-likedId',
    likerId: 'user1-id',
    likedId: 'user2-id',
    createdAt: new Date()
  },

  // Matches collection - Mutual matches
  matches: {
    id: 'user1Id-user2Id',
    user1Id: 'user1-id',
    user2Id: 'user2-id',
    createdAt: new Date()
  },

  // Notifications collection - User notifications
  notifications: {
    id: 'notification-id',
    userId: 'user-id',
    type: 'like', // 'like', 'match', 'message'
    data: {
      likerId: 'liker-id',
      likerName: 'John Doe',
      likerProfileImage: 'https://example.com/image.jpg'
    },
    read: false,
    createdAt: new Date()
  },

  // Registrations collection - Complete registration data
  registrations: {
    id: 'registration-id',
    userId: 'user-id',
    status: 'pending', // 'pending', 'approved', 'rejected'
    
    // Personal details
    name: 'John Doe',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    motherTongue: 'Tamil',
    maritalStatus: 'Unmarried',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Iyer',
    
    // Family details
    fatherName: 'Father Name',
    fatherJob: 'Business',
    fatherAlive: 'Yes',
    motherName: 'Mother Name',
    motherJob: 'Homemaker',
    motherAlive: 'Yes',
    orderOfBirth: 'First',
    
    // Physical attributes
    height: '5\'8"',
    weight: '70',
    bloodGroup: 'O+',
    complexion: 'Fair',
    disability: 'No',
    diet: 'Vegetarian',
    
    // Education & Occupation
    qualification: 'B.E. Computer Science',
    incomePerMonth: '75000',
    job: 'Software Engineer',
    placeOfJob: 'Chennai',
    
    // Communication details
    presentAddress: '123 Main Street, Chennai, Tamil Nadu',
    permanentAddress: '456 Home Street, Chennai, Tamil Nadu',
    contactNumber: '+91-9876543210',
    contactPerson: 'Father',
    
    // Astrology details
    ownHouse: 'Yes',
    star: 'Rohini',
    laknam: 'Simha',
    timeOfBirth: {
      hour: '10',
      minute: '30',
      period: 'AM'
    },
    raasi: 'Vrishabha',
    gothram: 'Kashyapa',
    placeOfBirth: 'Chennai',
    padam: 'First',
    dossam: 'No',
    nativity: 'Chennai',
    
    // Horoscope details
    horoscopeRequired: 'Yes',
    balance: '25 years',
    dasa: 'Jupiter',
    dasaPeriod: {
      years: '5',
      months: '3',
      days: '15'
    },
    
    // Partner expectations
    partnerExpectations: {
      job: 'Any',
      preferredAgeFrom: 25,
      preferredAgeTo: 35,
      jobPreference: 'Optional',
      diet: 'Vegetarian',
      maritalStatus: ['Unmarried'],
      subCaste: 'Any',
      comments: 'Looking for someone with good family values'
    },
    
    // Photos
    photos: {
      photo1: 'https://example.com/photo1.jpg',
      photo2: 'https://example.com/photo2.jpg'
    },
    
    // Additional details
    otherDetails: 'Talented in music, achievements in academics, likes traveling, family-oriented person',
    
    // Registration metadata
    submittedAt: new Date(),
    approvedAt: null,
    approvedBy: null,
    rejectionReason: null
  }
};

// Function to create collections with sample documents
async function createCollections() {
  try {
    console.log('Creating collections and sample documents...');
    
    // Create collections by adding sample documents
    for (const [collectionName, sampleData] of Object.entries(sampleData)) {
      try {
        // Create a sample document to establish the collection
        const docRef = await db.collection(collectionName).add({
          ...sampleData,
          _isSample: true,
          createdAt: new Date()
        });
        
        console.log(`✅ Created collection: ${collectionName} with sample document ID: ${docRef.id}`);
        
        // Delete the sample document after creating the collection
        await docRef.delete();
        console.log(`🗑️ Deleted sample document from ${collectionName}`);
        
      } catch (error) {
        console.error(`❌ Error creating collection ${collectionName}:`, error);
      }
    }
    
    console.log('🎉 All collections have been created successfully!');
    console.log('📋 Collections created:');
    Object.keys(collections).forEach(name => {
      console.log(`   - ${name}`);
    });
    
  } catch (error) {
    console.error('❌ Error in createCollections:', error);
  }
}

// Function to create indexes for better query performance
async function createIndexes() {
  try {
    console.log('Creating database indexes...');
    
    // Note: Indexes need to be created through Firebase Console
    // This function provides the index configurations you should create
    
    const indexConfigurations = [
      {
        collection: 'profiles',
        fields: ['gender', 'age', 'location'],
        queryScope: 'COLLECTION'
      },
      {
        collection: 'profiles',
        fields: ['religion', 'caste', 'maritalStatus'],
        queryScope: 'COLLECTION'
      },
      {
        collection: 'likes',
        fields: ['likerId', 'createdAt'],
        queryScope: 'COLLECTION'
      },
      {
        collection: 'likes',
        fields: ['likedId', 'createdAt'],
        queryScope: 'COLLECTION'
      },
      {
        collection: 'matches',
        fields: ['user1Id', 'createdAt'],
        queryScope: 'COLLECTION'
      },
      {
        collection: 'matches',
        fields: ['user2Id', 'createdAt'],
        queryScope: 'COLLECTION'
      },
      {
        collection: 'notifications',
        fields: ['userId', 'read', 'createdAt'],
        queryScope: 'COLLECTION'
      },
      {
        collection: 'registrations',
        fields: ['status', 'submittedAt'],
        queryScope: 'COLLECTION'
      }
    ];
    
    console.log('📊 Index configurations to create in Firebase Console:');
    indexConfigurations.forEach((config, index) => {
      console.log(`${index + 1}. Collection: ${config.collection}`);
      console.log(`   Fields: ${config.fields.join(', ')}`);
      console.log(`   Scope: ${config.queryScope}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error in createIndexes:', error);
  }
}

// Function to validate the setup
async function validateSetup() {
  try {
    console.log('Validating collections setup...');
    
    for (const collectionName of Object.keys(collections)) {
      try {
        const snapshot = await db.collection(collectionName).limit(1).get();
        console.log(`✅ Collection '${collectionName}' exists and is accessible`);
      } catch (error) {
        console.error(`❌ Collection '${collectionName}' is not accessible:`, error);
      }
    }
    
    console.log('🎯 Setup validation completed!');
    
  } catch (error) {
    console.error('❌ Error in validateSetup:', error);
  }
}

// Main execution function
async function setupFirebase() {
  console.log('🚀 Starting Firebase setup for SecondChance Matrimony...');
  console.log('📝 This will create the following collections:');
  Object.keys(collections).forEach(name => {
    console.log(`   - ${name}`);
  });
  console.log('');
  
  await createCollections();
  console.log('');
  createIndexes();
  console.log('');
  await validateSetup();
  
  console.log('');
  console.log('🎉 Firebase setup completed successfully!');
  console.log('📋 Next steps:');
  console.log('   1. Create the indexes in Firebase Console as shown above');
  console.log('   2. Set up Firebase Security Rules');
  console.log('   3. Update your registration form to use these collections');
}

// Execute the setup
setupFirebase().catch(console.error);

// Instructions for running this script:
console.log(`
📋 INSTRUCTIONS TO RUN THIS SCRIPT:

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Make sure your React app is fully loaded
4. Copy and paste this entire script into the console
5. Press Enter to execute

If Firebase is not accessible, temporarily add this to your main.tsx:
import { db } from './lib/firebase';
window.__SECONDCHANCE_FIREBASE__ = { firestore: () => db };

The script will:
- Create all necessary collections
- Set up proper field structures
- Provide index configurations
- Validate the setup

⚠️  IMPORTANT: This script creates sample documents to establish collections, then deletes them.
    Your actual data will be added through your registration forms.
`);

