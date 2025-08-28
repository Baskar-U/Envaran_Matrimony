// Copy and paste this entire script into your browser console
// Make sure you're on your application page (localhost:3001) and logged in

(async function() {
  console.log('🚀 Starting Firebase Like Collections Setup...');
  
  try {
    // Access Firebase from the global window object (if available)
    let db;
    
    // Try to get Firebase from different possible sources
    if (window.firebase) {
      db = window.firebase.firestore();
      console.log('✅ Using window.firebase');
    } else if (window.__FIREBASE_DB__) {
      db = window.__FIREBASE_DB__;
      console.log('✅ Using window.__FIREBASE_DB__');
    } else {
      // Try to access from your app's global variables
      const app = document.querySelector('#root')?.__vite_ssr_exports__?.default?.firebase;
      if (app) {
        db = app.firestore();
        console.log('✅ Using app firebase instance');
      } else {
        throw new Error('Firebase not found. Please make sure you are logged in and on your app page.');
      }
    }
    
    console.log('✅ Firebase connection established');
    
    // Create collections with sample data
    console.log('📝 Creating collections...');
    
    // Create likes collection
    try {
      await db.collection('likes').doc('sample-like-1').set({
        likerId: 'sample-user-1',
        likedId: 'sample-user-2',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Likes collection created');
    } catch (error) {
      console.log('⚠️ Likes collection may already exist:', error.message);
    }
    
    // Create matches collection
    try {
      await db.collection('matches').doc('sample-match-1').set({
        user1Id: 'sample-user-1',
        user2Id: 'sample-user-2',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      });
      console.log('✅ Matches collection created');
    } catch (error) {
      console.log('⚠️ Matches collection may already exist:', error.message);
    }
    
    // Create notifications collection
    try {
      await db.collection('notifications').doc('sample-notification-1').set({
        userId: 'sample-user-2',
        type: 'like',
        data: {
          likerId: 'sample-user-1',
          likerName: 'Sample User 1',
          likerProfileImage: ''
        },
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Notifications collection created');
    } catch (error) {
      console.log('⚠️ Notifications collection may already exist:', error.message);
    }
    
    // Test like functionality
    console.log('🧪 Testing like functionality...');
    
    try {
      // Create test likes
      await db.collection('likes').doc('test-like-1').set({
        likerId: 'test-user-1',
        likedId: 'test-user-2',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await db.collection('likes').doc('test-like-2').set({
        likerId: 'test-user-2',
        likedId: 'test-user-1',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Test likes created successfully');
      
      // Test query
      const user1Likes = await db.collection('likes')
        .where('likerId', '==', 'test-user-1')
        .get();
      
      console.log(`User1 has liked ${user1Likes.size} profiles`);
      
    } catch (error) {
      console.log('⚠️ Test functionality error:', error.message);
    }
    
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Go to Firebase Console > Firestore Database');
    console.log('2. Create these indexes in the Indexes tab:');
    console.log('   - Collection: likes, Fields: likerId (Ascending)');
    console.log('   - Collection: likes, Fields: likedId (Ascending)');
    console.log('   - Collection: likes, Fields: createdAt (Descending)');
    console.log('   - Collection: matches, Fields: user1Id (Ascending)');
    console.log('   - Collection: matches, Fields: user2Id (Ascending)');
    console.log('   - Collection: notifications, Fields: userId (Ascending)');
    console.log('3. Update security rules (see LIKE_FUNCTIONALITY_SETUP.md)');
    console.log('4. Test the like functionality in your profiles page');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('');
    console.log('💡 Manual setup instructions:');
    console.log('1. Go to Firebase Console > Firestore Database');
    console.log('2. Manually create these collections: likes, matches, notifications');
    console.log('3. Add a sample document to each collection');
    console.log('4. Create the required indexes');
    console.log('5. Update security rules');
  }
})();
