// Simple debug script using globally exposed Firebase functions
console.log('🔍 Simple Profile Debug...');

// Check if Firebase functions are available globally
if (typeof window !== 'undefined' && window.db) {
  console.log('✅ Firebase database accessible via window.db');
} else {
  console.log('❌ Firebase database not accessible');
  console.log('💡 Make sure you\'re on the profiles page and Firebase is loaded');
}

// Function to check all registrations
async function checkAllRegistrations() {
  try {
    console.log('📊 Checking all registrations...');
    
    // Use globally exposed functions
    const registrationsQuery = window.query(
      window.collection(window.db, 'registrations')
    );
    const registrationsSnapshot = await window.getDocs(registrationsQuery);
    
    console.log(`📋 Total registrations found: ${registrationsSnapshot.docs.length}`);
    
    registrationsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`📄 Registration ${index + 1}:`);
      console.log(`   - ID: ${doc.id}`);
      console.log(`   - User ID: ${data.userId}`);
      console.log(`   - Name: ${data.name}`);
      console.log(`   - Status: ${data.status}`);
      console.log(`   - Submitted: ${data.submittedAt}`);
      console.log('   ---');
    });
    
    // Check completed registrations only
    console.log('🔍 Checking completed registrations only...');
    const completedQuery = window.query(
      window.collection(window.db, 'registrations'),
      window.where('status', '==', 'completed')
    );
    const completedSnapshot = await window.getDocs(completedQuery);
    
    console.log(`✅ Completed registrations: ${completedSnapshot.docs.length}`);
    
    completedSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`✅ Completed ${index + 1}: ${data.name} (${data.userId})`);
    });
    
    return { allRegistrations: registrationsSnapshot.docs, completedRegistrations: completedSnapshot.docs };
    
  } catch (error) {
    console.error('❌ Error checking registrations:', error);
    return { allRegistrations: [], completedRegistrations: [] };
  }
}

// Function to check current user
async function checkCurrentUser() {
  try {
    console.log('👤 Checking current user...');
    
    if (window.auth && window.auth.currentUser) {
      console.log(`✅ Current user: ${window.auth.currentUser.uid}`);
      console.log(`📧 Email: ${window.auth.currentUser.email}`);
      return window.auth.currentUser;
    } else {
      console.log('❌ No user logged in');
      return null;
    }
  } catch (error) {
    console.error('❌ Error checking current user:', error);
    return null;
  }
}

// Function to simulate the profiles fetch
async function simulateProfilesFetch() {
  try {
    console.log('🔄 Simulating profiles fetch...');
    
    const currentUser = await checkCurrentUser();
    if (!currentUser) {
      console.log('❌ No user logged in');
      return [];
    }
    
    const excludeUserId = currentUser.uid;
    console.log(`🚫 Excluding user: ${excludeUserId}`);
    
    // Get completed registrations
    let q = window.query(
      window.collection(window.db, 'registrations'),
      window.where('status', '==', 'completed'),
      window.orderBy('submittedAt', 'desc'),
      window.limit(50)
    );
    
    const querySnapshot = await window.getDocs(q);
    console.log(`📊 Total completed registrations: ${querySnapshot.docs.length}`);
    
    const profiles = [];
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      
      if (data.userId === excludeUserId) {
        console.log(`⏭️ Skipping excluded user: ${data.userId} (${data.name})`);
        continue;
      }
      
      console.log(`✅ Adding profile: ${data.name} (${data.userId})`);
      profiles.push({
        id: data.userId,
        userId: data.userId,
        name: data.name,
        location: data.presentAddress || 'Not specified'
      });
    }
    
    console.log(`🎯 Final profiles count: ${profiles.length}`);
    console.log('📋 Profiles that should be visible:');
    profiles.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.name} - ${profile.location}`);
    });
    
    return profiles;
    
  } catch (error) {
    console.error('❌ Error simulating profiles fetch:', error);
    return [];
  }
}

// Main function to run all checks
async function runDebug() {
  console.log('🚀 Starting simple profile debug...');
  
  const user = await checkCurrentUser();
  if (user) {
    const result = await checkAllRegistrations();
    const profiles = await simulateProfilesFetch();
    
    console.log('🎉 Simple debug completed!');
    console.log('📊 Summary:');
    console.log(`   - Current user: ${user.email}`);
    console.log(`   - Total registrations: ${result.allRegistrations.length}`);
    console.log(`   - Completed registrations: ${result.completedRegistrations.length}`);
    console.log(`   - Visible profiles: ${profiles.length}`);
    
    if (profiles.length === 0) {
      console.log('💡 No profiles visible. Possible issues:');
      console.log('   1. Only one registration exists (current user)');
      console.log('   2. Other registrations are not "completed"');
      console.log('   3. Firebase security rules blocking access');
    }
  } else {
    console.log('❌ Cannot proceed without logged-in user');
  }
}

// Run the debug
runDebug();

// Export functions for manual testing
window.simpleDebugProfiles = {
  checkAllRegistrations,
  checkCurrentUser,
  simulateProfilesFetch,
  runDebug
};
