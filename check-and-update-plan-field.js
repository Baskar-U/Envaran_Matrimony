// Check and Update Plan Field
console.log('🔍 Checking Plan Field Status...');

async function checkAndUpdatePlanField() {
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
    
    // Check each registration
    let hasPlanField = 0;
    let hasAccountTypeField = 0;
    let needsUpdate = 0;
    
    console.log('\n🔍 Checking each registration:');
    
    for (const doc of registrationsSnapshot.docs) {
      const data = doc.data();
      const email = data.email || 'Unknown';
      
      console.log(`\n📧 ${email}:`);
      console.log(`   • Has plan field: ${data.plan !== undefined ? 'Yes' : 'No'}`);
      console.log(`   • Has accountType field: ${data.accountType !== undefined ? 'Yes' : 'No'}`);
      
      if (data.plan !== undefined) {
        hasPlanField++;
        console.log(`   • Plan value: ${data.plan}`);
      }
      
      if (data.accountType !== undefined) {
        hasAccountTypeField++;
        console.log(`   • AccountType value: ${data.accountType}`);
      }
      
      // Check if needs update (has accountType but no plan)
      if (data.accountType !== undefined && data.plan === undefined) {
        needsUpdate++;
        console.log(`   ⚠️  Needs update: Copy accountType to plan`);
        
        // Update the document
        const registrationRef = window.doc(window.db, 'registrations', doc.id);
        await window.updateDoc(registrationRef, {
          plan: data.accountType // Copy accountType value to plan
        });
        
        console.log(`   ✅ Updated: plan = ${data.accountType}`);
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`• Total registrations: ${registrationsSnapshot.size}`);
    console.log(`• Has plan field: ${hasPlanField}`);
    console.log(`• Has accountType field: ${hasAccountTypeField}`);
    console.log(`• Updated: ${needsUpdate}`);
    
    console.log('\n🎉 Plan field check complete!');
    console.log('📋 Plan field values:');
    console.log('• "free" = Free user');
    console.log('• "premium" = Premium user');
    
  } catch (error) {
    console.error('❌ Error checking plan field:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the check
checkAndUpdatePlanField();
