// Check User Account Types - System Overview
console.log('👥 Checking User Account Types...');

async function checkUserAccountTypes() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.db || !window.collection || !window.getDocs || !window.query || !window.orderBy) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    console.log('✅ Firebase functions available');
    
    // Get all registrations
    const registrationsCollection = window.collection(window.db, 'registrations');
    const registrationsQuery = window.query(registrationsCollection, window.orderBy('createdAt', 'desc'));
    
    console.log('📥 Fetching all user registrations...');
    const registrationsSnapshot = await window.getDocs(registrationsQuery);
    
    console.log('📊 Total users found:', registrationsSnapshot.size);
    
    if (registrationsSnapshot.empty) {
      console.log('❌ No users found');
      return;
    }
    
    // Analyze account types
    const users = [];
    let freeUsers = 0;
    let premiumUsers = 0;
    let unknownUsers = 0;
    
    registrationsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      const accountType = data.accountType || 'unknown';
      
      users.push({
        id: doc.id,
        email: data.email,
        name: data.name,
        accountType: accountType,
        createdAt: data.createdAt,
        premiumUpgradedAt: data.premiumUpgradedAt
      });
      
      if (accountType === 'free') freeUsers++;
      else if (accountType === 'premium') premiumUsers++;
      else unknownUsers++;
    });
    
    console.log('\n📈 Account Type Summary:');
    console.log('• Free users:', freeUsers);
    console.log('• Premium users:', premiumUsers);
    console.log('• Unknown/Other:', unknownUsers);
    console.log('• Total:', users.length);
    
    console.log('\n👥 Detailed User List:');
    users.forEach((user, index) => {
      const status = user.accountType === 'premium' ? '👑' : '🆓';
      const upgradeDate = user.premiumUpgradedAt ? 
        new Date(user.premiumUpgradedAt.toDate ? user.premiumUpgradedAt.toDate() : user.premiumUpgradedAt).toLocaleDateString() : 
        'N/A';
      
      console.log(`${index + 1}. ${status} ${user.name} (${user.email})`);
      console.log(`   • Account Type: ${user.accountType}`);
      console.log(`   • Premium Since: ${upgradeDate}`);
      console.log(`   • User ID: ${user.id}`);
      console.log('');
    });
    
    // Check payments for these users
    console.log('💳 Checking Payment Status...');
    const paymentsCollection = window.collection(window.db, 'payments');
    const paymentsQuery = window.query(paymentsCollection, window.orderBy('submittedAt', 'desc'));
    const paymentsSnapshot = await window.getDocs(paymentsQuery);
    
    console.log('📊 Total payments found:', paymentsSnapshot.size);
    
    if (!paymentsSnapshot.empty) {
      console.log('\n💳 Payment Details:');
      paymentsSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`${index + 1}. ${data.userName} (${data.userEmail})`);
        console.log(`   • Plan: ${data.plan}`);
        console.log(`   • Amount: ₹${data.amount}`);
        console.log(`   • Status: ${data.status}`);
        console.log(`   • Submitted: ${data.submittedAt.toDate ? data.submittedAt.toDate().toLocaleDateString() : 'N/A'}`);
        console.log(`   • Reviewed: ${data.reviewedAt ? (data.reviewedAt.toDate ? data.reviewedAt.toDate().toLocaleDateString() : 'N/A') : 'Pending'}`);
        console.log('');
      });
    }
    
    console.log('✅ Account type check complete!');
    
  } catch (error) {
    console.error('❌ Error checking user account types:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the check
checkUserAccountTypes();
