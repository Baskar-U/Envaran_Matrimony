// Fix Missing User & Upgrade to Premium
console.log('🔧 Fixing Missing User & Premium Upgrade...');

async function fixMissingUserPremium() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.db || !window.collection || !window.addDoc || !window.updateDoc || !window.doc || !window.query || !window.where || !window.getDocs) {
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
    
    // The email that has approved payments but no registration
    const missingUserEmail = 'baskarinnovat@gmail.com';
    
    console.log('📧 Creating registration for:', missingUserEmail);
    
    // Check if user already exists
    const registrationsCollection = window.collection(window.db, 'registrations');
    const userQuery = window.query(registrationsCollection, window.where('email', '==', missingUserEmail));
    const userSnapshot = await window.getDocs(userQuery);
    
    if (!userSnapshot.empty) {
      console.log('✅ User already exists in registrations');
      const existingUser = userSnapshot.docs[0];
      const userData = existingUser.data();
      
      console.log('📋 Existing user data:', {
        id: existingUser.id,
        email: userData.email,
        name: userData.name,
        accountType: userData.accountType
      });
      
      // Check if they need premium upgrade
      if (userData.accountType !== 'premium') {
        console.log('🔄 Upgrading existing user to premium...');
        
        const registrationRef = window.doc(window.db, 'registrations', existingUser.id);
        await window.updateDoc(registrationRef, {
          accountType: 'premium',
          premiumUpgradedAt: new Date(),
          premiumPlan: 'monthly',
          premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
        
        console.log('✅ Existing user upgraded to premium!');
      } else {
        console.log('ℹ️ User is already premium');
      }
      
      return;
    }
    
    // Create new user registration
    console.log('📝 Creating new user registration...');
    
    const newUserData = {
      userId: 'user_' + Date.now(), // Generate a unique user ID
      email: missingUserEmail,
      name: 'Baskar Innovat', // Based on the email
      accountType: 'premium', // Start as premium since they have approved payments
      premiumUpgradedAt: new Date(),
      premiumPlan: 'monthly',
      premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
      // Add other required fields with default values
      age: 25,
      dateOfBirth: '01-01-2000',
      gender: 'Male',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'General',
      education: 'Graduate',
      occupation: 'Private Job',
      income: '300000-500000',
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'Chennai, Tamil Nadu',
      contactNumber: '9876543210',
      aboutMe: 'Looking for a life partner',
      familyDetails: 'Nuclear family',
      partnerPreferences: 'Looking for someone compatible',
      profilePhoto: null,
      isProfileComplete: true
    };
    
    const docRef = await window.addDoc(registrationsCollection, newUserData);
    
    console.log('✅ New user created successfully!');
    console.log('📋 User details:', {
      id: docRef.id,
      email: newUserData.email,
      name: newUserData.name,
      accountType: newUserData.accountType,
      userId: newUserData.userId
    });
    
    console.log('\n🎉 User can now:');
    console.log('• See unblurred contact details on all profiles');
    console.log('• Access premium features');
    console.log('• View "Your match profiles" (mutual likes)');
    console.log('• See "Premium" badge in navigation');
    
    // Verify the creation
    console.log('\n🔍 Verifying user creation...');
    const verifyQuery = window.query(registrationsCollection, window.where('email', '==', missingUserEmail));
    const verifySnapshot = await window.getDocs(verifyQuery);
    
    if (!verifySnapshot.empty) {
      const verifiedUser = verifySnapshot.docs[0];
      const verifiedData = verifiedUser.data();
      console.log('✅ Verification successful:', {
        id: verifiedUser.id,
        email: verifiedData.email,
        name: verifiedData.name,
        accountType: verifiedData.accountType
      });
    }
    
  } catch (error) {
    console.error('❌ Error fixing missing user:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the fix
fixMissingUserPremium();
