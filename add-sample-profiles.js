// Add multiple sample registration profiles for testing
(async () => {
  console.log('🔧 Adding Sample Registration Profiles...');
  
  try {
    if (!window.db) {
      throw new Error('Firebase not available. Make sure you are on the profiles page.');
    }
    
    console.log('✅ Firebase detected');
    
    // Sample registration profiles
    const sampleProfiles = [
      {
        userId: 'user-001',
        status: 'completed',
        submittedAt: new Date(),
        name: 'Priya Sharma',
        gender: 'female',
        dateOfBirth: '20/05/1992',
        motherTongue: 'Hindi',
        maritalStatus: 'single',
        religion: 'Hindu',
        caste: 'Brahmin',
        subCaste: 'Sharma',
        fatherName: 'Rajesh Sharma',
        fatherJob: 'Doctor',
        fatherAlive: 'Yes',
        motherName: 'Sunita Sharma',
        motherJob: 'Teacher',
        motherAlive: 'Yes',
        orderOfBirth: 'First',
        height: '5\'4"',
        weight: '55',
        bloodGroup: 'B+',
        complexion: 'Fair',
        disability: 'None',
        diet: 'Vegetarian',
        qualification: 'Master\'s Degree',
        incomePerMonth: '65000',
        job: 'Software Engineer',
        placeOfJob: 'Tech Company',
        presentAddress: 'Mumbai, Maharashtra',
        permanentAddress: 'Delhi, India',
        contactNumber: '+919876543211',
        contactPerson: 'Priya Sharma',
        ownHouse: 'Yes',
        star: 'Rohini',
        laknam: 'None',
        timeOfBirth: { hour: '10', minute: '30', period: 'AM' },
        raasi: 'Taurus',
        gothram: 'Kashyapa',
        placeOfBirth: 'Mumbai',
        padam: 'First',
        dossam: 'None',
        nativity: 'Mumbai',
        horoscopeRequired: 'Yes',
        balance: 'Good',
        dasa: 'Jupiter',
        dasaPeriod: { years: '10', months: '6', days: '15' },
        partnerExpectations: {
          job: 'Professional',
          preferredAgeFrom: 28,
          preferredAgeTo: 35,
          jobPreference: 'Engineer/Doctor',
          diet: 'Vegetarian',
          maritalStatus: ['single'],
          subCaste: 'Any',
          comments: 'Looking for an educated, family-oriented partner.'
        },
        otherDetails: 'I am a software engineer who loves reading, cooking, and traveling. I am looking for a life partner who is educated, respectful, and shares similar family values.'
      },
      {
        userId: 'user-002',
        status: 'completed',
        submittedAt: new Date(),
        name: 'Arjun Patel',
        gender: 'male',
        dateOfBirth: '15/08/1988',
        motherTongue: 'Gujarati',
        maritalStatus: 'divorced',
        religion: 'Hindu',
        caste: 'Patel',
        subCaste: 'Kadva',
        fatherName: 'Mohan Patel',
        fatherJob: 'Business',
        fatherAlive: 'Yes',
        motherName: 'Lakshmi Patel',
        motherJob: 'Homemaker',
        motherAlive: 'Yes',
        orderOfBirth: 'Second',
        height: '5\'11"',
        weight: '80',
        bloodGroup: 'O+',
        complexion: 'Wheatish',
        disability: 'None',
        diet: 'Non-vegetarian',
        qualification: 'MBA',
        incomePerMonth: '85000',
        job: 'Business Analyst',
        placeOfJob: 'Consulting Firm',
        presentAddress: 'Ahmedabad, Gujarat',
        permanentAddress: 'Surat, Gujarat',
        contactNumber: '+919876543212',
        contactPerson: 'Arjun Patel',
        ownHouse: 'Yes',
        star: 'Mrigashira',
        laknam: 'None',
        timeOfBirth: { hour: '16', minute: '45', period: 'PM' },
        raasi: 'Gemini',
        gothram: 'Bharadwaja',
        placeOfBirth: 'Ahmedabad',
        padam: 'Second',
        dossam: 'None',
        nativity: 'Ahmedabad',
        horoscopeRequired: 'Yes',
        balance: 'Good',
        dasa: 'Saturn',
        dasaPeriod: { years: '8', months: '3', days: '20' },
        partnerExpectations: {
          job: 'Any',
          preferredAgeFrom: 25,
          preferredAgeTo: 32,
          jobPreference: 'Any',
          diet: 'Any',
          maritalStatus: ['single', 'divorced'],
          subCaste: 'Any',
          comments: 'Looking for a compatible partner who understands family values.'
        },
        otherDetails: 'I am a business analyst with a passion for fitness and music. I enjoy traveling and spending time with family. Looking for a life partner who is understanding and supportive.'
      },
      {
        userId: 'user-003',
        status: 'completed',
        submittedAt: new Date(),
        name: 'Anjali Reddy',
        gender: 'female',
        dateOfBirth: '03/12/1990',
        motherTongue: 'Telugu',
        maritalStatus: 'single',
        religion: 'Hindu',
        caste: 'Reddy',
        subCaste: 'Kapu',
        fatherName: 'Venkatesh Reddy',
        fatherJob: 'Engineer',
        fatherAlive: 'Yes',
        motherName: 'Padma Reddy',
        motherJob: 'Doctor',
        motherAlive: 'Yes',
        orderOfBirth: 'First',
        height: '5\'6"',
        weight: '58',
        bloodGroup: 'A+',
        complexion: 'Fair',
        disability: 'None',
        diet: 'Vegetarian',
        qualification: 'MBBS',
        incomePerMonth: '75000',
        job: 'Doctor',
        placeOfJob: 'Hospital',
        presentAddress: 'Hyderabad, Telangana',
        permanentAddress: 'Vijayawada, Andhra Pradesh',
        contactNumber: '+919876543213',
        contactPerson: 'Anjali Reddy',
        ownHouse: 'Yes',
        star: 'Ardra',
        laknam: 'None',
        timeOfBirth: { hour: '12', minute: '15', period: 'PM' },
        raasi: 'Cancer',
        gothram: 'Vasishtha',
        placeOfBirth: 'Hyderabad',
        padam: 'First',
        dossam: 'None',
        nativity: 'Hyderabad',
        horoscopeRequired: 'Yes',
        balance: 'Good',
        dasa: 'Mars',
        dasaPeriod: { years: '7', months: '9', days: '12' },
        partnerExpectations: {
          job: 'Professional',
          preferredAgeFrom: 30,
          preferredAgeTo: 38,
          jobPreference: 'Doctor/Engineer',
          diet: 'Vegetarian',
          maritalStatus: ['single'],
          subCaste: 'Any',
          comments: 'Looking for a well-educated, professional partner who values family.'
        },
        otherDetails: 'I am a doctor who loves reading, classical music, and cooking. I am looking for a life partner who is educated, respectful, and has strong family values.'
      }
    ];
    
    console.log('📝 Creating sample registration profiles...');
    
    for (let i = 0; i < sampleProfiles.length; i++) {
      const profile = sampleProfiles[i];
      const docRef = await window.addDoc(window.collection(window.db, 'registrations'), profile);
      console.log(`✅ Sample profile ${i + 1} created with ID:`, docRef.id);
    }
    
    console.log('🎉 All sample registration profiles added successfully!');
    console.log('📋 You can now refresh the profiles page to see the new profiles.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Firebase not available')) {
      console.log('💡 Make sure you are on the profiles page and the app is loaded');
    } else if (error.code === 'permission-denied') {
      console.log('💡 Permission denied. Check Firebase Security Rules');
    }
  }
})();

