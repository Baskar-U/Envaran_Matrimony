// Setup script for Firebase collections needed for like functionality
// Run this script in your Firebase project to create the necessary collections and indexes

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit,
  writeBatch,
  serverTimestamp 
} = require('firebase/firestore');

// Your Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupLikeCollections() {
  console.log('🚀 Setting up Firebase collections for like functionality...');
  
  try {
    // 1. Create likes collection with sample data structure
    console.log('📝 Creating likes collection...');
    const likesCollection = collection(db, 'likes');
    
    // Sample like document structure
    const sampleLike = {
      id: 'sample-like-id',
      likerId: 'user-who-liked-id',
      likedId: 'user-who-was-liked-id',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('✅ Likes collection structure defined');
    console.log('Sample like document structure:', sampleLike);
    
    // 2. Create matches collection with sample data structure
    console.log('📝 Creating matches collection...');
    const matchesCollection = collection(db, 'matches');
    
    // Sample match document structure
    const sampleMatch = {
      id: 'sample-match-id',
      user1Id: 'first-user-id',
      user2Id: 'second-user-id',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active' // active, archived, etc.
    };
    
    console.log('✅ Matches collection structure defined');
    console.log('Sample match document structure:', sampleMatch);
    
    // 3. Create notifications collection with sample data structure
    console.log('📝 Creating notifications collection...');
    const notificationsCollection = collection(db, 'notifications');
    
    // Sample notification document structure
    const sampleNotification = {
      id: 'sample-notification-id',
      userId: 'user-who-receives-notification-id',
      type: 'like', // like, match, message, etc.
      data: {
        likerId: 'user-who-liked-id',
        likerName: 'John Doe',
        likerProfileImage: 'https://example.com/image.jpg'
      },
      read: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('✅ Notifications collection structure defined');
    console.log('Sample notification document structure:', sampleNotification);
    
    // 4. Create indexes for better query performance
    console.log('📝 Setting up Firestore indexes...');
    
    // Indexes needed for likes collection
    console.log('Indexes needed for likes collection:');
    console.log('- likerId (ascending)');
    console.log('- likedId (ascending)');
    console.log('- createdAt (descending)');
    console.log('- likerId + createdAt (composite)');
    console.log('- likedId + createdAt (composite)');
    
    // Indexes needed for matches collection
    console.log('Indexes needed for matches collection:');
    console.log('- user1Id (ascending)');
    console.log('- user2Id (ascending)');
    console.log('- createdAt (descending)');
    console.log('- user1Id + createdAt (composite)');
    console.log('- user2Id + createdAt (composite)');
    
    // Indexes needed for notifications collection
    console.log('Indexes needed for notifications collection:');
    console.log('- userId (ascending)');
    console.log('- type (ascending)');
    console.log('- read (ascending)');
    console.log('- createdAt (descending)');
    console.log('- userId + read (composite)');
    console.log('- userId + createdAt (composite)');
    console.log('- userId + type + createdAt (composite)');
    
    // 5. Create sample data for testing (optional)
    console.log('📝 Creating sample data for testing...');
    
    const batch = writeBatch(db);
    
    // Sample like
    const sampleLikeRef = doc(likesCollection, 'sample-like-1');
    batch.set(sampleLikeRef, {
      likerId: 'sample-user-1',
      likedId: 'sample-user-2',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Sample match
    const sampleMatchRef = doc(matchesCollection, 'sample-match-1');
    batch.set(sampleMatchRef, {
      user1Id: 'sample-user-1',
      user2Id: 'sample-user-2',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active'
    });
    
    // Sample notification
    const sampleNotificationRef = doc(notificationsCollection, 'sample-notification-1');
    batch.set(sampleNotificationRef, {
      userId: 'sample-user-2',
      type: 'like',
      data: {
        likerId: 'sample-user-1',
        likerName: 'Sample User 1',
        likerProfileImage: ''
      },
      read: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    await batch.commit();
    console.log('✅ Sample data created successfully');
    
    // 6. Security rules recommendations
    console.log('🔒 Security rules recommendations:');
    console.log(`
// Firestore Security Rules for likes, matches, and notifications

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Likes collection
    match /likes/{likeId} {
      allow read: if request.auth != null && 
        (resource.data.likerId == request.auth.uid || 
         resource.data.likedId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.likerId == request.auth.uid;
      allow update, delete: if request.auth != null && 
        resource.data.likerId == request.auth.uid;
    }
    
    // Matches collection
    match /matches/{matchId} {
      allow read: if request.auth != null && 
        (resource.data.user1Id == request.auth.uid || 
         resource.data.user2Id == request.auth.uid);
      allow create: if request.auth != null && 
        (request.resource.data.user1Id == request.auth.uid || 
         request.resource.data.user2Id == request.auth.uid);
      allow update: if request.auth != null && 
        (resource.data.user1Id == request.auth.uid || 
         resource.data.user2Id == request.auth.uid);
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Registrations collection (for profile data)
    match /registrations/{registrationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
    `);
    
    console.log('🎉 Firebase collections setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Go to Firebase Console > Firestore Database');
    console.log('2. Create the indexes mentioned above in the Indexes tab');
    console.log('3. Update the security rules with the provided rules');
    console.log('4. Test the like functionality in your application');
    
  } catch (error) {
    console.error('❌ Error setting up collections:', error);
    throw error;
  }
}

// Function to check if collections exist
async function checkCollections() {
  console.log('🔍 Checking existing collections...');
  
  try {
    const collections = ['likes', 'matches', 'notifications', 'registrations'];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(query(collectionRef, limit(1)));
      console.log(`✅ ${collectionName} collection exists (${snapshot.size} documents)`);
    }
    
  } catch (error) {
    console.error('❌ Error checking collections:', error);
  }
}

// Function to create indexes (Firebase CLI required)
function createIndexes() {
  console.log('📝 To create indexes, run these Firebase CLI commands:');
  console.log('');
  console.log('firebase deploy --only firestore:indexes');
  console.log('');
  console.log('Or manually create these indexes in Firebase Console:');
  console.log('');
  console.log('Likes collection indexes:');
  console.log('- Collection: likes, Fields: likerId (Ascending)');
  console.log('- Collection: likes, Fields: likedId (Ascending)');
  console.log('- Collection: likes, Fields: createdAt (Descending)');
  console.log('- Collection: likes, Fields: likerId (Ascending), createdAt (Descending)');
  console.log('- Collection: likes, Fields: likedId (Ascending), createdAt (Descending)');
  console.log('');
  console.log('Matches collection indexes:');
  console.log('- Collection: matches, Fields: user1Id (Ascending)');
  console.log('- Collection: matches, Fields: user2Id (Ascending)');
  console.log('- Collection: matches, Fields: createdAt (Descending)');
  console.log('- Collection: matches, Fields: user1Id (Ascending), createdAt (Descending)');
  console.log('- Collection: matches, Fields: user2Id (Ascending), createdAt (Descending)');
  console.log('');
  console.log('Notifications collection indexes:');
  console.log('- Collection: notifications, Fields: userId (Ascending)');
  console.log('- Collection: notifications, Fields: type (Ascending)');
  console.log('- Collection: notifications, Fields: read (Ascending)');
  console.log('- Collection: notifications, Fields: createdAt (Descending)');
  console.log('- Collection: notifications, Fields: userId (Ascending), read (Ascending)');
  console.log('- Collection: notifications, Fields: userId (Ascending), createdAt (Descending)');
  console.log('- Collection: notifications, Fields: userId (Ascending), type (Ascending), createdAt (Descending)');
}

// Export functions for use
module.exports = {
  setupLikeCollections,
  checkCollections,
  createIndexes
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupLikeCollections()
    .then(() => checkCollections())
    .then(() => createIndexes())
    .catch(console.error);
}
