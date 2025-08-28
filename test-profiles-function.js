// Test script to check getProfilesFromRegistrations function
// Run this in browser console

async function testGetProfilesFromRegistrations() {
  console.log('🔍 Testing getProfilesFromRegistrations function...');
  
  try {
    // Import the function (you'll need to copy this from firebaseAuth.ts)
    const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    
    // Simulate the function
    const excludeUserId = null;
    const limitCount = 50;
    
    let q = query(
      collection(db, 'registrations'),
      where('status', '==', 'completed'),
      orderBy('submittedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    console.log(`📊 Found ${querySnapshot.docs.length} completed registrations`);
    
    const profiles = [];

    for (const doc of querySnapshot.docs) {
      if (excludeUserId && doc.data().userId === excludeUserId) {
        console.log('Skipping excluded user:', doc.data().userId);
        continue;
      }
      
      const registrationData = { id: doc.id, ...doc.data() };
      console.log(`\n📄 Processing registration: ${doc.id}`);
      console.log(`   UserId: ${registrationData.userId}`);
      console.log(`   Name: ${registrationData.name || 'N/A'}`);
      console.log(`   Has profileImageUrl: ${registrationData.profileImageUrl ? '✅ YES' : '❌ NO'}`);
      
      // Create a profile object from registration data
      const profile = {
        id: registrationData.userId,
        userId: registrationData.userId,
        age: registrationData.dateOfBirth ? calculateAge(registrationData.dateOfBirth) : 0,
        gender: registrationData.gender || '',
        location: registrationData.presentAddress || '',
        profession: registrationData.job || '',
        professionOther: '',
        bio: registrationData.otherDetails || '',
        education: registrationData.qualification || '',
        educationOther: '',
        educationSpecification: '',
        educationSpecificationOther: '',
        relationshipStatus: registrationData.maritalStatus || '',
        religion: registrationData.religion || '',
        caste: registrationData.caste || '',
        subCaste: registrationData.subCaste || '',
        motherTongue: registrationData.motherTongue || '',
        smoking: '',
        drinking: '',
        lifestyle: '',
        hobbies: '',
        verified: true,
        kidsPreference: '',
        profileImageUrl: registrationData.profileImageUrl || '',
        createdAt: registrationData.submittedAt || new Date(),
        updatedAt: registrationData.submittedAt || new Date(),
        registration: registrationData
      };
      
      // Create a user object from registration data
      const user = {
        id: registrationData.userId,
        email: '',
        firstName: registrationData.name ? registrationData.name.split(' ')[0] : '',
        lastName: registrationData.name ? registrationData.name.split(' ').slice(1).join(' ') : '',
        fullName: registrationData.name || '',
        profileImageUrl: registrationData.profileImageUrl || '',
        gender: registrationData.gender || '',
        dateOfBirth: registrationData.dateOfBirth || '',
        religion: registrationData.religion || '',
        caste: registrationData.caste || '',
        subCaste: registrationData.subCaste || '',
        mobileNo: registrationData.contactNumber || '',
        createdAt: registrationData.submittedAt || new Date(),
        updatedAt: registrationData.submittedAt || new Date()
      };
      
      profiles.push({ ...profile, user });
      console.log(`   ✅ Profile created for user: ${registrationData.userId}`);
      console.log(`   Profile image URL: ${profile.profileImageUrl ? 'Has image' : 'No image'}`);
      console.log(`   User image URL: ${user.profileImageUrl ? 'Has image' : 'No image'}`);
    }

    console.log(`\n🎯 Final result: ${profiles.length} profiles created`);
    profiles.forEach((profile, index) => {
      console.log(`   Profile ${index + 1}: ${profile.user.firstName} - Image: ${profile.user.profileImageUrl ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing getProfilesFromRegistrations:', error);
  }
}

// Helper function to calculate age
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Run the test
testGetProfilesFromRegistrations();


