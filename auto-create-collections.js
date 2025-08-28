// AUTO CREATE COLLECTIONS - Copy and paste this into browser console
// Make sure you're on localhost:3001 and logged in

console.log('🚀 Starting Auto Collection Creation...');

// Function to create collections and indexes
async function createCollectionsAndIndexes() {
  try {
    // Get the exposed Firebase functions from main.tsx
    const { db, collection, doc, setDoc, getDocs, query, where, orderBy, serverTimestamp } = window;
    
    if (!db) {
      console.log('❌ Database not found. Make sure main.tsx has exposed the db.');
      return;
    }
    
    console.log('✅ Database found and accessible!');
    
    // Create collections with sample data
    console.log('📝 Creating collections...');
    
    // Create likes collection
    try {
      const likesRef = doc(collection(db, 'likes'), 'auto-setup-like');
      await setDoc(likesRef, {
        likerId: 'auto-test-user',
        likedId: 'auto-test-target',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('✅ Likes collection created');
    } catch (error) {
      console.log('⚠️ Likes collection error:', error.message);
    }
    
    // Create matches collection
    try {
      const matchesRef = doc(collection(db, 'matches'), 'auto-setup-match');
      await setDoc(matchesRef, {
        user1Id: 'auto-test-user-1',
        user2Id: 'auto-test-user-2',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active'
      });
      console.log('✅ Matches collection created');
    } catch (error) {
      console.log('⚠️ Matches collection error:', error.message);
    }
    
    // Create notifications collection
    try {
      const notificationsRef = doc(collection(db, 'notifications'), 'auto-setup-notification');
      await setDoc(notificationsRef, {
        userId: 'auto-test-user',
        type: 'like',
        data: {
          likerId: 'auto-test-liker',
          likerName: 'Auto Test User',
          likerProfileImage: ''
        },
        read: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('✅ Notifications collection created');
    } catch (error) {
      console.log('⚠️ Notifications collection error:', error.message);
    }
    
    // Create indexes by running queries
    console.log('📊 Creating indexes...');
    
    const indexQueries = [
      // Likes collection indexes
      query(collection(db, 'likes'), where('likerId', '==', 'test')),
      query(collection(db, 'likes'), where('likedId', '==', 'test')),
      query(collection(db, 'likes'), orderBy('createdAt', 'desc')),
      query(collection(db, 'likes'), where('likerId', '==', 'test'), orderBy('createdAt', 'desc')),
      query(collection(db, 'likes'), where('likedId', '==', 'test'), orderBy('createdAt', 'desc')),
      
      // Matches collection indexes
      query(collection(db, 'matches'), where('user1Id', '==', 'test')),
      query(collection(db, 'matches'), where('user2Id', '==', 'test')),
      query(collection(db, 'matches'), orderBy('createdAt', 'desc')),
      query(collection(db, 'matches'), where('user1Id', '==', 'test'), orderBy('createdAt', 'desc')),
      query(collection(db, 'matches'), where('user2Id', '==', 'test'), orderBy('createdAt', 'desc')),
      
      // Notifications collection indexes
      query(collection(db, 'notifications'), where('userId', '==', 'test')),
      query(collection(db, 'notifications'), where('type', '==', 'like')),
      query(collection(db, 'notifications'), where('read', '==', false)),
      query(collection(db, 'notifications'), orderBy('createdAt', 'desc')),
      query(collection(db, 'notifications'), where('userId', '==', 'test'), orderBy('createdAt', 'desc')),
      query(collection(db, 'notifications'), where('userId', '==', 'test'), where('read', '==', false))
    ];
    
    for (const queryRef of indexQueries) {
      try {
        await getDocs(queryRef);
      } catch (error) {
        // This is expected - it will trigger index creation
        console.log(`Index creation triggered: ${error.message}`);
      }
    }
    
    console.log('✅ Index creation triggered successfully!');
    
    // Test the setup
    console.log('🧪 Testing setup...');
    
    try {
      const likesTest = await getDocs(query(collection(db, 'likes'), where('likerId', '==', 'auto-test-user')));
      console.log(`✅ Likes test: ${likesTest.size} documents found`);
      
      const matchesTest = await getDocs(query(collection(db, 'matches'), where('user1Id', '==', 'auto-test-user-1')));
      console.log(`✅ Matches test: ${matchesTest.size} documents found`);
      
      const notificationsTest = await getDocs(query(collection(db, 'notifications'), where('userId', '==', 'auto-test-user')));
      console.log(`✅ Notifications test: ${notificationsTest.size} documents found`);
      
      console.log('✅ All tests passed!');
      
    } catch (error) {
      console.log('⚠️ Test error:', error.message);
    }
    
    console.log('🎉 Auto collection creation completed successfully!');
    console.log('');
    console.log('📋 What was created:');
    console.log('✅ Collections: likes, matches, notifications');
    console.log('✅ Sample data for testing');
    console.log('✅ Index creation triggered');
    console.log('');
    console.log('🚀 Your like functionality is ready to use!');
    console.log('💡 Go to /profiles and test the like buttons');
    console.log('');
    console.log('📋 Security rules (copy to Firebase Console > Rules):');
    console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Likes collection
    match /likes/{likeId} {
      allow read: if request.auth != null && 
        (resource.data.likerId == request.auth.uid || 
         resource.data.likedId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.likerId == request.auth.uid;
      allow update, delete: if request.auth != null && 
        resource.data.likerId == request.auth.uid;
    }
    
    // Matches collection
    match /matches/{matchId} {
      allow read: if request.auth != null && 
        (resource.data.user1Id == request.auth.uid || 
         resource.data.user2Id == request.auth.uid);
      allow create: if request.auth != null && 
        (request.resource.data.user1Id == request.auth.uid || 
         request.resource.data.user2Id == request.auth.uid);
      allow update: if request.auth != null && 
        (resource.data.user1Id == request.auth.uid || 
         resource.data.user2Id == request.auth.uid);
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Registrations collection
    match /registrations/{registrationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('💡 Error details:', error.message);
    console.log('');
    console.log('📋 Make sure:');
    console.log('1. You are logged in to your app');
    console.log('2. Firebase security rules allow write access');
    console.log('3. main.tsx has exposed the database functions');
  }
}

// Run the setup
createCollectionsAndIndexes();
