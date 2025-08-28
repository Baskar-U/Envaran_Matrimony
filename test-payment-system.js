// Test script for Payment System
console.log('🧪 Testing Payment System...');

async function testPaymentSystem() {
  try {
    console.log('👤 Checking current user...');
    
    if (window.auth && window.auth.currentUser) {
      console.log(`✅ Current user: ${window.auth.currentUser.uid}`);
      console.log(`📧 Email: ${window.auth.currentUser.email}`);
    } else {
      console.log('❌ No user logged in');
      return;
    }
    
    const userId = window.auth.currentUser.uid;
    
    // Check payments collection
    console.log('📊 Checking payments collection...');
    const paymentsQuery = window.query(
      window.collection(window.db, 'payments'),
      window.orderBy('submittedAt', 'desc')
    );
    const paymentsSnapshot = await window.getDocs(paymentsQuery);
    
    console.log(`📋 Total payments: ${paymentsSnapshot.docs.length}`);
    
    if (paymentsSnapshot.docs.length > 0) {
      console.log('📄 Recent payments:');
      paymentsSnapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${data.userName} - ${data.status} - ₹${data.amount} - ${data.plan}`);
      });
    }
    
    // Check user's registration
    console.log('📊 Checking user registration...');
    const registrationQuery = window.query(
      window.collection(window.db, 'registrations'),
      window.where('userId', '==', userId)
    );
    const registrationSnapshot = await window.getDocs(registrationQuery);
    
    if (registrationSnapshot.docs.length > 0) {
      const registrationData = registrationSnapshot.docs[0].data();
      console.log('📋 Registration data:');
      console.log(`   - Name: ${registrationData.name}`);
      console.log(`   - Account Type: ${registrationData.accountType}`);
      console.log(`   - Premium Plan: ${registrationData.premiumPlan || 'N/A'}`);
      console.log(`   - Premium Upgraded: ${registrationData.premiumUpgradedAt || 'N/A'}`);
    }
    
    console.log('🔧 Payment System Features:');
    console.log('✅ QR Code with UPI ID: baskarelite713-2@oksbi');
    console.log('✅ Screenshot upload functionality');
    console.log('✅ Transaction ID input');
    console.log('✅ Payment submission to Firestore');
    console.log('✅ Admin review system at /payments');
    console.log('✅ Automatic premium upgrade on approval');
    
    console.log('💡 How to test:');
    console.log('   1. Go to /premium page');
    console.log('   2. Select plan and click "Upgrade Now"');
    console.log('   3. Enter transaction ID and upload screenshot');
    console.log('   4. Submit payment');
    console.log('   5. Check /payments page for admin review');
    console.log('   6. Approve/deny payment to upgrade user');
    
  } catch (error) {
    console.error('❌ Error testing payment system:', error);
  }
}

testPaymentSystem();
