// Firebase Index Creation Script
// Run this in your browser console after the app is loaded

console.log('🔧 Creating Firebase Firestore Index...');

// Check if Firebase is available
if (typeof window !== 'undefined' && window.db) {
  console.log('✅ Firebase is available');
  
  // Create the index for notifications collection
  const createNotificationsIndex = async () => {
    try {
      console.log('📝 Creating notifications index...');
      
      // This will create a composite index for notifications collection
      // Fields: userId (Ascending), createdAt (Descending), __name__ (Descending)
      
      // Note: Firebase Admin SDK is required to create indexes programmatically
      // For client-side, we need to use the Firebase Console or REST API
      
      // Alternative approach: Create a sample document to trigger index creation
      const sampleNotification = {
        userId: 'temp-user-id',
        type: 'test',
        title: 'Index Creation Test',
        message: 'This is a temporary notification to help create the index',
        createdAt: new Date(),
        read: false
      };
      
      // Add a temporary document to trigger index creation
      const docRef = await window.addDoc(window.collection(window.db, 'notifications'), sampleNotification);
      console.log('✅ Temporary notification created with ID:', docRef.id);
      
      // Delete the temporary document
      await window.deleteDoc(window.doc(window.db, 'notifications', docRef.id));
      console.log('✅ Temporary notification deleted');
      
      console.log('🎉 Index creation process completed!');
      console.log('📋 Next steps:');
      console.log('1. Go to Firebase Console → Firestore Database → Indexes');
      console.log('2. Look for the notifications collection');
      console.log('3. The index should be created automatically or you can create it manually');
      console.log('4. Manual index creation:');
      console.log('   - Collection ID: notifications');
      console.log('   - Fields: userId (Ascending), createdAt (Descending), __name__ (Descending)');
      
    } catch (error) {
      console.error('❌ Error creating index:', error);
      
      if (error.code === 'failed-precondition') {
        console.log('💡 This error is expected. The index needs to be created manually in Firebase Console.');
        console.log('📋 Manual Index Creation Instructions:');
        console.log('1. Go to: https://console.firebase.google.com/');
        console.log('2. Select your project: matrimony-events');
        console.log('3. Go to Firestore Database → Indexes');
        console.log('4. Click "Add Index"');
        console.log('5. Collection ID: notifications');
        console.log('6. Add fields:');
        console.log('   - userId (Ascending)');
        console.log('   - createdAt (Descending)');
        console.log('   - __name__ (Descending)');
        console.log('7. Click "Create Index"');
      }
    }
  };
  
  // Execute the index creation
  createNotificationsIndex();
  
} else {
  console.log('❌ Firebase is not available');
  console.log('💡 Make sure you are on the registration page and Firebase is loaded');
  console.log('📋 Manual Index Creation Instructions:');
  console.log('1. Go to: https://console.firebase.google.com/');
  console.log('2. Select your project: matrimony-events');
  console.log('3. Go to Firestore Database → Indexes');
  console.log('4. Click "Add Index"');
  console.log('5. Collection ID: notifications');
  console.log('6. Add fields:');
  console.log('   - userId (Ascending)');
  console.log('   - createdAt (Descending)');
  console.log('   - __name__ (Descending)');
  console.log('7. Click "Create Index"');
}

// Alternative: Direct link to create the index
console.log('🔗 Direct link to create index:');
console.log('https://console.firebase.google.com/v1/r/project/matrimony-events/firestore/indexes?create_composite=ClZwcm9qZWN0cy9tYXRyaW1vbnktZXZlbnRzL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9ub3RpZmljYXRpb25zL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI');

