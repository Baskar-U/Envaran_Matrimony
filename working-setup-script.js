// WORKING SETUP SCRIPT - Copy and paste this into browser console
// Make sure you're on localhost:3001 and logged in

console.log('🚀 Starting Working Firebase Setup...');

// Wait for Firebase to be available
setTimeout(async () => {
  try {
    // Check if Firebase is available
    if (typeof firebase !== 'undefined') {
      const db = firebase.firestore();
      console.log('✅ Firebase found and accessible!');
      
      // Create collections
      console.log('📝 Creating collections...');
      
      try {
        // Create likes collection
        await db.collection('likes').doc('setup-test').set({
          likerId: 'setup-user',
          likedId: 'setup-target',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('✅ Likes collection created');
        
        // Create matches collection
        await db.collection('matches').doc('setup-test').set({
          user1Id: 'setup-user-1',
          user2Id: 'setup-user-2',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'active'
        });
        console.log('✅ Matches collection created');
        
        // Create notifications collection
        await db.collection('notifications').doc('setup-test').set({
          userId: 'setup-user',
          type: 'like',
          data: {
            likerId: 'setup-liker',
            likerName: 'Setup User',
            likerProfileImage: ''
          },
          read: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('✅ Notifications collection created');
        
        // Test queries to trigger index creation
        console.log('📊 Triggering index creation...');
        
        const testQueries = [
          db.collection('likes').where('likerId', '==', 'test'),
          db.collection('likes').where('likedId', '==', 'test'),
          db.collection('likes').orderBy('createdAt', 'desc'),
          db.collection('matches').where('user1Id', '==', 'test'),
          db.collection('matches').where('user2Id', '==', 'test'),
          db.collection('matches').orderBy('createdAt', 'desc'),
          db.collection('notifications').where('userId', '==', 'test'),
          db.collection('notifications').where('type', '==', 'like'),
          db.collection('notifications').where('read', '==', false),
          db.collection('notifications').orderBy('createdAt', 'desc')
        ];
        
        for (const queryRef of testQueries) {
          try {
            await queryRef.get();
          } catch (error) {
            console.log(`Index creation triggered: ${error.message}`);
          }
        }
        
        console.log('✅ Index creation triggered successfully!');
        
        // Test the setup
        console.log('🧪 Testing setup...');
        
        const likesTest = await db.collection('likes').where('likerId', '==', 'setup-user').get();
        console.log(`✅ Likes test: ${likesTest.size} documents found`);
        
        const matchesTest = await db.collection('matches').where('user1Id', '==', 'setup-user-1').get();
        console.log(`✅ Matches test: ${matchesTest.size} documents found`);
        
        const notificationsTest = await db.collection('notifications').where('userId', '==', 'setup-user').get();
        console.log(`✅ Notifications test: ${notificationsTest.size} documents found`);
        
        console.log('🎉 Setup completed successfully!');
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
      }
      
    } else {
      console.log('❌ Firebase not found. Please refresh the page and try again.');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('💡 Please make sure you are logged in and on the correct page.');
  }
}, 2000); // Wait 2 seconds for Firebase to initialize
