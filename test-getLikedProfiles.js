// TEST GETLIKEDPROFILES FUNCTION - Copy and paste this into browser console
// This will test the exact function used by the matches page

console.log('🔍 Testing getLikedProfiles Function...');

async function testGetLikedProfiles() {
  try {
    // Get current user
    const currentUser = window.auth?.currentUser;
    const currentUserId = currentUser?.uid;
    
    if (!currentUserId) {
      console.log('❌ Not logged in');
      return;
    }
    
    console.log('✅ User logged in:', currentUserId);
    
    // Test the exact function used by matches page
    console.log('📊 Testing getLikedProfiles function...');
    
    // Import the function (it should be available globally)
    if (typeof window.getLikedProfiles === 'function') {
      console.log('✅ getLikedProfiles function found');
      
      const result = await window.getLikedProfiles(currentUserId);
      console.log('📊 getLikedProfiles result:', result);
      
      if (Array.isArray(result)) {
        console.log(`✅ Function returned ${result.length} liked profiles`);
        result.forEach((like, index) => {
          console.log(`- Like ${index + 1}:`, like);
        });
      } else {
        console.log('❌ Function did not return an array:', result);
      }
      
    } else {
      console.log('❌ getLikedProfiles function not found globally');
      
      // Try to access it from the firebaseAuth module
      console.log('🔍 Trying to access from firebaseAuth...');
      
      // Test direct database access
      const { db, collection, getDocs, query, where } = window;
      
      const likesQuery = query(collection(db, 'likes'), where('likerId', '==', currentUserId));
      const likesSnapshot = await getDocs(likesQuery);
      
      console.log(`✅ Direct query found ${likesSnapshot.size} likes`);
      
      const likes = [];
      for (const likeDoc of likesSnapshot.docs) {
        const likeData = likeDoc.data();
        const likedUserId = likeData.likedId;
        
        console.log(`📋 Processing like for user: ${likedUserId}`);
        
        // Try to get registration data
        try {
          const registrationQuery = query(collection(db, 'registrations'), where('userId', '==', likedUserId));
          const registrationSnapshot = await getDocs(registrationQuery);
          
          if (!registrationSnapshot.empty) {
            const registrationData = registrationSnapshot.docs[0].data();
            likes.push({
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
            console.log(`✅ Added like for: ${registrationData.name}`);
          } else {
            console.log(`❌ No registration data found for: ${likedUserId}`);
          }
        } catch (error) {
          console.log(`❌ Error getting registration for ${likedUserId}:`, error.message);
        }
      }
      
      console.log('📊 Final likes array:', likes);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testGetLikedProfiles();
