// Setup Admin System - Manage Admin Credentials
console.log('🔐 Setting up Admin System...');

// Current admin credentials (you can modify this list)
const ADMIN_CREDENTIALS = [
  {
    email: 'admin@secondchancematrimony.com',
    password: 'admin123' // Change this to a secure password
  },
  {
    email: 'baskar@example.com',
    password: 'baskar123' // Change this to a secure password
  },
  {
    email: 'baskar@gmail.com',
    password: 'baskar' // Replace with your actual password
  }
];

async function setupAdminSystem() {
  try {
    console.log('📋 Checking current user...');
    
    if (!window.auth || !window.auth.currentUser) {
      console.log('❌ No user logged in. Please log in first.');
      return;
    }
    
         const currentUserEmail = window.auth.currentUser.email;
     console.log(`✅ Current user: ${currentUserEmail}`);
     
     // Check if current user is admin
     const adminCredential = ADMIN_CREDENTIALS.find(cred => 
       cred.email.toLowerCase() === currentUserEmail.toLowerCase()
     );
     const isCurrentUserAdmin = !!adminCredential;
     console.log(`🔐 Admin status: ${isCurrentUserAdmin ? 'ADMIN EMAIL' : 'NOT ADMIN'}`);
    
         // Display admin system information
     console.log('\n📋 Admin System Information:');
     console.log('┌─────────────────────────────────────────────────────────────┐');
     console.log('│ ADMIN CREDENTIALS                                          │');
     console.log('├─────────────────────────────────────────────────────────────┤');
     ADMIN_CREDENTIALS.forEach((cred, index) => {
       const isCurrent = cred.email.toLowerCase() === currentUserEmail.toLowerCase();
       console.log(`│ ${index + 1}. ${cred.email}${isCurrent ? ' (CURRENT USER)' : ''}`);
       console.log(`│    Password: ${cred.password}`);
     });
     console.log('└─────────────────────────────────────────────────────────────┘');
    
         // Display admin features
     console.log('\n🔐 Admin Features:');
     console.log('┌─────────────────────────────────────────────────────────────┐');
     console.log('│ • Password-protected admin access                          │');
     console.log('│ • Access Payment Management page (/payments)               │');
     console.log('│ • View all payment submissions                             │');
     console.log('│ • Approve/Deny payment requests                            │');
     console.log('│ • Upgrade users to premium status                          │');
     console.log('│ • View payment screenshots                                 │');
     console.log('└─────────────────────────────────────────────────────────────┘');
    
    // Test admin access
    console.log('\n🧪 Testing admin access...');
    
         if (isCurrentUserAdmin) {
       console.log('✅ You have admin email access!');
       console.log('📋 You can:');
       console.log('   • See "Payment Management" in your dropdown menu');
       console.log('   • Enter admin password to access payment management');
       console.log('   • Approve payments to upgrade users to premium');
       console.log(`🔐 Your admin password: ${adminCredential.password}`);
      
      // Test payment management access
      console.log('\n🔍 Testing payment management access...');
      try {
        const paymentsCollection = window.collection(window.db, 'payments');
        const testQuery = window.query(paymentsCollection, window.limit(1));
        await window.getDocs(testQuery);
        console.log('✅ Payment management access confirmed');
      } catch (error) {
        console.log('❌ Payment management access failed:', error.message);
      }
      
         } else {
       console.log('❌ You do not have admin access');
       console.log('📋 To get admin access:');
       console.log('   1. Add your email and password to ADMIN_CREDENTIALS in useAdmin.ts');
       console.log('   2. Refresh the page');
       console.log('   3. You will see "Payment Management" in your dropdown');
       
       // Show how to add admin access
       console.log('\n📝 To add admin access for your email:');
       console.log('1. Open: client/src/hooks/useAdmin.ts');
       console.log('2. Add your credentials to ADMIN_CREDENTIALS array:');
       console.log(`   {
     email: '${currentUserEmail}',
     password: 'your_secure_password_here'
   }`);
       console.log('3. Save the file and refresh the page');
     }
    
         // Display current admin setup
     console.log('\n📊 Current Admin Setup:');
     console.log(`• Total admin accounts: ${ADMIN_CREDENTIALS.length}`);
     console.log(`• Current user email: ${currentUserEmail}`);
     console.log(`• Current user is admin: ${isCurrentUserAdmin}`);
    
         // Instructions for adding new admins
     console.log('\n📝 How to add new admin users:');
     console.log('1. Edit the ADMIN_CREDENTIALS array in client/src/hooks/useAdmin.ts');
     console.log('2. Add the new admin email and password to the array');
     console.log('3. Save the file');
     console.log('4. The new admin will see "Payment Management" in their dropdown');
     console.log('5. They need to enter the admin password to access /payments');
    
  } catch (error) {
    console.error('❌ Error setting up admin system:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('• Make sure you are logged in');
    console.log('• Check that useAdmin.ts file exists');
    console.log('• Verify your email is in the ADMIN_EMAILS array');
  }
}

// Run the setup
setupAdminSystem();
