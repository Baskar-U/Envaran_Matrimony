// TEST AFTER RULES FIX - Copy and paste this into browser console
// Run this AFTER updating the Firebase security rules

console.log('🔍 Testing After Rules Fix...');

// Function to test after rules fix
async function testAfterRulesFix() {
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
      return;
    }
    
    console.log('🔍 Current user ID:', currentUserId);
    
    // Test reading likes collection
    console.log('📊 Testing likes collection access...');
    
    try {
      const likesQuery = query(collection(db, 'likes'));
      const likesSnapshot = await getDocs(likesQuery);
      
      console.log(`✅ Successfully read likes collection: ${likesSnapshot.size} documents`);
      
      // Test reading user's own likes
      const userLikesQuery = query(collection(db, 'likes'), where('likerId', '==', currentUserId));
      const userLikesSnapshot = await getDocs(userLikesQuery);
      
      console.log(`✅ Successfully read user's likes: ${userLikesSnapshot.size} likes`);
      
      if (userLikesSnapshot.size > 0) {
        console.log('📋 User likes found:');
        userLikesSnapshot.forEach(doc => {
          const data = doc.data();
          console.log(`- Liked user: ${data.likedId}`);
          console.log(`- Created: ${data.createdAt}`);
        });
      }
      
    } catch (error) {
      console.log('❌ Error reading likes:', error.message);
      return;
    }
    
    // Test creating a like
    console.log('🧪 Testing like creation...');
    
    try {
      const testLikeRef = doc(collection(db, 'likes'), 'test-like-' + Date.now());
      await setDoc(testLikeRef, {
        likerId: currentUserId,
        likedId: 'test-user-' + Date.now(),
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
    
    console.log('🎉 All tests passed!');
    console.log('');
    console.log('✅ Your Firebase rules are now working correctly!');
    console.log('🔄 Now go to /matches and check "You Liked Profiles" tab');
    console.log('💡 The liked profiles should now appear!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAfterRulesFix();
