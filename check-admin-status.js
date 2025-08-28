// Check Admin Status - Quick Debug
console.log('🔍 Checking Admin Status...');

function checkAdminStatus() {
  console.log('📋 Current User Information:');
  
  if (window.auth && window.auth.currentUser) {
    const user = window.auth.currentUser;
    console.log('✅ User is logged in');
    console.log('📧 Email:', user.email);
    console.log('🔐 UID:', user.uid);
    
    // Check if email is in admin list
    const adminEmails = [
      'admin@secondchancematrimony.com',
      'baskar@example.com', 
      'baskar@gmail.com'
    ];
    
    const isAdminEmail = adminEmails.some(email => 
      email.toLowerCase() === user.email?.toLowerCase()
    );
    
    console.log('🔐 Admin Email Check:', isAdminEmail ? 'YES' : 'NO');
    
    if (isAdminEmail) {
      console.log('🎯 You have admin email access!');
      console.log('📋 Next steps:');
      console.log('1. You should see "Payment Management" in your dropdown');
      console.log('2. Click it to access the payments page');
      console.log('3. Enter admin password: baskar123');
    } else {
      console.log('❌ Your email is not in the admin list');
      console.log('📝 To add admin access:');
      console.log('1. Edit client/src/hooks/useAdmin.ts');
      console.log('2. Add your email to ADMIN_CREDENTIALS array');
      console.log('3. Refresh the page');
    }
    
  } else {
    console.log('❌ No user logged in');
    console.log('📋 Please log in first');
  }
  
  console.log('\n🔧 Firebase Functions Available:');
  console.log('• window.auth:', !!window.auth);
  console.log('• window.createUserWithEmailAndPassword:', !!window.createUserWithEmailAndPassword);
  console.log('• window.signInWithEmailAndPassword:', !!window.signInWithEmailAndPassword);
  console.log('• window.addDoc:', !!window.addDoc);
  console.log('• window.collection:', !!window.collection);
  
  console.log('\n💡 Quick Fixes:');
  console.log('1. If you see "Payment Management" in dropdown - click it');
  console.log('2. If page loads slowly - wait for admin check to complete');
  console.log('3. If access denied - your email needs to be added to admin list');
}

// Run the check
checkAdminStatus();
