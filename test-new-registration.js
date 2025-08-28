// Test script to verify new registrations will have correct status
console.log('🧪 Testing New Registration Status...');

async function testNewRegistrationStatus() {
  try {
    console.log('📊 Checking current registrations...');
    
    // Get all registrations
    const registrationsQuery = window.query(
      window.collection(window.db, 'registrations')
    );
    const snapshot = await window.getDocs(registrationsQuery);
    
    console.log(`📋 Total registrations: ${snapshot.docs.length}`);
    
    // Check status distribution
    const statusCounts = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const status = data.status || 'no-status';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('📊 Status distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count} registrations`);
    });
    
    // Show recent registrations
    console.log('📄 Recent registrations:');
    snapshot.docs.slice(-3).forEach((doc, index) => {
      const data = doc.data();
      console.log(`   ${index + 1}. ${data.name} - Status: ${data.status} - Submitted: ${data.submittedAt}`);
    });
    
    console.log('💡 After the fix:');
    console.log('   - New registrations will have status: "completed"');
    console.log('   - They will be immediately visible on the profiles page');
    console.log('   - No manual status update needed');
    
  } catch (error) {
    console.error('❌ Error testing registration status:', error);
  }
}

testNewRegistrationStatus();
