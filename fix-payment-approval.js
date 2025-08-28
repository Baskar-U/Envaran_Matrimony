// Fix Payment Approval Issue
console.log('🔧 Fixing Payment Approval Issue...');

async function fixPaymentApproval() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.db || !window.collection || !window.getDocs || !window.updateDoc || !window.doc || !window.query || !window.where) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    console.log('✅ Firebase functions available');
    
    // Get the email to fix
    const emailToFix = prompt('Enter the email address that needs premium upgrade:');
    
    if (!emailToFix) {
      console.log('❌ No email provided');
      return;
    }
    
    console.log('📧 Fixing premium upgrade for:', emailToFix);
    
    // Find the registration document by email
    console.log('🔍 Finding registration document...');
    const registrationsCollection = window.collection(window.db, 'registrations');
    const registrationQuery = window.query(registrationsCollection, window.where('email', '==', emailToFix));
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
    
    // Also check if there are any approved payments for this user
    console.log('\n🔍 Checking for approved payments...');
    const paymentsCollection = window.collection(window.db, 'payments');
    const paymentsQuery = window.query(paymentsCollection, window.where('userEmail', '==', emailToFix));
    const paymentsSnapshot = await window.getDocs(paymentsQuery);
    
    if (!paymentsSnapshot.empty) {
      console.log('📊 Found payments:', paymentsSnapshot.size);
      paymentsSnapshot.docs.forEach((doc, index) => {
        const payment = doc.data();
        console.log(`Payment ${index + 1}:`, {
          status: payment.status,
          plan: payment.plan,
          amount: payment.amount,
          userId: payment.userId
        });
      });
    }
    
    console.log('\n🎉 Premium upgrade complete!');
    console.log('📋 User can now:');
    console.log('• See unblurred contact details on all profiles');
    console.log('• Access premium features');
    console.log('• View "Your match profiles" (mutual likes)');
    console.log('• See "Premium" badge in navigation');
    
  } catch (error) {
    console.error('❌ Error fixing payment approval:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the fix
fixPaymentApproval();
