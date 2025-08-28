// Test script for age calculation function
// Run this in browser console to test the age calculation

console.log('🧪 Testing Age Calculation Function');

// Test the age calculation function
function testCalculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  
  // Parse DD-MM-YYYY format
  const parts = dateOfBirth.split('-');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Month is 0-indexed
  const year = parseInt(parts[2]);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  const birthDate = new Date(year, month, day);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 0 ? age : null;
}

// Test cases
const testCases = [
  '15-08-1990',  // Should be around 34 years
  '20-05-1992',  // Should be around 32 years
  '03-12-1990',  // Should be around 34 years
  '12-09-2005',  // Should be around 19 years
  '01-01-2000',  // Should be around 25 years
  '31-12-1985',  // Should be around 39 years
  'invalid-date', // Should return null
  '15-13-1990',  // Invalid month, should return null
  '32-08-1990',  // Invalid day, should return null
];

console.log('📅 Testing age calculation:');
testCases.forEach(dateStr => {
  const age = testCalculateAge(dateStr);
  console.log(`  ${dateStr} → Age: ${age !== null ? age + ' years' : 'Invalid date'}`);
});

// Test date formatting function
function testDateFormatting(input) {
  const digitsOnly = input.replace(/\D/g, '');
  
  let formattedValue = '';
  if (digitsOnly.length >= 1) formattedValue += digitsOnly.substring(0, 2);
  if (digitsOnly.length >= 3) formattedValue += '-' + digitsOnly.substring(2, 4);
  if (digitsOnly.length >= 5) formattedValue += '-' + digitsOnly.substring(4, 8);
  
  return formattedValue;
}

console.log('\n📝 Testing date formatting:');
const formatTests = [
  '15081990',
  '15-08-1990',
  '15/08/1990',
  '1508199',
  '1508',
  '15',
  'abc15081990def'
];

formatTests.forEach(input => {
  const formatted = testDateFormatting(input);
  console.log(`  "${input}" → "${formatted}"`);
});

console.log('\n✅ Age calculation test completed!');
