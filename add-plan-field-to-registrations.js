// Add Plan Field to Registrations
console.log('📝 Adding Plan Field to Registrations...');

async function addPlanFieldToRegistrations() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.db || !window.collection || !window.getDocs || !window.updateDoc || !window.doc || !window.query || !window.orderBy) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    console.log('✅ Firebase functions available');
    
    // Get all registrations
    const registrationsCollection = window.collection(window.db, 'registrations');
    const registrationsQuery = window.query(registrationsCollection, window.orderBy('createdAt', 'desc'));
    
    console.log('📥 Fetching all registrations...');
    const registrationsSnapshot = await window.getDocs(registrationsQuery);
    
    console.log('📊 Total registrations found:', registrationsSnapshot.size);
    
    if (registrationsSnapshot.empty) {
      console.log('❌ No registrations found');
      return;
    }
    
    // Update each registration to add plan field
    let updatedCount = 0;
    
    for (const doc of registrationsSnapshot.docs) {
      const data = doc.data();
      
      // Check if plan field already exists
      if (data.plan === undefined) {
        console.log(`🔄 Adding plan field to: ${data.email || 'Unknown'}`);
        
        const registrationRef = window.doc(window.db, 'registrations', doc.id);
        await window.updateDoc(registrationRef, {
          plan: 'free' // Set default to free
        });
        
        updatedCount++;
        console.log(`✅ Updated: ${data.email || 'Unknown'}`);
      } else {
        console.log(`ℹ️ Plan field already exists for: ${data.email || 'Unknown'} (${data.plan})`);
      }
    }
    
    console.log(`\n🎉 Process complete!`);
    console.log(`• Total registrations: ${registrationsSnapshot.size}`);
    console.log(`• Updated: ${updatedCount}`);
    console.log(`• Already had plan field: ${registrationsSnapshot.size - updatedCount}`);
    
    console.log('\n📋 Plan field values:');
    console.log('• "free" = Free user (default)');
    console.log('• "premium" = Premium user (after payment approval)');
    
  } catch (error) {
    console.error('❌ Error adding plan field:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the update
addPlanFieldToRegistrations();
