// Fix Your Premium Status
console.log('👑 Fixing Your Premium Status...');

async function fixYourPremium() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.db || !window.collection || !window.getDocs || !window.updateDoc || !window.doc || !window.query || !window.where) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    console.log('✅ Firebase functions available');
    
    // Check if user is logged in
    if (!window.auth || !window.auth.currentUser) {
      console.log('❌ No user logged in');
      return;
    }
    
    const currentUserEmail = window.auth.currentUser.email;
    console.log('📧 Current user email:', currentUserEmail);
    
    // Find the registration document by email
    console.log('🔍 Finding registration document...');
    const registrationsCollection = window.collection(window.db, 'registrations');
    const registrationQuery = window.query(registrationsCollection, window.where('email', '==', currentUserEmail));
    const registrationSnapshot = await window.getDocs(registrationQuery);
    
    if (registrationSnapshot.empty) {
      console.log('❌ No registration found for this email');
      return;
    }
    
    const registrationDoc = registrationSnapshot.docs[0];
    const registrationData = registrationDoc.data();
    
    console.log('✅ Registration found:', {
      id: registrationDoc.id,
      email: registrationData.email,
      name: registrationData.name,
      currentPlan: registrationData.plan || 'free',
      userId: registrationData.userId
    });
    
    // Check if user already has premium
    if (registrationData.plan === 'premium') {
      console.log('ℹ️ User is already premium');
      console.log('🎉 You should now see:');
      console.log('• Unblurred contact details on all profiles');
      console.log('• No "Upgrade to Premium" messages');
      console.log('• Premium badge in navigation');
      console.log('• Access to premium matches');
      return;
    }
    
    // Update the registration to premium
    console.log('🔄 Updating plan to premium...');
    const registrationRef = window.doc(window.db, 'registrations', registrationDoc.id);
    await window.updateDoc(registrationRef, {
      plan: 'premium'
    });
    
    console.log('✅ User upgraded to premium successfully!');
    console.log('📋 Updated field: plan = premium');
    
    console.log('\n🎉 You can now:');
    console.log('• See unblurred contact details on all profiles');
    console.log('• No more "Upgrade to Premium" messages');
    console.log('• Access premium features');
    console.log('• View "Your match profiles" (mutual likes)');
    console.log('• See "Premium" badge in navigation');
    
    console.log('\n🔄 Please refresh the page to see the changes!');
    
  } catch (error) {
    console.error('❌ Error fixing premium status:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the fix
fixYourPremium();
