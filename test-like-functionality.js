// Test script to verify like functionality
// This script tests the like system and shows how it works

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

async function testLikeFunctionality() {
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
    
    // Test 5: Get all profiles that have liked user1
    console.log('\n🔍 Test 5: Getting all profiles that have liked user1...');
    const likedUser1Query = query(
      collection(db, 'likes'),
      where('likedId', '==', user1Id),
      orderBy('createdAt', 'desc')
    );
    
    const likedUser1Snapshot = await getDocs(likedUser1Query);
    const profilesLikedUser1 = [];
    likedUser1Snapshot.forEach(doc => {
      profilesLikedUser1.push(doc.data());
    });
    
    console.log(`${profilesLikedUser1.length} profiles have liked User1:`);
    profilesLikedUser1.forEach(like => {
      console.log(`- ${like.likerId}`);
    });
    
    // Test 6: Find mutual matches for user1
    console.log('\n🔍 Test 6: Finding mutual matches for user1...');
    const user1Matches = [];
    
    for (const like of user1LikedProfiles) {
      const mutualLikeQuery = query(
        collection(db, 'likes'),
        where('likerId', '==', like.likedId),
        where('likedId', '==', user1Id)
      );
      
      const mutualLikeSnapshot = await getDocs(mutualLikeQuery);
      if (!mutualLikeSnapshot.empty) {
        user1Matches.push(like.likedId);
      }
    }
    
    console.log(`User1 has ${user1Matches.length} mutual matches:`);
    user1Matches.forEach(matchId => {
      console.log(`- ${matchId}`);
    });
    
    // Test 7: Simulate the like button states
    console.log('\n🎯 Test 7: Simulating like button states...');
    
    // For user1 viewing user2's profile
    const user1ViewingUser2 = !user1LikesUser2Snapshot.empty;
    console.log(`User1 viewing User2's profile - Button should show: ${user1ViewingUser2 ? 'Liked (green)' : 'Like (blue)'}`);
    
    // For user1 viewing user3's profile
    const user1ViewingUser3Query = query(
      collection(db, 'likes'),
      where('likerId', '==', user1Id),
      where('likedId', '==', user3Id)
    );
    const user1ViewingUser3Snapshot = await getDocs(user1ViewingUser3Query);
    const user1ViewingUser3 = !user1ViewingUser3Snapshot.empty;
    console.log(`User1 viewing User3's profile - Button should show: ${user1ViewingUser3 ? 'Liked (green)' : 'Like (blue)'}`);
    
    // For user2 viewing user1's profile
    const user2ViewingUser1 = !user2LikesUser1Snapshot.empty;
    console.log(`User2 viewing User1's profile - Button should show: ${user2ViewingUser1 ? 'Liked (green)' : 'Like (blue)'}`);
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- User1 has liked ${user1LikedProfiles.length} profiles`);
    console.log(`- ${profilesLikedUser1.length} profiles have liked User1`);
    console.log(`- User1 has ${user1Matches.length} mutual matches`);
    console.log(`- Mutual match between User1 and User2: ${isMutualLike}`);
    
  } catch (error) {
    console.error('❌ Error testing like functionality:', error);
    throw error;
  }
}

// Function to clean up test data
async function cleanupTestData() {
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

// Export functions
module.exports = {
  testLikeFunctionality,
  cleanupTestData
};

// Run test if this file is executed directly
if (require.main === module) {
  testLikeFunctionality()
    .then(() => {
      console.log('\n🎉 Like functionality test completed!');
      console.log('\n💡 To clean up test data, run: cleanupTestData()');
    })
    .catch(console.error);
}
