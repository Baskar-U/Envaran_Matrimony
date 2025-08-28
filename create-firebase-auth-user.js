// Create Firebase Auth User for Missing User
console.log('🔐 Creating Firebase Auth User...');

async function createFirebaseAuthUser() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.auth || !window.createUserWithEmailAndPassword) {
      console.log('❌ Firebase Auth functions not available');
      return;
    }
    
    console.log('✅ Firebase Auth functions available');
    
    // User details
    const userEmail = 'baskarinnovat@gmail.com';
    const userPassword = 'baskar123'; // You can change this password
    
    console.log('📧 Creating Firebase Auth user:', userEmail);
    
    try {
      // Create the Firebase Auth user
      const userCredential = await window.createUserWithEmailAndPassword(
        window.auth, 
        userEmail, 
        userPassword
      );
      
      const user = userCredential.user;
      
      console.log('✅ Firebase Auth user created successfully!');
      console.log('📋 User details:', {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified
      });
      
      console.log('\n🔑 Login Credentials:');
      console.log('• Email:', userEmail);
      console.log('• Password:', userPassword);
      
      console.log('\n🎉 User can now:');
      console.log('• Log in to the application');
      console.log('• Access their premium features');
      console.log('• See unblurred contact details');
      console.log('• View premium matches');
      
    } catch (authError) {
      if (authError.code === 'auth/email-already-in-use') {
        console.log('ℹ️ Firebase Auth user already exists');
        console.log('💡 User can log in with existing credentials');
      } else {
        console.error('❌ Error creating Firebase Auth user:', authError);
        console.log('💡 Error details:', authError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error in createFirebaseAuthUser:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the creation
createFirebaseAuthUser();
