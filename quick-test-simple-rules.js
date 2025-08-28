// QUICK TEST - Copy and paste this into browser console
// Run this AFTER applying the simple Firebase rules

console.log('🚀 Quick Test with Simple Rules...');

async function quickTest() {
  try {
    const { db, collection, getDocs, query, where } = window;
    
    if (!db) {
      console.log('❌ Database not found');
      return;
    }
    
    console.log('✅ Database found');
    
    // Get current user
    const currentUser = window.auth?.currentUser;
    const currentUserId = currentUser?.uid;
    
    if (!currentUserId) {
      console.log('❌ Not logged in');
      return;
    }
    
    console.log('✅ User logged in:', currentUserId);
    
    // Test reading likes
    console.log('📊 Testing likes collection...');
    
    const likesQuery = query(collection(db, 'likes'));
    const likesSnapshot = await getDocs(likesQuery);
    
    console.log(`✅ Successfully read likes: ${likesSnapshot.size} documents`);
    
    // Test reading user's likes
    const userLikesQuery = query(collection(db, 'likes'), where('likerId', '==', currentUserId));
    const userLikesSnapshot = await getDocs(userLikesQuery);
    
    console.log(`✅ User has ${userLikesSnapshot.size} likes`);
    
    if (userLikesSnapshot.size > 0) {
      console.log('📋 Your likes:');
      userLikesSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`- Liked: ${data.likedId}`);
      });
    }
    
    console.log('🎉 Test successful!');
    console.log('🔄 Now go to /matches and check "You Liked Profiles"');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

quickTest();
