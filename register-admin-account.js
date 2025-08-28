// Register Admin Account - Alternative Method
console.log('🔐 Admin Account Registration Guide...');

function registerAdminAccount() {
  console.log('📋 Since Firebase Auth functions are not available in console,');
  console.log('📋 we\'ll use the registration form to create the admin account.');
  
  console.log('\n📝 Step-by-Step Instructions:');
  console.log('1. 📱 Go to your app\'s registration page (/registration)');
  console.log('2. 📧 Fill out the registration form with these details:');
  console.log('   • Email: baskar@gmail.com');
  console.log('   • Password: baskar123');
  console.log('   • Name: Baskar Admin');
  console.log('   • Age: 30');
  console.log('   • Date of Birth: 01-01-1994');
  console.log('   • Gender: Male');
  console.log('   • Religion: Hindu');
  console.log('   • Caste: General');
  console.log('   • Education: Graduate');
  console.log('   • Occupation: Professional');
  console.log('   • Income: 50000-100000');
  console.log('   • City: Chennai');
  console.log('   • State: Tamil Nadu');
  console.log('   • Address: Chennai, Tamil Nadu');
  console.log('   • Phone: 9876543210');
  console.log('   • Marital Status: Never Married');
  console.log('   • Height: 5\'8"');
  console.log('   • Complexion: Fair');
  console.log('   • Mother Tongue: Tamil');
  console.log('   • Family Type: Nuclear');
  console.log('   • Family Status: Middle Class');
  console.log('   • Family Income: 50000-100000');
  console.log('   • Family Location: Chennai');
  console.log('   • About Me: Admin account for Second Chance Matrimony');
  console.log('   • Partner Preferences: Looking for a compatible partner');
  console.log('   • Hobbies: Reading, Traveling');
  console.log('   • Lifestyle: Moderate');
  console.log('   • Diet: Non-Vegetarian');
  console.log('   • Smoking: No');
  console.log('   • Drinking: Occasionally');
  console.log('   • Account Type: Free (will be upgraded to premium)');
  
  console.log('\n3. ✅ Submit the registration form');
  console.log('4. 🔐 Log in with the credentials above');
  console.log('5. 🔑 Access admin features (Payment Management)');
  
  console.log('\n🎯 After registration, you can:');
  console.log('• Log in with baskar@gmail.com / baskar123');
  console.log('• See "Payment Management" in your dropdown');
  console.log('• Enter admin password: baskar123');
  console.log('• Access payment management features');
  
  console.log('\n💡 Alternative: Use the updated console script');
  console.log('• Refresh the page to load updated Firebase functions');
  console.log('• Run the create-admin-account.js script again');
  
  // Check if we can navigate to registration
  if (typeof window !== 'undefined' && window.location) {
    console.log('\n🚀 Quick Navigation:');
    console.log('• Current URL:', window.location.href);
    console.log('• Registration URL:', window.location.origin + '/registration');
    console.log('• You can manually navigate to /registration');
  }
}

// Run the guide
registerAdminAccount();
