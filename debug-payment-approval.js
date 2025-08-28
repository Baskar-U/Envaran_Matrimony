// Debug Payment Approval Process
console.log('🔍 Debugging Payment Approval Process...');

async function debugPaymentApproval() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.db || !window.collection || !window.getDocs || !window.query || !window.orderBy || !window.where) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    console.log('✅ Firebase functions available');
    
    // Get the email to check
    const emailToCheck = prompt('Enter the email address that made the payment:');
    
    if (!emailToCheck) {
      console.log('❌ No email provided');
      return;
    }
    
    console.log('📧 Checking payments and registration for:', emailToCheck);
    
    // Check payments for this email
    console.log('\n🔍 Checking Payments...');
    const paymentsCollection = window.collection(window.db, 'payments');
    const paymentsQuery = window.query(paymentsCollection, window.where('userEmail', '==', emailToCheck));
    const paymentsSnapshot = await window.getDocs(paymentsQuery);
    
    console.log('📊 Payments found:', paymentsSnapshot.size);
    
    if (!paymentsSnapshot.empty) {
      paymentsSnapshot.docs.forEach((doc, index) => {
        const payment = doc.data();
        console.log(`\n--- Payment ${index + 1} ---`);
        console.log('• Payment ID:', doc.id);
        console.log('• User Email:', payment.userEmail);
        console.log('• User Name:', payment.userName);
        console.log('• User ID:', payment.userId);
        console.log('• Plan:', payment.plan);
        console.log('• Amount:', payment.amount);
        console.log('• Status:', payment.status);
        console.log('• Submitted:', payment.submittedAt?.toDate ? payment.submittedAt.toDate().toLocaleDateString() : 'N/A');
        console.log('• Reviewed:', payment.reviewedAt ? (payment.reviewedAt.toDate ? payment.reviewedAt.toDate().toLocaleDateString() : 'N/A') : 'Pending');
        console.log('• Reviewed By:', payment.reviewedBy || 'Not reviewed');
      });
    } else {
      console.log('❌ No payments found for this email');
    }
    
    // Check registration for this email
    console.log('\n🔍 Checking Registration...');
    const registrationsCollection = window.collection(window.db, 'registrations');
    const registrationQuery = window.query(registrationsCollection, window.where('email', '==', emailToCheck));
    const registrationSnapshot = await window.getDocs(registrationQuery);
    
    console.log('📊 Registrations found:', registrationSnapshot.size);
    
    if (!registrationSnapshot.empty) {
      const registration = registrationSnapshot.docs[0];
      const regData = registration.data();
      
      console.log('\n--- Registration Details ---');
      console.log('• Registration ID:', registration.id);
      console.log('• Email:', regData.email);
      console.log('• Name:', regData.name);
      console.log('• User ID:', regData.userId);
      console.log('• Plan:', regData.plan || 'Not set');
      console.log('• Account Type:', regData.accountType || 'Not set');
      console.log('• Created At:', regData.createdAt?.toDate ? regData.createdAt.toDate().toLocaleDateString() : 'N/A');
      
      // Check if there's a mismatch
      const approvedPayments = paymentsSnapshot.docs.filter(doc => doc.data().status === 'approved');
      if (approvedPayments.length > 0 && regData.plan !== 'premium') {
        console.log('\n⚠️  ISSUE DETECTED:');
        console.log('• User has approved payments but plan is not premium');
        console.log('• Current plan:', regData.plan);
        console.log('• Expected plan: premium');
        
        // Try to fix it
        console.log('\n🔧 Attempting to fix...');
        const registrationRef = window.doc(window.db, 'registrations', registration.id);
        await window.updateDoc(registrationRef, {
          plan: 'premium'
        });
        console.log('✅ Plan updated to premium!');
        
      } else if (approvedPayments.length > 0 && regData.plan === 'premium') {
        console.log('\n✅ Everything looks correct:');
        console.log('• User has approved payments');
        console.log('• Plan is set to premium');
      } else if (approvedPayments.length === 0) {
        console.log('\nℹ️  No approved payments found');
      }
      
    } else {
      console.log('❌ No registration found for this email');
    }
    
    // Check if user ID matches between payment and registration
    if (!paymentsSnapshot.empty && !registrationSnapshot.empty) {
      const payment = paymentsSnapshot.docs[0].data();
      const registration = registrationSnapshot.docs[0].data();
      
      console.log('\n🔍 Checking User ID Match...');
      console.log('• Payment User ID:', payment.userId);
      console.log('• Registration User ID:', registration.userId);
      
      if (payment.userId !== registration.userId) {
        console.log('⚠️  USER ID MISMATCH!');
        console.log('This could be causing the approval to fail.');
        console.log('The payment approval tries to update the registration using payment.userId');
        console.log('But if the IDs don\'t match, the update fails silently.');
      } else {
        console.log('✅ User IDs match correctly');
      }
    }
    
  } catch (error) {
    console.error('❌ Error debugging payment approval:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the debug
debugPaymentApproval();
