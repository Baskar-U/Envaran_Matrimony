// Simple fix for registration status
console.log('🔧 Fixing Registration Status...');

async function fixRegistrationStatus() {
  try {
    console.log('📊 Checking registrations...');
    
    // Get all registrations
    const registrationsQuery = window.query(
      window.collection(window.db, 'registrations')
    );
    const snapshot = await window.getDocs(registrationsQuery);
    
    console.log(`📊 Found ${snapshot.docs.length} registrations`);
    
    let updatedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      if (data.status !== 'completed') {
        console.log(`🔧 Updating ${data.name} from "${data.status}" to "completed"`);
        
        const registrationRef = window.doc(window.db, 'registrations', docSnapshot.id);
        await window.updateDoc(registrationRef, {
          status: 'completed',
          updatedAt: new Date()
        });
        
        updatedCount++;
      } else {
        console.log(`✅ ${data.name} already has status "completed"`);
      }
    }
    
    console.log(`🎉 Updated ${updatedCount} registrations to completed status`);
    console.log('🔄 Now refresh the profiles page to see the changes!');
    
  } catch (error) {
    console.error('❌ Error fixing registration status:', error);
  }
}

fixRegistrationStatus();
