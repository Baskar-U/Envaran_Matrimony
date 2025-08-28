// Improved script to fix age calculation and add age fields
// Run this in browser console on your app

console.log('🚀 Fixing age calculation and adding age fields...');

// Get Firebase functions from the global object
const { collection, getDocs, updateDoc, doc } = window;

// Helper function to parse different date formats
function parseDate(dateString) {
  if (!dateString) return null;
  
  // Try different date formats
  const formats = [
    // YYYY-MM-DD (ISO format)
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    // DD/MM/YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // MM/DD/YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // DD-MM-YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/
  ];
  
  for (let i = 0; i < formats.length; i++) {
    const match = dateString.match(formats[i]);
    if (match) {
      let year, month, day;
      
      if (i === 0) {
        // YYYY-MM-DD format
        year = parseInt(match[1]);
        month = parseInt(match[2]) - 1; // Month is 0-indexed
        day = parseInt(match[3]);
      } else if (i === 1) {
        // DD/MM/YYYY format
        day = parseInt(match[1]);
        month = parseInt(match[2]) - 1; // Month is 0-indexed
        year = parseInt(match[3]);
      } else if (i === 2) {
        // MM/DD/YYYY format (assuming this is the case for some dates)
        month = parseInt(match[1]) - 1; // Month is 0-indexed
        day = parseInt(match[2]);
        year = parseInt(match[3]);
      } else {
        // DD-MM-YYYY format
        day = parseInt(match[1]);
        month = parseInt(match[2]) - 1; // Month is 0-indexed
        year = parseInt(match[3]);
      }
      
      const date = new Date(year, month, day);
      if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return date;
      }
    }
  }
  
  console.log(`⚠️ Could not parse date: ${dateString}`);
  return null;
}

// Improved age calculation function
function calculateAgeFromDate(dateString) {
  const birthDate = parseDate(dateString);
  if (!birthDate) {
    console.log(`❌ Invalid date format: ${dateString}`);
    return null;
  }
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Validate age is reasonable
  if (age < 0 || age > 120) {
    console.log(`⚠️ Calculated age seems unreasonable: ${age} from ${dateString}`);
    return null;
  }
  
  return age;
}

async function fixAgeCalculation() {
  try {
    console.log('📋 Fetching all registration documents...');
    
    // Get all registration documents
    const registrationsRef = collection(window.db, 'registrations');
    const querySnapshot = await getDocs(registrationsRef);
    
    console.log(`📊 Found ${querySnapshot.size} registration documents`);
    
    let updatedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    // Process each registration document
    for (const docSnapshot of querySnapshot.docs) {
      const registrationData = docSnapshot.data();
      const docId = docSnapshot.id;
      
      console.log(`\n📝 Processing registration: ${docId}`);
      console.log('Current data:', registrationData);
      
      try {
        // Calculate age from existing dateOfBirth
        let age = null;
        let dateOfBirth = registrationData.dateOfBirth;
        
        if (dateOfBirth) {
          age = calculateAgeFromDate(dateOfBirth);
          console.log(`📅 Date of Birth: ${dateOfBirth} → Age: ${age}`);
        } else {
          console.log('⚠️ No dateOfBirth found');
        }
        
        // Only update if we have a valid age or if age field is missing
        if (age !== null || !registrationData.hasOwnProperty('age')) {
          const updateData = {
            age: age || 25, // Default age if calculation fails
            updatedAt: new Date()
          };
          
          // Only include dateOfBirth if it's missing or needs to be standardized
          if (!dateOfBirth) {
            updateData.dateOfBirth = '2000-01-01'; // Default date
          }
          
          console.log('📤 Updating with data:', updateData);
          
          const docRef = doc(window.db, 'registrations', docId);
          await updateDoc(docRef, updateData);
          
          console.log(`✅ Successfully updated registration: ${docId}`);
          updatedCount++;
        } else {
          console.log(`⏭️ Skipping ${docId} - age calculation failed`);
          skippedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error updating registration ${docId}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Update process completed!');
    console.log(`✅ Successfully updated: ${updatedCount} documents`);
    console.log(`⏭️ Skipped: ${skippedCount} documents`);
    console.log(`❌ Errors: ${errorCount} documents`);
    
  } catch (error) {
    console.error('❌ Error in fixAgeCalculation:', error);
  }
}

// Function to test date parsing
function testDateParsing() {
  const testDates = [
    '2005-09-12',
    '20/05/1992',
    '15/08/1988',
    '03/12/1990',
    '1990-12-03',
    'invalid-date'
  ];
  
  console.log('🧪 Testing date parsing:');
  testDates.forEach(dateStr => {
    const parsed = parseDate(dateStr);
    const age = calculateAgeFromDate(dateStr);
    console.log(`  ${dateStr} → Parsed: ${parsed}, Age: ${age}`);
  });
}

// Function to manually fix a specific registration
async function fixSpecificRegistration(docId, dateOfBirth) {
  try {
    console.log(`🔧 Fixing specific registration: ${docId}`);
    
    const age = calculateAgeFromDate(dateOfBirth);
    console.log(`📅 Date: ${dateOfBirth} → Age: ${age}`);
    
    if (age !== null) {
      const docRef = doc(window.db, 'registrations', docId);
      await updateDoc(docRef, {
        age: age,
        dateOfBirth: dateOfBirth,
        updatedAt: new Date()
      });
      
      console.log(`✅ Successfully fixed registration: ${docId}`);
      return true;
    } else {
      console.log(`❌ Could not calculate age for: ${dateOfBirth}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing registration ${docId}:`, error);
    return false;
  }
}

// Execute the main function
console.log('🚀 Starting age calculation fix...');
fixAgeCalculation();

// Export functions for manual use
window.fixAgeCalculation = fixAgeCalculation;
window.testDateParsing = testDateParsing;
window.fixSpecificRegistration = fixSpecificRegistration;
window.parseDate = parseDate;
window.calculateAgeFromDate = calculateAgeFromDate;

console.log('📚 Functions available:');
console.log('  - fixAgeCalculation() - Fix all registrations');
console.log('  - testDateParsing() - Test date parsing');
console.log('  - fixSpecificRegistration(docId, dateOfBirth) - Fix specific registration');
console.log('  - parseDate(dateString) - Parse date string');
console.log('  - calculateAgeFromDate(dateString) - Calculate age from date');
