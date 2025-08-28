// Create index for registrations collection
(async () => {
  console.log('🔧 Creating Firebase Index for Registrations...');
  
  try {
    if (!window.db) {
      throw new Error('Firebase not available. Make sure you are on the profile view page.');
    }
    
    console.log('✅ Firebase detected');
    
    // Create a temporary registration document to trigger index creation
    const tempRegistration = {
      userId: 'temp-index-creation',
      status: 'pending',
      submittedAt: new Date(),
      name: 'Test User',
      gender: 'male',
      dateOfBirth: '01/01/1990',
      motherTongue: 'English',
      maritalStatus: 'single',
      religion: 'Other',
      caste: 'Other',
      subCaste: 'Other',
      fatherName: 'Test Father',
      fatherJob: 'Test Job',
      fatherAlive: 'Yes',
      motherName: 'Test Mother',
      motherJob: 'Test Job',
      motherAlive: 'Yes',
      orderOfBirth: 'First',
      height: '5\'8"',
      weight: '70',
      bloodGroup: 'O+',
      complexion: 'Fair',
      disability: 'None',
      diet: 'Non-vegetarian',
      qualification: 'Bachelor\'s',
      incomePerMonth: '50000',
      job: 'Software Engineer',
      placeOfJob: 'Test Company',
      presentAddress: 'Test Address',
      permanentAddress: 'Test Address',
      contactNumber: '+919876543210',
      contactPerson: 'Test Contact',
      ownHouse: 'Yes',
      star: 'Test Star',
      laknam: 'Test Laknam',
      timeOfBirth: {
        hour: '12',
        minute: '00',
        period: 'PM'
      },
      raasi: 'Test Raasi',
      gothram: 'Test Gothram',
      placeOfBirth: 'Test Place',
      padam: 'Test Padam',
      dossam: 'Test Dossam',
      nativity: 'Test Nativity',
      horoscopeRequired: 'Yes',
      balance: 'Test Balance',
      dasa: 'Test Dasa',
      dasaPeriod: {
        years: '10',
        months: '6',
        days: '15'
      },
      partnerExpectations: {
        job: 'Any',
        preferredAgeFrom: 25,
        preferredAgeTo: 35,
        jobPreference: 'Any',
        diet: 'Any',
        maritalStatus: ['single'],
        subCaste: 'Any',
        comments: 'Test comments'
      },
      otherDetails: 'Test details'
    };
    
    console.log('📝 Creating temporary registration document...');
    const docRef = await window.addDoc(window.collection(window.db, 'registrations'), tempRegistration);
    console.log('✅ Temporary registration created:', docRef.id);
    
    // Delete the temporary document
    await window.deleteDoc(window.doc(window.db, 'registrations', docRef.id));
    console.log('✅ Temporary registration deleted');
    
    console.log('🎉 Index creation process completed!');
    console.log('📋 The index should now be created automatically.');
    console.log('🔗 If you still see index errors, use this direct link:');
    console.log('https://console.firebase.google.com/v1/r/project/matrimony-events/firestore/indexes?create_composite=ClZwcm9qZWN0cy9tYXRyaW1vbnktZXZlbnRzL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9yZWdpc3RyYXRpb25zL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg8KC3N1Ym1pdHRlZEF0EAIaDAoIX19uYW1lX18QAg');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'failed-precondition') {
      console.log('💡 Index needs manual creation. Follow these steps:');
      console.log('1. Go to: https://console.firebase.google.com/');
      console.log('2. Select project: matrimony-events');
      console.log('3. Go to Firestore Database → Indexes');
      console.log('4. Click "Add Index"');
      console.log('5. Collection: registrations');
      console.log('6. Fields: userId (Ascending), submittedAt (Descending), __name__ (Descending)');
    } else if (error.message.includes('Firebase not available')) {
      console.log('💡 Make sure you are on the profile view page and the app is loaded');
    }
  }
})();

