// Upgrade User to Premium - Manual Script
console.log('👑 Upgrading User to Premium...');

async function upgradeUserToPremium() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.db || !window.collection || !window.updateDoc || !window.doc || !window.query || !window.where || !window.getDocs) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    console.log('✅ Firebase functions available');
    
    // Check if user is logged in
    if (!window.auth || !window.auth.currentUser) {
      console.log('❌ No user logged in');
      return;
    }
    
    console.log('✅ User logged in:', window.auth.currentUser.email);
    
    // Get the email to upgrade (you can change this)
    const emailToUpgrade = prompt('Enter the email address to upgrade to premium:');
    
    if (!emailToUpgrade) {
      console.log('❌ No email provided');
      return;
    }
    
    console.log('📧 Upgrading user:', emailToUpgrade);
    
    // Find the user's registration document
    const registrationsCollection = window.collection(window.db, 'registrations');
    const userQuery = window.query(registrationsCollection, window.where('email', '==', emailToUpgrade));
    
    console.log('🔍 Searching for user registration...');
    const userSnapshot = await window.getDocs(userQuery);
    
    if (userSnapshot.empty) {
      console.log('❌ User not found in registrations');
      console.log('💡 Make sure the user has completed registration');
      return;
    }
    
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ User found:', {
      id: userDoc.id,
      email: userData.email,
      name: userData.name,
      currentAccountType: userData.accountType
    });
    
    // Check if already premium
    if (userData.accountType === 'premium') {
      console.log('ℹ️ User is already premium');
      return;
    }
    
    // Update to premium
    console.log('🔄 Upgrading to premium...');
    
    const registrationRef = window.doc(window.db, 'registrations', userDoc.id);
    await window.updateDoc(registrationRef, {
      accountType: 'premium',
      premiumUpgradedAt: new Date(),
      premiumPlan: 'monthly', // Default to monthly, you can change this
      premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    console.log('✅ User upgraded to premium successfully!');
    console.log('📋 Updated fields:');
    console.log('• accountType: premium');
    console.log('• premiumUpgradedAt: ' + new Date().toISOString());
    console.log('• premiumPlan: monthly');
    console.log('• premiumExpiresAt: ' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    
    console.log('\n🎉 User can now:');
    console.log('• See unblurred contact details on all profiles');
    console.log('• Access premium features');
    console.log('• View "Your match profiles" (mutual likes)');
    console.log('• See "Premium" badge in navigation');
    
  } catch (error) {
    console.error('❌ Error upgrading user:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the upgrade
upgradeUserToPremium();
