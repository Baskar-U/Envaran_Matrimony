// Test profiles after fixing registration status
console.log('🧪 Testing Profiles After Fix...');

async function testProfilesAfterFix() {
  try {
    console.log('👤 Current user...');
    
    if (window.auth && window.auth.currentUser) {
      console.log(`✅ Current user: ${window.auth.currentUser.uid}`);
      console.log(`📧 Email: ${window.auth.currentUser.email}`);
    } else {
      console.log('❌ No user logged in');
      return;
    }
    
    const excludeUserId = window.auth.currentUser.uid;
    console.log(`🚫 Excluding user: ${excludeUserId}`);
    
    // Get completed registrations (without limit to avoid the function issue)
    let q = window.query(
      window.collection(window.db, 'registrations'),
      window.where('status', '==', 'completed')
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
    
    if (profiles.length > 0) {
      console.log('🎉 SUCCESS! Profiles should now be visible on the /profiles page!');
    } else {
      console.log('❌ Still no profiles visible. Check if other registrations are completed.');
    }
    
  } catch (error) {
    console.error('❌ Error testing profiles:', error);
  }
}

testProfilesAfterFix();
