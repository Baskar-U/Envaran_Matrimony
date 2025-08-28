// Add sample registration data for testing
(async () => {
  console.log('🔧 Adding Sample Registration Data...');
  
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
    
    // Sample registration data
    const sampleRegistration = {
      userId: userId,
      status: 'completed',
      submittedAt: new Date(),
      
      // Personal Details
      name: 'John Doe',
      gender: 'male',
      dateOfBirth: '15/03/1990',
      motherTongue: 'English',
      maritalStatus: 'single',
      religion: 'Hindu',
      caste: 'Brahmin',
      subCaste: 'Iyer',
      
      // Family Details
      fatherName: 'Robert Doe',
      fatherJob: 'Engineer',
      fatherAlive: 'Yes',
      motherName: 'Mary Doe',
      motherJob: 'Teacher',
      motherAlive: 'Yes',
      orderOfBirth: 'First',
      
      // Physical Attributes
      height: '5\'10"',
      weight: '75',
      bloodGroup: 'O+',
      complexion: 'Fair',
      disability: 'None',
      diet: 'Vegetarian',
      
      // Education & Occupation
      qualification: 'Master\'s Degree',
      incomePerMonth: '75000',
      job: 'Software Engineer',
      placeOfJob: 'Tech Company',
      
      // Communication Details
      presentAddress: '123 Main Street, City, State 12345',
      permanentAddress: '456 Home Avenue, Hometown, State 67890',
      contactNumber: '+919876543210',
      contactPerson: 'John Doe',
      
      // Astrology Details
      ownHouse: 'Yes',
      star: 'Rohini',
      laknam: 'None',
      timeOfBirth: {
        hour: '14',
        minute: '30',
        period: 'PM'
      },
      raasi: 'Taurus',
      gothram: 'Kashyapa',
      placeOfBirth: 'Chennai',
      padam: 'First',
      dossam: 'None',
      nativity: 'Chennai',
      
      // Horoscope Details
      horoscopeRequired: 'Yes',
      balance: 'Good',
      dasa: 'Jupiter',
      dasaPeriod: {
        years: '12',
        months: '6',
        days: '15'
      },
      
      // Partner Expectations
      partnerExpectations: {
        job: 'Any',
        preferredAgeFrom: 25,
        preferredAgeTo: 35,
        jobPreference: 'Professional',
        diet: 'Vegetarian',
        maritalStatus: ['single', 'divorced'],
        subCaste: 'Any',
        comments: 'Looking for a compatible partner who shares similar values and goals.'
      },
      
      // Additional Details
      otherDetails: 'I am a software engineer with a passion for technology and innovation. I enjoy reading, traveling, and spending time with family. I am looking for a life partner who is educated, family-oriented, and has similar interests.'
    };
    
    console.log('📝 Creating sample registration document...');
    const docRef = await window.addDoc(window.collection(window.db, 'registrations'), sampleRegistration);
    console.log('✅ Sample registration created with ID:', docRef.id);
    
    console.log('🎉 Sample registration data added successfully!');
    console.log('📋 You can now refresh the profile page to see the detailed information.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Firebase not available')) {
      console.log('💡 Make sure you are on the profile view page and the app is loaded');
    } else if (error.code === 'permission-denied') {
      console.log('💡 Permission denied. Check Firebase Security Rules');
    }
  }
})();

