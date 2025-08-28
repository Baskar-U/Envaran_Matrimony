// Test script to check registration data
(async () => {
  console.log('🔍 Testing Registration Data Retrieval...');
  
  try {
    if (!window.db) {
      throw new Error('Firebase not available. Make sure you are on the profile view page.');
    }
    
    console.log('✅ Firebase detected');
    
    // Get the current user ID from the URL
    const urlParts = window.location.pathname.split('/');
    const userId = urlParts[urlParts.length - 1];
    
    if (!userId) {
      throw new Error('No user ID found in URL');
    }
    
    console.log('👤 User ID from URL:', userId);
    
    // Test 1: Check if user document exists
    console.log('\n📋 Test 1: Checking user document...');
    const userDoc = await window.getDoc(window.doc(window.db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('✅ User document found:', userData);
    } else {
      console.log('❌ User document not found');
    }
    
    // Test 2: Check if profile document exists
    console.log('\n📋 Test 2: Checking profile document...');
    const profileDoc = await window.getDoc(window.doc(window.db, 'profiles', userId));
    if (profileDoc.exists()) {
      const profileData = profileDoc.data();
      console.log('✅ Profile document found:', profileData);
    } else {
      console.log('❌ Profile document not found');
    }
    
    // Test 3: Check registrations collection
    console.log('\n📋 Test 3: Checking registrations collection...');
    const registrationsQuery = window.query(
      window.collection(window.db, 'registrations'),
      window.where('userId', '==', userId),
      window.orderBy('submittedAt', 'desc'),
      window.limit(1)
    );
    
    const registrationsSnapshot = await window.getDocs(registrationsQuery);
    console.log('📊 Registrations found:', registrationsSnapshot.size);
    
    if (!registrationsSnapshot.empty) {
      const registrationDoc = registrationsSnapshot.docs[0];
      const registrationData = registrationDoc.data();
      console.log('✅ Registration document found:', registrationData);
      
      // Check specific fields
      console.log('\n📋 Registration Data Fields:');
      console.log('  - Name:', registrationData.name);
      console.log('  - Gender:', registrationData.gender);
      console.log('  - Date of Birth:', registrationData.dateOfBirth);
      console.log('  - Religion:', registrationData.religion);
      console.log('  - Caste:', registrationData.caste);
      console.log('  - Sub Caste:', registrationData.subCaste);
      console.log('  - Mother Tongue:', registrationData.motherTongue);
      console.log('  - Marital Status:', registrationData.maritalStatus);
      console.log('  - Height:', registrationData.height);
      console.log('  - Weight:', registrationData.weight);
      console.log('  - Blood Group:', registrationData.bloodGroup);
      console.log('  - Diet:', registrationData.diet);
      console.log('  - Contact Number:', registrationData.contactNumber);
      console.log('  - Contact Person:', registrationData.contactPerson);
      console.log('  - Present Address:', registrationData.presentAddress);
      console.log('  - Permanent Address:', registrationData.permanentAddress);
      console.log('  - Star:', registrationData.star);
      console.log('  - Raasi:', registrationData.raasi);
      console.log('  - Gothram:', registrationData.gothram);
      console.log('  - Place of Birth:', registrationData.placeOfBirth);
      console.log('  - Time of Birth:', registrationData.timeOfBirth);
      console.log('  - Partner Expectations:', registrationData.partnerExpectations);
      console.log('  - Other Details:', registrationData.otherDetails);
    } else {
      console.log('❌ No registration documents found for this user');
      
      // Check if there are any registrations at all
      console.log('\n📋 Checking all registrations...');
      const allRegistrationsQuery = window.query(
        window.collection(window.db, 'registrations'),
        window.limit(5)
      );
      
      const allRegistrationsSnapshot = await window.getDocs(allRegistrationsQuery);
      console.log('📊 Total registrations in collection:', allRegistrationsSnapshot.size);
      
      if (!allRegistrationsSnapshot.empty) {
        console.log('📋 Sample registration documents:');
        allRegistrationsSnapshot.docs.forEach((doc, index) => {
          const data = doc.data();
          console.log(`  ${index + 1}. ID: ${doc.id}, UserID: ${data.userId}, Name: ${data.name}`);
        });
      }
    }
    
    console.log('\n🎉 Registration data test completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Firebase not available')) {
      console.log('💡 Make sure you are on the profile view page and the app is loaded');
    } else if (error.code === 'permission-denied') {
      console.log('💡 Permission denied. Check Firebase Security Rules');
    } else if (error.code === 'unavailable') {
      console.log('💡 Firebase service unavailable. Check your internet connection');
    }
  }
})();

