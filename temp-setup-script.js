// TEMPORARY SETUP SCRIPT - This will work with current security rules
// Copy and paste this into browser console on localhost:3001

console.log('🚀 Starting Temporary Firebase Setup...');

// Wait for Firebase to be available
setTimeout(async () => {
  try {
    if (typeof firebase !== 'undefined') {
      const db = firebase.firestore();
      console.log('✅ Firebase found and accessible!');
      
      // First, let's check what collections already exist
      console.log('🔍 Checking existing collections...');
      
      try {
        // Try to read from existing collections to see what's available
        const registrationsSnapshot = await db.collection('registrations').limit(1).get();
        console.log(`✅ Registrations collection exists (${registrationsSnapshot.size} documents)`);
        
        // Try to create a test document in registrations (which should work)
        const testDocRef = db.collection('registrations').doc('setup-test');
        await testDocRef.set({
          userId: 'setup-test-user',
          name: 'Setup Test User',
          email: 'setup@test.com',
          createdAt: new Date(),
          testData: true
        });
        console.log('✅ Test document created in registrations');
        
        // Now try to create the new collections
        console.log('📝 Attempting to create new collections...');
        
        // Try likes collection
        try {
          const likesRef = db.collection('likes').doc('test-like');
          await likesRef.set({
            likerId: 'test-user',
            likedId: 'test-target',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          console.log('✅ Likes collection created successfully');
        } catch (error) {
          console.log('⚠️ Likes collection error:', error.message);
        }
        
        // Try matches collection
        try {
          const matchesRef = db.collection('matches').doc('test-match');
          await matchesRef.set({
            user1Id: 'test-user-1',
            user2Id: 'test-user-2',
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'active'
          });
          console.log('✅ Matches collection created successfully');
        } catch (error) {
          console.log('⚠️ Matches collection error:', error.message);
        }
        
        // Try notifications collection
        try {
          const notificationsRef = db.collection('notifications').doc('test-notification');
          await notificationsRef.set({
            userId: 'test-user',
            type: 'like',
            data: {
              likerId: 'test-liker',
              likerName: 'Test User',
              likerProfileImage: ''
            },
            read: false,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          console.log('✅ Notifications collection created successfully');
        } catch (error) {
          console.log('⚠️ Notifications collection error:', error.message);
        }
        
        // Clean up test document
        await testDocRef.delete();
        console.log('✅ Test document cleaned up');
        
        console.log('🎉 Setup attempt completed!');
        console.log('');
        console.log('📋 Next steps:');
        console.log('1. Go to Firebase Console > Firestore Database > Rules');
        console.log('2. Replace the rules with the following:');
        console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow read/write for all authenticated users (temporary for setup)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`);
        console.log('');
        console.log('3. After updating rules, run this script again');
        console.log('4. Once collections are created, update rules with proper security');
        
      } catch (error) {
        console.error('❌ Setup failed:', error);
        console.log('💡 Error details:', error.message);
        console.log('');
        console.log('📋 Solution: Update Firebase security rules to allow write access');
      }
      
    } else {
      console.log('❌ Firebase not found. Please refresh the page and try again.');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('💡 Please make sure you are logged in and on the correct page.');
  }
}, 2000);
