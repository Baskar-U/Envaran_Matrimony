// Check Firestore Rules - Security Access
console.log('🔒 Checking Firestore Security Rules...');

async function checkFirestoreRules() {
  try {
    console.log('📋 Testing Firestore access...');
    
    if (!window.db || !window.collection || !window.getDocs) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    // Test different collections
    const collections = [
      'payments',
      'registrations', 
      'users',
      'likes',
      'matches'
    ];
    
    console.log('🔍 Testing collection access...');
    
    for (const collectionName of collections) {
      try {
        console.log(`\n📂 Testing ${collectionName} collection...`);
        
        const testCollection = window.collection(window.db, collectionName);
        const testSnapshot = await window.getDocs(testCollection);
        
        console.log(`✅ ${collectionName}: Access granted`);
        console.log(`   • Documents found: ${testSnapshot.size}`);
        console.log(`   • Empty: ${testSnapshot.empty}`);
        
        if (!testSnapshot.empty) {
          const firstDoc = testSnapshot.docs[0];
          const data = firstDoc.data();
          console.log(`   • Sample document ID: ${firstDoc.id}`);
          console.log(`   • Sample fields: ${Object.keys(data).join(', ')}`);
        }
        
      } catch (error) {
        console.log(`❌ ${collectionName}: Access denied`);
        console.log(`   • Error: ${error.message}`);
        console.log(`   • Code: ${error.code}`);
        
        if (error.code === 'permission-denied') {
          console.log(`   • 🔒 This is a Firestore security rules issue`);
          console.log(`   • 💡 You need to update your Firestore rules`);
        }
      }
    }
    
    // Test specific queries
    console.log('\n🔍 Testing specific queries...');
    
    try {
      const paymentsCollection = window.collection(window.db, 'payments');
      const paymentsQuery = window.query(paymentsCollection, window.orderBy('submittedAt', 'desc'));
      const paymentsSnapshot = await window.getDocs(paymentsQuery);
      
      console.log('✅ Payments query: Success');
      console.log(`   • Documents: ${paymentsSnapshot.size}`);
      
    } catch (error) {
      console.log('❌ Payments query: Failed');
      console.log(`   • Error: ${error.message}`);
      console.log(`   • Code: ${error.code}`);
    }
    
    console.log('\n📋 Firestore Rules Check Complete');
    console.log('💡 If you see "permission-denied" errors:');
    console.log('1. Go to Firebase Console');
    console.log('2. Navigate to Firestore Database');
    console.log('3. Click on "Rules" tab');
    console.log('4. Update rules to allow admin access');
    
  } catch (error) {
    console.error('❌ Error checking Firestore rules:', error);
  }
}

// Run the check
checkFirestoreRules();
