// Test script to check profile images in registrations collection
// Run this in browser console

async function testProfileImages() {
  console.log('🔍 Testing profile images...');
  
  try {
    // Get all registrations
    const registrationsRef = window.collection(window.db, 'registrations');
    const snapshot = await window.getDocs(registrationsRef);
    
    console.log(`📊 Found ${snapshot.docs.length} registration documents`);
    
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n📄 Document ${index + 1}:`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Name: ${data.name || 'N/A'}`);
      console.log(`   UserId: ${data.userId || 'N/A'}`);
      console.log(`   Has profileImageUrl: ${data.profileImageUrl ? '✅ YES' : '❌ NO'}`);
      if (data.profileImageUrl) {
        console.log(`   Image length: ${data.profileImageUrl.length} characters`);
        console.log(`   Image starts with: ${data.profileImageUrl.substring(0, 50)}...`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error testing profile images:', error);
  }
}

// Run the test
testProfileImages();


