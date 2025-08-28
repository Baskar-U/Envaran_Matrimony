// Test Approval Process - Verify Premium Upgrade
console.log('🧪 Testing Approval Process...');

async function testApprovalProcess() {
  try {
    console.log('📋 Checking current payments and users...');
    
    if (!window.db || !window.collection || !window.getDocs || !window.query || !window.orderBy) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    // Get all payments
    const paymentsCollection = window.collection(window.db, 'payments');
    const paymentsQuery = window.query(paymentsCollection, window.orderBy('submittedAt', 'desc'));
    const paymentsSnapshot = await window.getDocs(paymentsQuery);
    
    console.log('📊 Total payments found:', paymentsSnapshot.size);
    
    if (paymentsSnapshot.empty) {
      console.log('❌ No payments found to test');
      return;
    }
    
    // Get all registrations
    const registrationsCollection = window.collection(window.db, 'registrations');
    const registrationsQuery = window.query(registrationsCollection, window.orderBy('createdAt', 'desc'));
    const registrationsSnapshot = await window.getDocs(registrationsQuery);
    
    console.log('👥 Total users found:', registrationsSnapshot.size);
    
    // Create a map of user IDs to their data
    const userMap = new Map();
    registrationsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      userMap.set(data.userId, {
        id: doc.id,
        email: data.email,
        name: data.name,
        accountType: data.accountType || 'free',
        premiumUpgradedAt: data.premiumUpgradedAt,
        premiumPlan: data.premiumPlan
      });
    });
    
    console.log('\n🔍 Payment Analysis:');
    
    paymentsSnapshot.docs.forEach((doc, index) => {
      const payment = doc.data();
      const user = userMap.get(payment.userId);
      
      console.log(`\n--- Payment ${index + 1} ---`);
      console.log('• Payment ID:', doc.id);
      console.log('• User Name:', payment.userName);
      console.log('• User Email:', payment.userEmail);
      console.log('• User ID:', payment.userId);
      console.log('• Plan:', payment.plan);
      console.log('• Amount:', payment.amount);
      console.log('• Status:', payment.status);
      console.log('• Submitted:', payment.submittedAt.toDate ? payment.submittedAt.toDate().toLocaleDateString() : 'N/A');
      
      if (user) {
        console.log('• User Account Type:', user.accountType);
        console.log('• Premium Plan:', user.premiumPlan || 'N/A');
        console.log('• Premium Since:', user.premiumUpgradedAt ? 
          new Date(user.premiumUpgradedAt.toDate ? user.premiumUpgradedAt.toDate() : user.premiumUpgradedAt).toLocaleDateString() : 
          'N/A');
        
        // Check if approval worked correctly
        if (payment.status === 'approved' && user.accountType !== 'premium') {
          console.log('⚠️  ISSUE: Payment approved but user not premium!');
        } else if (payment.status === 'approved' && user.accountType === 'premium') {
          console.log('✅ CORRECT: Payment approved and user is premium');
        } else if (payment.status === 'pending') {
          console.log('⏳ PENDING: Payment awaiting approval');
        }
      } else {
        console.log('❌ ERROR: User not found in registrations!');
      }
    });
    
    // Summary
    const approvedPayments = paymentsSnapshot.docs.filter(doc => doc.data().status === 'approved');
    const premiumUsers = Array.from(userMap.values()).filter(user => user.accountType === 'premium');
    
    console.log('\n📈 Summary:');
    console.log('• Total payments:', paymentsSnapshot.size);
    console.log('• Approved payments:', approvedPayments.length);
    console.log('• Premium users:', premiumUsers.length);
    console.log('• Free users:', Array.from(userMap.values()).filter(user => user.accountType === 'free').length);
    
    if (approvedPayments.length !== premiumUsers.length) {
      console.log('⚠️  WARNING: Number of approved payments does not match premium users!');
      console.log('💡 This might indicate an issue with the approval process.');
    } else {
      console.log('✅ All approved payments have corresponding premium users');
    }
    
  } catch (error) {
    console.error('❌ Error testing approval process:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the test
testApprovalProcess();
