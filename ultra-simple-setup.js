// ULTRA SIMPLE SETUP - Copy and paste this into browser console
// Make sure you're on localhost:3001 and logged in

console.log('🚀 Starting Ultra Simple Firebase Setup...');

// Method 1: Try to access Firebase from your app
try {
  // This will work if Firebase is available globally
  if (typeof firebase !== 'undefined') {
    const db = firebase.firestore();
    console.log('✅ Firebase found globally');
    
    // Create collections
    db.collection('likes').doc('test').set({
      likerId: 'test-user',
      likedId: 'test-target',
      createdAt: new Date()
    }).then(() => {
      console.log('✅ Likes collection created');
    }).catch(err => {
      console.log('⚠️ Likes collection error:', err.message);
    });
    
    db.collection('matches').doc('test').set({
      user1Id: 'test-user-1',
      user2Id: 'test-user-2',
      createdAt: new Date(),
      status: 'active'
    }).then(() => {
      console.log('✅ Matches collection created');
    }).catch(err => {
      console.log('⚠️ Matches collection error:', err.message);
    });
    
    db.collection('notifications').doc('test').set({
      userId: 'test-user',
      type: 'like',
      data: { likerId: 'test-liker' },
      read: false,
      createdAt: new Date()
    }).then(() => {
      console.log('✅ Notifications collection created');
    }).catch(err => {
      console.log('⚠️ Notifications collection error:', err.message);
    });
    
  } else {
    console.log('❌ Firebase not found globally');
    console.log('💡 Please go to Firebase Console and manually create:');
    console.log('   - likes collection');
    console.log('   - matches collection');
    console.log('   - notifications collection');
  }
} catch (error) {
  console.error('❌ Setup failed:', error);
  console.log('💡 Manual setup required - see Firebase Console');
}

console.log('📋 Next steps:');
console.log('1. Go to Firebase Console > Firestore Database');
console.log('2. Create indexes for: likerId, likedId, createdAt');
console.log('3. Update security rules');
console.log('4. Test like functionality in your app');
