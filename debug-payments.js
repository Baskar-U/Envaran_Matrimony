// Debug Payments - Check Firebase Data
console.log('🔍 Debugging Payments Issue...');

async function debugPayments() {
  try {
    console.log('📋 Checking Firebase payments collection...');
    
    if (!window.db || !window.collection || !window.getDocs || !window.query || !window.orderBy) {
      console.log('❌ Firebase functions not available');
      console.log('Available functions:');
      console.log('• window.db:', !!window.db);
      console.log('• window.collection:', !!window.collection);
      console.log('• window.getDocs:', !!window.getDocs);
      console.log('• window.query:', !!window.query);
      console.log('• window.orderBy:', !!window.orderBy);
      return;
    }
    
    console.log('✅ Firebase functions available');
    
    // Check if user is logged in
    if (!window.auth || !window.auth.currentUser) {
      console.log('❌ No user logged in');
      return;
    }
    
    console.log('✅ User logged in:', window.auth.currentUser.email);
    
    // Fetch payments directly
    console.log('📥 Fetching payments from Firebase...');
    
    const paymentsCollection = window.collection(window.db, 'payments');
    const paymentsQuery = window.query(paymentsCollection, window.orderBy('submittedAt', 'desc'));
    
    console.log('🔍 Query created, fetching documents...');
    
    const snapshot = await window.getDocs(paymentsQuery);
    
    console.log('📊 Query Results:');
    console.log('• Total documents found:', snapshot.size);
    console.log('• Empty:', snapshot.empty);
    
    if (snapshot.empty) {
      console.log('❌ No payments found in database');
      console.log('💡 Possible reasons:');
      console.log('1. Payments collection is empty');
      console.log('2. Collection name is different');
      console.log('3. Firestore rules blocking access');
      console.log('4. Database connection issue');
    } else {
      console.log('✅ Payments found!');
      console.log('📋 Payment details:');
      
      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`\n--- Payment ${index + 1} ---`);
        console.log('• ID:', doc.id);
        console.log('• User ID:', data.userId);
        console.log('• User Email:', data.userEmail);
        console.log('• User Name:', data.userName);
        console.log('• Plan:', data.plan);
        console.log('• Amount:', data.amount);
        console.log('• Status:', data.status);
        console.log('• Submitted At:', data.submittedAt);
        console.log('• Transaction ID:', data.transactionId);
        console.log('• Has Screenshot:', !!data.screenshotBase64);
      });
    }
    
    // Check other collections
    console.log('\n🔍 Checking other collections...');
    
    const collections = ['registrations', 'users', 'likes', 'matches'];
    
    for (const collectionName of collections) {
      try {
        const testCollection = window.collection(window.db, collectionName);
        const testQuery = window.query(testCollection, window.orderBy('createdAt', 'desc'));
        const testSnapshot = await window.getDocs(testQuery);
        console.log(`• ${collectionName}: ${testSnapshot.size} documents`);
      } catch (error) {
        console.log(`• ${collectionName}: Error - ${error.message}`);
      }
    }
    
    // Test admin access
    console.log('\n🔐 Testing Admin Access...');
    
    const adminEmails = [
      'admin@secondchancematrimony.com',
      'baskar@example.com', 
      'baskar@gmail.com'
    ];
    
    const currentEmail = window.auth.currentUser.email;
    const isAdminEmail = adminEmails.some(email => 
      email.toLowerCase() === currentEmail?.toLowerCase()
    );
    
    console.log('• Current email:', currentEmail);
    console.log('• Is admin email:', isAdminEmail);
    
    if (isAdminEmail) {
      console.log('✅ You have admin email access');
      console.log('💡 The issue might be:');
      console.log('1. Admin password not verified');
      console.log('2. Firestore security rules');
      console.log('3. Collection permissions');
    } else {
      console.log('❌ Your email is not in admin list');
    }
    
  } catch (error) {
    console.error('❌ Error debugging payments:', error);
    console.log('💡 Error details:', error.message);
    console.log('💡 Error code:', error.code);
  }
}

// Run the debug
debugPayments();
