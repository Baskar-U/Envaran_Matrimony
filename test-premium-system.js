// Test script for Premium System
console.log('🧪 Testing Premium System...');

async function testPremiumSystem() {
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
    
    // Get user's registration data
    console.log('📊 Checking user registration data...');
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
      console.log(`   - Premium Expires: ${registrationData.premiumExpiresAt || 'N/A'}`);
      
      if (registrationData.accountType === 'premium') {
        console.log('🎉 User is PREMIUM!');
        console.log('✅ Can view contact details');
        console.log('✅ Can access mutual matches');
        console.log('✅ Has all premium features');
      } else {
        console.log('📝 User is FREE');
        console.log('❌ Contact details are blurred');
        console.log('❌ Mutual matches are restricted');
        console.log('💡 Should see upgrade prompts');
      }
    } else {
      console.log('❌ No registration data found');
    }
    
    // Test premium upgrade function
    console.log('🔧 Testing premium upgrade...');
    console.log('💡 To upgrade to premium:');
    console.log('   1. Go to /premium page');
    console.log('   2. Select monthly (₹299) or yearly (₹2999) plan');
    console.log('   3. Click "Upgrade Now"');
    console.log('   4. Complete payment (QR code)');
    console.log('   5. Account will be upgraded to premium');
    
  } catch (error) {
    console.error('❌ Error testing premium system:', error);
  }
}

testPremiumSystem();
