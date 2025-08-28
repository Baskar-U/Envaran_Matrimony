// Test script to verify registration form functionality
// Run this in the browser console after navigating to /registration

console.log('🧪 Testing Registration Form...');

// Check if we're on the registration page
if (!window.location.pathname.includes('/registration')) {
  console.log('❌ Please navigate to /registration first');
} else {
  console.log('✅ On registration page');
}

// Check if Firebase is available
if (typeof window.db !== 'undefined') {
  console.log('✅ Firebase is available');
} else {
  console.log('❌ Firebase not available - check main.tsx');
}

// Check if user is authenticated
if (typeof window.auth !== 'undefined' && window.auth.currentUser) {
  console.log('✅ User is authenticated:', window.auth.currentUser.email);
} else {
  console.log('❌ User not authenticated - please log in first');
}

// Test form submission (this will be triggered by the actual form)
console.log('📝 To test the form:');
console.log('1. Fill out the required fields (marked with *)');
console.log('2. Click "Next" to go through all 6 steps');
console.log('3. Click "Submit Registration" on the final step');
console.log('4. Check Firebase Console → Firestore → registrations collection');
console.log('5. You should see a new document with your data');

// Helper function to check if registration was successful
window.checkRegistration = async () => {
  try {
    const registrationsRef = window.collection(window.db, 'registrations');
    const q = window.query(registrationsRef, window.where('userId', '==', window.auth.currentUser?.uid));
    const querySnapshot = await window.getDocs(q);
    
    console.log('📊 Found registrations:', querySnapshot.size);
    querySnapshot.forEach((doc) => {
      console.log('📄 Registration ID:', doc.id);
      console.log('📄 Registration Data:', doc.data());
    });
    
    return querySnapshot.size > 0;
  } catch (error) {
    console.error('❌ Error checking registrations:', error);
    return false;
  }
};

console.log('🔍 Run checkRegistration() to see your submitted registrations');

