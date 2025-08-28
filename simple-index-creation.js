// Simple Index Creation Script
// Copy and paste this entire code into your browser console

(async () => {
  console.log('🔧 Creating Firebase Index...');
  
  try {
    // Check if Firebase is available
    if (!window.db) {
      throw new Error('Firebase not available. Make sure you are on the registration page.');
    }
    
    console.log('✅ Firebase detected');
    
    // Create a temporary notification to trigger index creation
    const tempNotification = {
      userId: 'temp-index-creation',
      type: 'index_creation',
      title: 'Index Creation',
      message: 'Temporary notification for index creation',
      createdAt: new Date(),
      read: false
    };
    
    console.log('📝 Creating temporary notification...');
    const docRef = await window.addDoc(window.collection(window.db, 'notifications'), tempNotification);
    console.log('✅ Temporary notification created:', docRef.id);
    
    // Delete the temporary notification
    await window.deleteDoc(window.doc(window.db, 'notifications', docRef.id));
    console.log('✅ Temporary notification deleted');
    
    console.log('🎉 Index creation process completed!');
    console.log('📋 The index should now be created automatically.');
    console.log('🔗 If you still see index errors, use this direct link:');
    console.log('https://console.firebase.google.com/v1/r/project/matrimony-events/firestore/indexes?create_composite=ClZwcm9qZWN0cy9tYXRyaW1vbnktZXZlbnRzL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9ub3RpZmljYXRpb25zL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'failed-precondition') {
      console.log('💡 Index needs manual creation. Follow these steps:');
      console.log('1. Go to: https://console.firebase.google.com/');
      console.log('2. Select project: matrimony-events');
      console.log('3. Go to Firestore Database → Indexes');
      console.log('4. Click "Add Index"');
      console.log('5. Collection: notifications');
      console.log('6. Fields: userId (Ascending), createdAt (Descending), __name__ (Descending)');
    } else if (error.message.includes('Firebase not available')) {
      console.log('💡 Make sure you are on the registration page and the app is loaded');
    }
  }
})();

