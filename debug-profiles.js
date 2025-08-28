// Debug script to check why profiles aren't showing
console.log('🔍 Debugging Profiles Issue...');

// Check if Firebase is accessible
if (typeof window !== 'undefined' && window.db) {
  console.log('✅ Firebase database accessible');
} else {
  console.log('❌ Firebase database not accessible');
  console.log('💡 Make sure you\'re on the profiles page and Firebase is loaded');
}

// Function to check all registrations
async function checkAllRegistrations() {
  try {
    console.log('📊 Checking all registrations...');
    
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    
    // Get all registrations
    const registrationsQuery = query(collection(db, 'registrations'));
    const registrationsSnapshot = await getDocs(registrationsQuery);
    
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
    const completedQuery = query(
      collection(db, 'registrations'),
      where('status', '==', 'completed')
    );
    const completedSnapshot = await getDocs(completedQuery);
    
    console.log(`✅ Completed registrations: ${completedSnapshot.docs.length}`);
    
    completedSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`✅ Completed ${index + 1}: ${data.name} (${data.userId})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking registrations:', error);
  }
}

// Function to check current user
async function checkCurrentUser() {
  try {
    console.log('👤 Checking current user...');
    
    const { auth } = await import('@/lib/firebase');
    
    if (auth.currentUser) {
      console.log(`✅ Current user: ${auth.currentUser.uid}`);
      console.log(`📧 Email: ${auth.currentUser.email}`);
    } else {
      console.log('❌ No user logged in');
    }
  } catch (error) {
    console.error('❌ Error checking current user:', error);
  }
}

// Function to simulate the profiles fetch
async function simulateProfilesFetch() {
  try {
    console.log('🔄 Simulating profiles fetch...');
    
    const { collection, query, where, getDocs, orderBy, limit } = await import('firebase/firestore');
    const { db, auth } = await import('@/lib/firebase');
    
    if (!auth.currentUser) {
      console.log('❌ No user logged in');
      return;
    }
    
    const excludeUserId = auth.currentUser.uid;
    console.log(`🚫 Excluding user: ${excludeUserId}`);
    
    // Get completed registrations
    let q = query(
      collection(db, 'registrations'),
      where('status', '==', 'completed'),
      orderBy('submittedAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
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
    
  } catch (error) {
    console.error('❌ Error simulating profiles fetch:', error);
  }
}

// Run all checks
console.log('🚀 Starting comprehensive profile debug...');
checkCurrentUser().then(() => {
  checkAllRegistrations().then(() => {
    simulateProfilesFetch().then(() => {
      console.log('🎉 Debug completed! Check the output above for issues.');
    });
  });
});

// Export functions for manual testing
window.debugProfiles = {
  checkAllRegistrations,
  checkCurrentUser,
  simulateProfilesFetch
};
