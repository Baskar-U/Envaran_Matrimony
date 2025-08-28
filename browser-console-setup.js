// Copy and paste this entire script into your browser console
// Make sure you're on your application page (localhost:3001) and logged in

(async function() {
  console.log('🚀 Starting Firebase Like Collections Setup...');
  
  try {
    // Get Firebase instance from your app
    const { db } = await import('/src/lib/firebase.js');
    const { 
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
    } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    console.log('✅ Firebase modules loaded successfully');
    
    // Function to create collections
    async function createCollections() {
      console.log('📝 Creating Firebase collections...');
      
      const batch = writeBatch(db);
      
      // Create likes collection sample document
      const likesCollection = collection(db, 'likes');
      const sampleLikeRef = doc(likesCollection, 'sample-like-1');
      batch.set(sampleLikeRef, {
        likerId: 'sample-user-1',
        likedId: 'sample-user-2',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Create matches collection sample document
      const matchesCollection = collection(db, 'matches');
      const sampleMatchRef = doc(matchesCollection, 'sample-match-1');
      batch.set(sampleMatchRef, {
        user1Id: 'sample-user-1',
        user2Id: 'sample-user-2',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active'
      });
      
      // Create notifications collection sample document
      const notificationsCollection = collection(db, 'notifications');
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
      console.log('✅ Collections created successfully!');
    }
    
    // Function to check collections
    async function checkCollections() {
      console.log('🔍 Checking existing collections...');
      
      const collections = ['likes', 'matches', 'notifications', 'registrations'];
      
      for (const collectionName of collections) {
        try {
          const collectionRef = collection(db, collectionName);
          const snapshot = await getDocs(query(collectionRef, limit(1)));
          console.log(`✅ ${collectionName} collection exists (${snapshot.size} documents)`);
        } catch (error) {
          console.log(`❌ ${collectionName} collection error: ${error.message}`);
        }
      }
    }
    
    // Function to test like functionality
    async function testLikeFunctionality() {
      console.log('🧪 Testing like functionality...');
      
      const user1Id = 'test-user-1';
      const user2Id = 'test-user-2';
      
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
        likedId: user1Id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      await batch.commit();
      console.log('✅ Test likes created successfully');
      
      // Test queries
      const user1LikesQuery = query(
        collection(db, 'likes'),
        where('likerId', '==', user1Id)
      );
      
      const user1LikesSnapshot = await getDocs(user1LikesQuery);
      console.log(`User1 has liked ${user1LikesSnapshot.size} profiles`);
      
      console.log('✅ Like functionality test completed!');
    }
    
    // Run the setup
    await createCollections();
    await checkCollections();
    await testLikeFunctionality();
    
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
    console.log('💡 Alternative method:');
    console.log('1. Go to Firebase Console > Firestore Database');
    console.log('2. Manually create these collections: likes, matches, notifications');
    console.log('3. Add a sample document to each collection');
    console.log('4. Create the required indexes');
  }
})();
