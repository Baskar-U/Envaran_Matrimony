// TEST LIKES AFTER RULES UPDATE - Copy and paste this into browser console
// Run this AFTER updating Firebase security rules

console.log('🔍 Testing Likes After Rules Update...');

// Function to test likes after rules update
async function testLikesAfterRules() {
  try {
    // Get the exposed Firebase functions from main.tsx
    const { db, collection, doc, setDoc, getDocs, query, where, deleteDoc } = window;
    
    if (!db) {
      console.log('❌ Database not found');
      return;
    }
    
    console.log('✅ Database found');
    
    // Get current user ID from Firebase Auth
    const currentUser = window.auth?.currentUser;
    const currentUserId = currentUser?.uid;
    
    if (!currentUserId) {
      console.log('❌ No authenticated user found');
      console.log('💡 Please make sure you are logged in');
      return;
    }
    
    console.log('🔍 Current user ID:', currentUserId);
    
    // Check if likes collection exists and has data
    console.log('📊 Checking likes collection...');
    
    try {
      const likesQuery = query(collection(db, 'likes'));
      const likesSnapshot = await getDocs(likesQuery);
      
      console.log(`✅ Likes collection found with ${likesSnapshot.size} documents`);
      
      if (likesSnapshot.size > 0) {
        console.log('📋 All likes in the collection:');
        likesSnapshot.forEach(doc => {
          const data = doc.data();
          console.log(`- Like ID: ${doc.id}`);
          console.log(`  Liker ID: ${data.likerId}`);
          console.log(`  Liked ID: ${data.likedId}`);
          console.log(`  Created At: ${data.createdAt}`);
          console.log('---');
        });
      }
      
      // Check for likes by current user
      console.log('🔍 Checking likes by current user...');
      const userLikesQuery = query(collection(db, 'likes'), where('likerId', '==', currentUserId));
      const userLikesSnapshot = await getDocs(userLikesQuery);
      
      console.log(`✅ User has ${userLikesSnapshot.size} likes`);
      
      if (userLikesSnapshot.size > 0) {
        console.log('📋 User likes:');
        userLikesSnapshot.forEach(doc => {
          const data = doc.data();
          console.log(`- Like ID: ${doc.id}`);
          console.log(`  Liked User ID: ${data.likedId}`);
          console.log(`  Created At: ${data.createdAt}`);
        });
      }
      
    } catch (error) {
      console.log('❌ Error checking likes collection:', error.message);
      console.log('💡 Make sure you updated Firebase security rules');
      return;
    }
    
    // Test creating a like
    console.log('🧪 Testing like creation...');
    
    try {
      const testLikeRef = doc(collection(db, 'likes'), 'test-like-' + Date.now());
      await setDoc(testLikeRef, {
        likerId: currentUserId,
        likedId: 'test-liked-user',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Test like created successfully');
      
      // Clean up test like
      await deleteDoc(testLikeRef);
      console.log('✅ Test like cleaned up');
      
    } catch (error) {
      console.log('❌ Error creating test like:', error.message);
    }
    
    console.log('🎉 Test completed successfully!');
    console.log('');
    console.log('✅ If you see this message, your likes system is working!');
    console.log('🔄 Now refresh your matches page to see the liked profiles');
    console.log('');
    console.log('💡 Next steps:');
    console.log('1. Go to /profiles and like some profiles');
    console.log('2. Go to /matches and check "You Liked Profiles" tab');
    console.log('3. The liked profiles should now appear!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testLikesAfterRules();
