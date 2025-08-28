// REFRESH MATCHES PAGE - Copy and paste this into browser console
// This will force refresh the matches page to show liked profiles

console.log('🔄 Refreshing Matches Page...');

// Function to refresh matches page
async function refreshMatchesPage() {
  try {
    // Check if we're on the matches page
    if (window.location.pathname !== '/matches') {
      console.log('⚠️ Not on matches page. Redirecting...');
      window.location.href = '/matches';
      return;
    }
    
    console.log('✅ On matches page');
    
    // Force a hard refresh to clear any cached data
    console.log('🔄 Performing hard refresh...');
    window.location.reload(true);
    
  } catch (error) {
    console.error('❌ Error refreshing page:', error);
  }
}

// Alternative: Manual refresh function
function manualRefresh() {
  console.log('🔄 Manual refresh triggered');
  window.location.reload();
}

// Run the refresh
refreshMatchesPage();

// Also provide manual function
console.log('');
console.log('💡 If automatic refresh doesn\'t work, run: manualRefresh()');
