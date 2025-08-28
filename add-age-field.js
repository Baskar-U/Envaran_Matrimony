// Script to add age and dateOfBirth fields to existing registrations
// Run this in browser console on your app

console.log('🚀 Adding age and dateOfBirth fields to registrations...');

// Get Firebase functions from the global object
const { collection, getDocs, updateDoc, doc } = window;

async function addAgeFieldsToRegistrations() {
  try {
    console.log('📋 Fetching all registration documents...');
    
    // Get all registration documents
    const registrationsRef = collection(window.db, 'registrations');
    const querySnapshot = await getDocs(registrationsRef);
    
    console.log(`📊 Found ${querySnapshot.size} registration documents`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Process each registration document
    for (const docSnapshot of querySnapshot.docs) {
      const registrationData = docSnapshot.data();
      const docId = docSnapshot.id;
      
      console.log(`\n📝 Processing registration: ${docId}`);
      console.log('Current data:', registrationData);
      
      try {
        // Calculate age from existing dateOfBirth if available
        let age = null;
        let dateOfBirth = registrationData.dateOfBirth;
        
        if (dateOfBirth) {
          const today = new Date();
          const birthDate = new Date(dateOfBirth);
          age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          console.log(`📅 Date of Birth: ${dateOfBirth} → Age: ${age}`);
        } else {
          console.log('⚠️ No dateOfBirth found, setting default values');
          // Set default values if no dateOfBirth exists
          dateOfBirth = '2000-01-01'; // Default date
          age = 25; // Default age
        }
        
        // Update the document with age and ensure dateOfBirth exists
        const updateData = {
          age: age,
          dateOfBirth: dateOfBirth,
          updatedAt: new Date()
        };
        
        console.log('📤 Updating with data:', updateData);
        
        const docRef = doc(window.db, 'registrations', docId);
        await updateDoc(docRef, updateData);
        
        console.log(`✅ Successfully updated registration: ${docId}`);
        updatedCount++;
        
      } catch (error) {
        console.error(`❌ Error updating registration ${docId}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Update process completed!');
    console.log(`✅ Successfully updated: ${updatedCount} documents`);
    console.log(`❌ Errors: ${errorCount} documents`);
    
  } catch (error) {
    console.error('❌ Error in addAgeFieldsToRegistrations:', error);
  }
}

// Function to add age field to registration form schema
function addAgeFieldToSchema() {
  console.log('📋 Adding age field to registration form schema...');
  
  // This would be used when creating new registrations
  const ageFieldSchema = {
    name: 'age',
    type: 'number',
    label: 'Age',
    required: true,
    min: 18,
    max: 100,
    validation: {
      required: 'Age is required',
      min: 'Age must be at least 18',
      max: 'Age must be less than 100'
    }
  };
  
  console.log('✅ Age field schema:', ageFieldSchema);
  return ageFieldSchema;
}

// Function to validate age calculation
function validateAgeCalculation(dateOfBirth, expectedAge) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  
  console.log(`🧮 Age validation:`);
  console.log(`   Date of Birth: ${dateOfBirth}`);
  console.log(`   Expected Age: ${expectedAge}`);
  console.log(`   Calculated Age: ${calculatedAge}`);
  console.log(`   Match: ${calculatedAge === expectedAge ? '✅' : '❌'}`);
  
  return calculatedAge === expectedAge;
}

// Execute the main function
console.log('🚀 Starting age field addition process...');
addAgeFieldsToRegistrations();

// Export functions for manual use
window.addAgeFieldsToRegistrations = addAgeFieldsToRegistrations;
window.addAgeFieldToSchema = addAgeFieldToSchema;
window.validateAgeCalculation = validateAgeCalculation;

console.log('📚 Functions available:');
console.log('  - addAgeFieldsToRegistrations() - Add age to existing registrations');
console.log('  - addAgeFieldToSchema() - Get age field schema');
console.log('  - validateAgeCalculation(dateOfBirth, expectedAge) - Validate age calculation');
