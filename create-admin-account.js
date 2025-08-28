// Create Admin Account - Firebase Authentication
console.log('🔐 Creating Admin Account...');

async function createAdminAccount() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    // Check if Firebase functions are available
    if (!window.auth || !window.createUserWithEmailAndPassword || !window.signInWithEmailAndPassword) {
      console.log('❌ Firebase functions not available on window object');
      console.log('📋 Available Firebase functions:');
      console.log('• window.auth:', !!window.auth);
      console.log('• window.createUserWithEmailAndPassword:', !!window.createUserWithEmailAndPassword);
      console.log('• window.signInWithEmailAndPassword:', !!window.signInWithEmailAndPassword);
      console.log('• window.addDoc:', !!window.addDoc);
      console.log('• window.collection:', !!window.collection);
      
      console.log('\n💡 Try using the registration form instead:');
      console.log('1. Go to /registration in your app');
      console.log('2. Fill out the form with:');
      console.log('   - Email: baskar@gmail.com');
      console.log('   - Password: baskar123');
      console.log('   - Complete all other fields');
      console.log('3. Submit to create the account');
      console.log('4. Then log in with those credentials');
      
      return;
    }
    
    console.log('📋 Checking if user is already logged in...');
    
    if (window.auth && window.auth.currentUser) {
      console.log('✅ User is already logged in:', window.auth.currentUser.email);
      console.log('🔐 Current user UID:', window.auth.currentUser.uid);
      return;
    }
    
    console.log('📝 Creating admin account...');
    
    // Admin credentials
    const adminEmail = 'baskar@gmail.com';
    const adminPassword = 'baskar123'; // Use a stronger password
    
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    
    // Create the account
    try {
      const userCredential = await window.createUserWithEmailAndPassword(window.auth, adminEmail, adminPassword);
      console.log('✅ Admin account created successfully!');
      console.log('🔐 User UID:', userCredential.user.uid);
      console.log('📧 User Email:', userCredential.user.email);
      
      // Create registration data
      console.log('📝 Creating registration data...');
      
      const registrationData = {
        userId: userCredential.user.uid,
        email: adminEmail,
        name: 'Baskar Admin',
        accountType: 'free', // Will be upgraded to premium by admin
        status: 'completed',
        createdAt: new Date(),
        // Add other required fields
        age: 30,
        dateOfBirth: '01-01-1994',
        gender: 'Male',
        religion: 'Hindu',
        caste: 'General',
        education: 'Graduate',
        occupation: 'Professional',
        income: '50000-100000',
        city: 'Chennai',
        state: 'Tamil Nadu',
        address: 'Chennai, Tamil Nadu',
        phone: '9876543210',
        maritalStatus: 'Never Married',
        height: '5\'8"',
        complexion: 'Fair',
        motherTongue: 'Tamil',
        familyType: 'Nuclear',
        familyStatus: 'Middle Class',
        familyIncome: '50000-100000',
        familyLocation: 'Chennai',
        aboutMe: 'Admin account for Second Chance Matrimony',
        partnerPreferences: 'Looking for a compatible partner',
        hobbies: 'Reading, Traveling',
        lifestyle: 'Moderate',
        diet: 'Non-Vegetarian',
        smoking: 'No',
        drinking: 'Occasionally',
        profileImageUrl: null
      };
      
      // Save to registrations collection
      await window.addDoc(window.collection(window.db, 'registrations'), registrationData);
      console.log('✅ Registration data created successfully!');
      
      console.log('\n🎉 Admin account setup complete!');
      console.log('📋 You can now:');
      console.log('   1. Log in with the credentials above');
      console.log('   2. Access admin features');
      console.log('   3. Manage payments');
      
    } catch (createError) {
      if (createError.code === 'auth/email-already-in-use') {
        console.log('ℹ️ Account already exists. Trying to sign in...');
        
        try {
          const signInResult = await window.signInWithEmailAndPassword(window.auth, adminEmail, adminPassword);
          console.log('✅ Successfully signed in to existing account!');
          console.log('🔐 User UID:', signInResult.user.uid);
          console.log('📧 User Email:', signInResult.user.email);
        } catch (signInError) {
          console.log('❌ Sign in failed:', signInError.message);
          console.log('💡 The password might be different. Try:');
          console.log('   1. Reset password in Firebase Console');
          console.log('   2. Or use a different password');
        }
      } else {
        console.log('❌ Account creation failed:', createError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('• Make sure Firebase is properly initialized');
    console.log('• Check if you have permission to create accounts');
    console.log('• Try using a different email/password');
  }
}

// Run the setup
createAdminAccount();
