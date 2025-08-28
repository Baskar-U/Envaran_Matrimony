// Upgrade User Plan to Premium
console.log('👑 Upgrading User Plan to Premium...');

async function upgradeUserPlan() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.db || !window.collection || !window.updateDoc || !window.doc || !window.query || !window.where || !window.getDocs) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    console.log('✅ Firebase functions available');
    
    // Get the email to upgrade
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
      return;
    }
    
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ User found:', {
      id: userDoc.id,
      email: userData.email,
      name: userData.name,
      currentPlan: userData.plan || 'free'
    });
    
    // Check if already premium
    if (userData.plan === 'premium') {
      console.log('ℹ️ User is already premium');
      return;
    }
    
    // Update to premium
    console.log('🔄 Upgrading to premium...');
    
    const registrationRef = window.doc(window.db, 'registrations', userDoc.id);
    await window.updateDoc(registrationRef, {
      plan: 'premium'
    });
    
    console.log('✅ User upgraded to premium successfully!');
    console.log('📋 Updated field: plan = premium');
    
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
upgradeUserPlan();
