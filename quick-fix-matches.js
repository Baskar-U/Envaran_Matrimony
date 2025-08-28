// QUICK FIX FOR MATCHES - Copy and paste this into browser console
// This will manually refresh the matches page and check likes

console.log('🔧 Quick Fix for Matches Page...');

// Function to manually refresh matches
async function quickFixMatches() {
  try {
    // Get the exposed Firebase functions from main.tsx
    const { db, collection, doc, setDoc, getDocs, query, where } = window;
    
    if (!db) {
      console.log('❌ Database not found');
      return;
    }
    
    console.log('✅ Database found');
    
    // First, let's check if we're on the matches page
    if (window.location.pathname !== '/matches') {
      console.log('⚠️ Not on matches page. Redirecting...');
      window.location.href = '/matches';
      return;
    }
    
    console.log('✅ On matches page');
    
    // Check if likes collection exists
    console.log('📊 Checking likes collection...');
    
    try {
      const likesQuery = query(collection(db, 'likes'));
      const likesSnapshot = await getDocs(likesQuery);
      
      console.log(`✅ Likes collection found with ${likesSnapshot.size} documents`);
      
      if (likesSnapshot.size > 0) {
        console.log('📋 All likes:');
        likesSnapshot.forEach(doc => {
          const data = doc.data();
          console.log(`- ${data.likerId} liked ${data.likedId}`);
        });
      }
      
    } catch (error) {
      console.log('❌ Error checking likes:', error.message);
    }
    
    // Force refresh the page
    console.log('🔄 Refreshing matches page...');
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Quick fix failed:', error);
  }
}

// Alternative: Manual like creation for testing
async function createTestLike() {
  try {
    const { db, collection, doc, setDoc } = window;
    
    if (!db) {
      console.log('❌ Database not found');
      return;
    }
    
    // Create a test like
    const testLikeRef = doc(collection(db, 'likes'), 'test-like-' + Date.now());
    await setDoc(testLikeRef, {
      likerId: 'test-user-1', // Replace with your actual user ID
      likedId: 'test-user-2',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Test like created');
    console.log('🔄 Refreshing page...');
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error creating test like:', error);
  }
}

// Run the quick fix
quickFixMatches();

// Also provide manual functions
console.log('');
console.log('💡 Manual functions available:');
console.log('- quickFixMatches() - Refresh matches page');
console.log('- createTestLike() - Create a test like');
