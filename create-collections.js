// Simple Firebase Collections Creation Script
// Run this in your browser console after your React app is loaded

console.log('🚀 Creating Firebase collections for SecondChance Matrimony...');

// Check if Firebase is available
if (!window.db || !window.collection || !window.addDoc) {
  console.error('❌ Firebase not found! Please ensure your React app is loaded.');
  console.log('💡 Make sure main.tsx has Firebase functions exposed');
  throw new Error('Firebase not accessible');
}

console.log('✅ Firebase found! Starting collection creation...');

// Function to create a collection with sample data
async function createCollection(collectionName, sampleData) {
  try {
    console.log(`📝 Creating collection: ${collectionName}`);
    
    // Create a sample document
    const docRef = await window.addDoc(window.collection(window.db, collectionName), {
      ...sampleData,
      _isSample: true,
      createdAt: new Date()
    });
    
    console.log(`✅ Created ${collectionName} with document ID: ${docRef.id}`);
    
    // Delete the sample document (keep the collection)
    await window.deleteDoc(docRef);
    console.log(`🗑️ Cleaned up sample document from ${collectionName}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${collectionName}:`, error);
    return false;
  }
}

// Sample data for each collection
const collectionsData = {
  users: {
    email: 'sample@example.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    profileImageUrl: 'https://example.com/image.jpg',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Iyer',
    mobileNo: '+91-9876543210',
    createdAt: new Date(),
    updatedAt: new Date(),
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      matchAlerts: true,
      messageAlerts: true,
      profileViews: true,
      weeklyDigest: false
    },
    privacySettings: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      showLastSeen: true,
      allowMessages: true,
      allowProfileViews: true,
      shareData: false
    },
    languageSettings: {
      language: 'English',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY'
    }
  },

  profiles: {
    userId: 'sample-user-id',
    age: 30,
    gender: 'Male',
    location: 'Chennai, Tamil Nadu',
    profession: 'Software Engineer',
    professionOther: '',
    bio: 'Looking for a life partner who shares similar values and goals.',
    education: 'Bachelor of Engineering',
    educationOther: '',
    educationSpecification: 'Computer Science',
    educationSpecificationOther: '',
    relationshipStatus: 'never_married',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Iyer',
    motherTongue: 'Tamil',
    smoking: 'No',
    drinking: 'Occasionally',
    lifestyle: 'Moderate',
    hobbies: 'Reading, Traveling, Music',
    verified: false,
    kidsPreference: 'want_kids',
    createdAt: new Date(),
    updatedAt: new Date(),
    height: '5\'8"',
    weight: '70',
    bloodGroup: 'O+',
    complexion: 'Fair',
    disability: 'No',
    diet: 'Vegetarian',
    fatherName: 'Father Name',
    fatherJob: 'Business',
    fatherAlive: 'Yes',
    motherName: 'Mother Name',
    motherJob: 'Homemaker',
    motherAlive: 'Yes',
    orderOfBirth: 'First',
    siblings: {
      elderBrother: { name: 'Elder Brother', maritalStatus: 'Married' },
      youngerBrother: { name: 'Younger Brother', maritalStatus: 'Unmarried' },
      elderSister: { name: 'Elder Sister', maritalStatus: 'Married' },
      youngerSister: { name: 'Younger Sister', maritalStatus: 'Unmarried' }
    },
    qualification: 'B.E. Computer Science',
    incomePerMonth: '75000',
    job: 'Software Engineer',
    placeOfJob: 'Chennai',
    presentAddress: '123 Main Street, Chennai, Tamil Nadu',
    permanentAddress: '456 Home Street, Chennai, Tamil Nadu',
    contactNumber: '+91-9876543210',
    contactPerson: 'Father',
    ownHouse: 'Yes',
    star: 'Rohini',
    laknam: 'Simha',
    timeOfBirth: { hour: '10', minute: '30', period: 'AM' },
    raasi: 'Vrishabha',
    gothram: 'Kashyapa',
    placeOfBirth: 'Chennai',
    padam: 'First',
    dossam: 'No',
    nativity: 'Chennai',
    horoscopeRequired: 'Yes',
    balance: '25 years',
    dasa: 'Jupiter',
    dasaPeriod: { years: '5', months: '3', days: '15' },
    partnerExpectations: {
      job: 'Any',
      preferredAgeFrom: 25,
      preferredAgeTo: 35,
      jobPreference: 'Optional',
      diet: 'Vegetarian',
      maritalStatus: ['Unmarried'],
      subCaste: 'Any',
      comments: 'Looking for someone with good family values'
    },
    photos: {
      photo1: 'https://example.com/photo1.jpg',
      photo2: 'https://example.com/photo2.jpg'
    },
    otherDetails: 'Talented in music, achievements in academics, likes traveling, family-oriented person'
  },

  likes: {
    likerId: 'user1-id',
    likedId: 'user2-id',
    createdAt: new Date()
  },

  matches: {
    user1Id: 'user1-id',
    user2Id: 'user2-id',
    createdAt: new Date()
  },

  notifications: {
    userId: 'user-id',
    type: 'like',
    data: {
      likerId: 'liker-id',
      likerName: 'John Doe',
      likerProfileImage: 'https://example.com/image.jpg'
    },
    read: false,
    createdAt: new Date()
  },

  registrations: {
    userId: 'user-id',
    status: 'pending',
    name: 'John Doe',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    motherTongue: 'Tamil',
    maritalStatus: 'Unmarried',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Iyer',
    fatherName: 'Father Name',
    fatherJob: 'Business',
    fatherAlive: 'Yes',
    motherName: 'Mother Name',
    motherJob: 'Homemaker',
    motherAlive: 'Yes',
    orderOfBirth: 'First',
    height: '5\'8"',
    weight: '70',
    bloodGroup: 'O+',
    complexion: 'Fair',
    disability: 'No',
    diet: 'Vegetarian',
    qualification: 'B.E. Computer Science',
    incomePerMonth: '75000',
    job: 'Software Engineer',
    placeOfJob: 'Chennai',
    presentAddress: '123 Main Street, Chennai, Tamil Nadu',
    permanentAddress: '456 Home Street, Chennai, Tamil Nadu',
    contactNumber: '+91-9876543210',
    contactPerson: 'Father',
    ownHouse: 'Yes',
    star: 'Rohini',
    laknam: 'Simha',
    timeOfBirth: { hour: '10', minute: '30', period: 'AM' },
    raasi: 'Vrishabha',
    gothram: 'Kashyapa',
    placeOfBirth: 'Chennai',
    padam: 'First',
    dossam: 'No',
    nativity: 'Chennai',
    horoscopeRequired: 'Yes',
    balance: '25 years',
    dasa: 'Jupiter',
    dasaPeriod: { years: '5', months: '3', days: '15' },
    partnerExpectations: {
      job: 'Any',
      preferredAgeFrom: 25,
      preferredAgeTo: 35,
      jobPreference: 'Optional',
      diet: 'Vegetarian',
      maritalStatus: ['Unmarried'],
      subCaste: 'Any',
      comments: 'Looking for someone with good family values'
    },
    photos: {
      photo1: 'https://example.com/photo1.jpg',
      photo2: 'https://example.com/photo2.jpg'
    },
    otherDetails: 'Talented in music, achievements in academics, likes traveling, family-oriented person',
    submittedAt: new Date(),
    approvedAt: null,
    approvedBy: null,
    rejectionReason: null
  }
};

// Main function to create all collections
async function createAllCollections() {
  console.log('🎯 Starting collection creation...');
  
  const results = [];
  
  for (const [collectionName, sampleData] of Object.entries(collectionsData)) {
    const success = await createCollection(collectionName, sampleData);
    results.push({ collection: collectionName, success });
  }
  
  console.log('\n📊 Collection Creation Results:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.collection}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n🎉 Created ${successCount}/${totalCount} collections successfully!`);
  
  if (successCount === totalCount) {
    console.log('✅ All collections created! Your Firebase database is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. Create indexes in Firebase Console');
    console.log('2. Set up security rules');
    console.log('3. Start building your registration forms');
  } else {
    console.log('⚠️ Some collections failed to create. Check the errors above.');
  }
}

// Execute the collection creation
createAllCollections().catch(console.error);

console.log(`
📋 INSTRUCTIONS:
1. Make sure your React app is loaded
2. Copy and paste this entire script into browser console
3. Press Enter to execute
4. Check the results above

⚠️ This script creates sample documents to establish collections, then deletes them.
   Your actual data will be added through your registration forms.
`);

