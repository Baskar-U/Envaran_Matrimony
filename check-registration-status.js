// Quick check for registration status
console.log('🔍 Checking Registration Status...');

async function checkRegistrationStatus() {
  try {
    const { collection, query, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    
    // Get all registrations
    const registrationsQuery = query(collection(db, 'registrations'));
    const snapshot = await getDocs(registrationsQuery);
    
    console.log(`📊 Total registrations: ${snapshot.docs.length}`);
    
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`📄 Registration ${index + 1}:`);
      console.log(`   - Name: ${data.name}`);
      console.log(`   - User ID: ${data.userId}`);
      console.log(`   - Status: ${data.status}`);
      console.log(`   - Email: ${data.email || 'Not in registration data'}`);
      console.log('   ---');
    });
    
    // Check if any registrations are not 'completed'
    const incompleteRegistrations = snapshot.docs.filter(doc => doc.data().status !== 'completed');
    
    if (incompleteRegistrations.length > 0) {
      console.log('⚠️ Found registrations that are not completed:');
      incompleteRegistrations.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.name}: ${data.status}`);
      });
      console.log('💡 These profiles won\'t show up until status is "completed"');
    } else {
      console.log('✅ All registrations are completed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkRegistrationStatus();
