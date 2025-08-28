// DEBUG LIKES - Copy and paste this into browser console
// This will help debug why liked profiles aren't showing in matches

console.log('🔍 Debugging Likes System...');

// Function to debug likes
async function debugLikes() {
  try {
    // Get the exposed Firebase functions from main.tsx
    const { db, collection, doc, setDoc, getDocs, query, where, deleteDoc } = window;
    
    if (!db) {
      console.log('❌ Database not found');
      return;
    }
    
    console.log('✅ Database found');
    
    // Get current user ID (you'll need to replace this with your actual user ID)
    const currentUserId = 'your-user-id-here'; // Replace with your actual user ID
    
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
    }
    
    // Check registrations collection
    console.log('📊 Checking registrations collection...');
    
    try {
      const registrationsQuery = query(collection(db, 'registrations'));
      const registrationsSnapshot = await getDocs(registrationsQuery);
      
      console.log(`✅ Registrations collection found with ${registrationsSnapshot.size} documents`);
      
      if (registrationsSnapshot.size > 0) {
        console.log('📋 Sample registration data:');
        const firstDoc = registrationsSnapshot.docs[0];
        const data = firstDoc.data();
        console.log(`- User ID: ${data.userId}`);
        console.log(`- Name: ${data.name}`);
        console.log(`- Email: ${data.email}`);
        console.log(`- Account Type: ${data.accountType}`);
      }
      
    } catch (error) {
      console.log('❌ Error checking registrations collection:', error.message);
    }
    
    // Test creating a like
    console.log('🧪 Testing like creation...');
    
    try {
      const testLikeRef = doc(collection(db, 'likes'), 'debug-test-like');
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
    
    console.log('🎉 Debug completed!');
    console.log('');
    console.log('📋 Summary:');
    console.log('1. Check if likes collection exists and has data');
    console.log('2. Check if current user has any likes');
    console.log('3. Check if registrations collection has data');
    console.log('4. Test if like creation works');
    console.log('');
    console.log('💡 If likes are being created but not showing in matches:');
    console.log('- Check if getLikedProfiles function is working');
    console.log('- Check if the user ID is correct');
    console.log('- Check if the liked user has registration data');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run the debug
debugLikes();
