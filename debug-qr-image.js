// Debug QR Code Image Loading
console.log('🔍 Debugging QR Code Image Loading...');

// Test 1: Check if image exists
async function testImageExists() {
  try {
    const response = await fetch('/payment.jpg');
    if (response.ok) {
      console.log('✅ Image exists and is accessible');
      console.log('📊 Image size:', response.headers.get('content-length'), 'bytes');
      console.log('📋 Content type:', response.headers.get('content-type'));
    } else {
      console.log('❌ Image not found (status:', response.status, ')');
    }
  } catch (error) {
    console.log('❌ Error checking image:', error.message);
  }
}

// Test 2: Create a test image element
function testImageElement() {
  const img = new Image();
  
  img.onload = function() {
    console.log('✅ Image loaded successfully via JavaScript');
    console.log('📏 Image dimensions:', this.width, 'x', this.height);
  };
  
  img.onerror = function() {
    console.log('❌ Image failed to load via JavaScript');
  };
  
  img.src = '/payment.jpg';
}

// Test 3: Check current URL and paths
function checkPaths() {
  console.log('🌐 Current URL:', window.location.href);
  console.log('🏠 Origin:', window.location.origin);
  console.log('📁 Image path:', '/payment.jpg');
  console.log('🔗 Full image URL:', window.location.origin + '/payment.jpg');
}

// Run all tests
console.log('🚀 Running image tests...');
checkPaths();
testImageExists();
testImageElement();

console.log('💡 To test the image manually:');
console.log('   1. Open browser console (F12)');
console.log('   2. Go to /image-test page');
console.log('   3. Check for any error messages');
console.log('   4. Try accessing the image directly in browser:');
console.log('      ' + window.location.origin + '/payment.jpg');
