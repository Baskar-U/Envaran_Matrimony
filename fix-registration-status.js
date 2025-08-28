// Fix registration status to 'completed'
console.log('🔧 Fixing Registration Status...');

async function fixRegistrationStatus() {
  try {
    const { collection, query, getDocs, doc, updateDoc } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    
    // Get all registrations
    const registrationsQuery = query(collection(db, 'registrations'));
    const snapshot = await getDocs(registrationsQuery);
    
    console.log(`📊 Found ${snapshot.docs.length} registrations`);
    
    let updatedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      if (data.status !== 'completed') {
        console.log(`🔧 Updating ${data.name} from "${data.status}" to "completed"`);
        
        const registrationRef = doc(db, 'registrations', docSnapshot.id);
        await updateDoc(registrationRef, {
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
