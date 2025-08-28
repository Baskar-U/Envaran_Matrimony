// Browser-compatible Firebase collections setup
// This script can be run in your React application

import { 
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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function setupLikeCollections() {
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
    
    // 4. Create sample data for testing (optional)
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
    
    console.log('🎉 Firebase collections setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Go to Firebase Console > Firestore Database');
    console.log('2. Create the indexes mentioned in LIKE_FUNCTIONALITY_SETUP.md');
    console.log('3. Update the security rules with the provided rules');
    console.log('4. Test the like functionality in your application');
    
    return true;
  } catch (error) {
    console.error('❌ Error setting up collections:', error);
    throw error;
  }
}

// Function to check if collections exist
export async function checkCollections() {
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

// Function to test like functionality
export async function testLikeFunctionality() {
  console.log('🧪 Testing like functionality...');
  
  try {
    // Test data
    const user1Id = 'test-user-1';
    const user2Id = 'test-user-2';
    const user3Id = 'test-user-3';
    
    console.log('📝 Creating test users and likes...');
    
    const batch = writeBatch(db);
    
    // Create test likes
    const like1Ref = doc(collection(db, 'likes'), 'test-like-1');
    batch.set(like1Ref, {
      likerId: user1Id,
      likedId: user2Id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    const like2Ref = doc(collection(db, 'likes'), 'test-like-2');
    batch.set(like2Ref, {
      likerId: user2Id,
      likedId: user1Id, // This creates a mutual like (match)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    const like3Ref = doc(collection(db, 'likes'), 'test-like-3');
    batch.set(like3Ref, {
      likerId: user1Id,
      likedId: user3Id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    await batch.commit();
    console.log('✅ Test likes created successfully');
    
    // Test 1: Check if user1 has liked user2
    console.log('\n🔍 Test 1: Checking if user1 has liked user2...');
    const user1LikesUser2Query = query(
      collection(db, 'likes'),
      where('likerId', '==', user1Id),
      where('likedId', '==', user2Id)
    );
    
    const user1LikesUser2Snapshot = await getDocs(user1LikesUser2Query);
    console.log(`User1 likes User2: ${!user1LikesUser2Snapshot.empty}`);
    
    // Test 2: Check if user2 has liked user1 (mutual like)
    console.log('\n🔍 Test 2: Checking if user2 has liked user1 (mutual like)...');
    const user2LikesUser1Query = query(
      collection(db, 'likes'),
      where('likerId', '==', user2Id),
      where('likedId', '==', user1Id)
    );
    
    const user2LikesUser1Snapshot = await getDocs(user2LikesUser1Query);
    console.log(`User2 likes User1: ${!user2LikesUser1Snapshot.empty}`);
    
    // Test 3: Check if it's a mutual like (match)
    const isMutualLike = !user1LikesUser2Snapshot.empty && !user2LikesUser1Snapshot.empty;
    console.log(`Mutual like (match): ${isMutualLike}`);
    
    // Test 4: Get all profiles that user1 has liked
    console.log('\n🔍 Test 4: Getting all profiles that user1 has liked...');
    const user1LikesQuery = query(
      collection(db, 'likes'),
      where('likerId', '==', user1Id),
      orderBy('createdAt', 'desc')
    );
    
    const user1LikesSnapshot = await getDocs(user1LikesQuery);
    const user1LikedProfiles = [];
    user1LikesSnapshot.forEach(doc => {
      user1LikedProfiles.push(doc.data());
    });
    
    console.log(`User1 has liked ${user1LikedProfiles.length} profiles:`);
    user1LikedProfiles.forEach(like => {
      console.log(`- ${like.likedId}`);
    });
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- User1 has liked ${user1LikedProfiles.length} profiles`);
    console.log(`- Mutual match between User1 and User2: ${isMutualLike}`);
    
  } catch (error) {
    console.error('❌ Error testing like functionality:', error);
    throw error;
  }
}

// Function to clean up test data
export async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
  try {
    const batch = writeBatch(db);
    
    // Delete test likes
    const testLikesQuery = query(
      collection(db, 'likes'),
      where('likerId', 'in', ['test-user-1', 'test-user-2', 'test-user-3'])
    );
    
    const testLikesSnapshot = await getDocs(testLikesQuery);
    testLikesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('✅ Test data cleaned up successfully');
    
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  }
}
