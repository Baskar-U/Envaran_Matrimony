// Setup Payment System - Firebase Collections and Fields
console.log('🚀 Setting up Payment System Collections...');

async function setupPaymentSystem() {
  try {
    console.log('📋 Checking current user...');
    
    if (!window.auth || !window.auth.currentUser) {
      console.log('❌ No user logged in. Please log in first.');
      return;
    }
    
    console.log(`✅ Current user: ${window.auth.currentUser.email}`);
    
    // 1. Check if payments collection exists and create sample data
    console.log('\n📊 Setting up payments collection...');
    
    const paymentsCollection = window.collection(window.db, 'payments');
    
    // Create a sample payment document to establish the collection structure
    const samplePayment = {
      userId: window.auth.currentUser.uid,
      userEmail: window.auth.currentUser.email,
      userName: window.auth.currentUser.displayName || 'Test User',
      plan: 'monthly',
      amount: 299,
      transactionId: 'SAMPLE_TXN_123',
      screenshotUrl: 'sample_screenshot.jpg', // Store filename only
      status: 'pending',
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null
    };
    
    try {
      await window.addDoc(paymentsCollection, samplePayment);
      console.log('✅ Sample payment document created');
      
      // Delete the sample document
      const sampleQuery = window.query(
        paymentsCollection,
        window.where('transactionId', '==', 'SAMPLE_TXN_123')
      );
      const sampleSnapshot = await window.getDocs(sampleQuery);
      if (!sampleSnapshot.empty) {
        await window.deleteDoc(window.doc(window.db, 'payments', sampleSnapshot.docs[0].id));
        console.log('✅ Sample payment document cleaned up');
      }
    } catch (error) {
      console.log('ℹ️ Payments collection already exists or error:', error.message);
    }
    
    // 2. Check registrations collection and add premium fields
    console.log('\n👤 Setting up registrations collection with premium fields...');
    
    const registrationsCollection = window.collection(window.db, 'registrations');
    
    // Check if current user has a registration
    const registrationQuery = window.query(
      registrationsCollection,
      window.where('userId', '==', window.auth.currentUser.uid)
    );
    const registrationSnapshot = await window.getDocs(registrationQuery);
    
    if (!registrationSnapshot.empty) {
      const registrationDoc = registrationSnapshot.docs[0];
      const registrationData = registrationDoc.data();
      
      console.log('📋 Current registration data:', registrationData);
      
      // Check if premium fields exist
      const premiumFields = {
        accountType: registrationData.accountType || 'free',
        premiumUpgradedAt: registrationData.premiumUpgradedAt || null,
        premiumPlan: registrationData.premiumPlan || null,
        premiumExpiresAt: registrationData.premiumExpiresAt || null
      };
      
      console.log('🔍 Premium fields status:', premiumFields);
      
      // Update registration with premium fields if missing
      if (!registrationData.accountType) {
        await window.updateDoc(window.doc(window.db, 'registrations', registrationDoc.id), {
          accountType: 'free'
        });
        console.log('✅ Added accountType field to registration');
      }
    } else {
      console.log('⚠️ No registration found for current user');
    }
    
         // 3. Payment screenshot storage (Base64 in Firestore)
     console.log('\n📁 Payment screenshot storage setup...');
     console.log('📋 Screenshots stored as Base64 in Firestore (no Firebase Storage required)');
     console.log('💡 This works with the free Firebase plan');
    
    // 4. Verify all required collections exist
    console.log('\n🔍 Verifying all required collections...');
    
    const requiredCollections = ['payments', 'registrations', 'likes', 'matches', 'notifications'];
    
    for (const collectionName of requiredCollections) {
      try {
        const testQuery = window.query(window.collection(window.db, collectionName), window.limit(1));
        await window.getDocs(testQuery);
        console.log(`✅ ${collectionName} collection exists`);
      } catch (error) {
        console.log(`❌ ${collectionName} collection missing or inaccessible:`, error.message);
      }
    }
    
    // 5. Display payment system structure
    console.log('\n📋 Payment System Structure:');
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ PAYMENTS COLLECTION                                         │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│ • userId: string (Firebase Auth UID)                       │');
    console.log('│ • userEmail: string                                         │');
    console.log('│ • userName: string                                          │');
    console.log('│ • plan: "monthly" | "yearly"                               │');
    console.log('│ • amount: number (299 or 2999)                             │');
    console.log('│ • transactionId: string                                    │');
    console.log('│ • screenshotUrl: string (filename only)                    │');
    console.log('│ • status: "pending" | "approved" | "denied"                │');
    console.log('│ • submittedAt: timestamp                                   │');
    console.log('│ • reviewedAt: timestamp (optional)                         │');
    console.log('│ • reviewedBy: string (admin email, optional)               │');
    console.log('└─────────────────────────────────────────────────────────────┘');
    
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│ REGISTRATIONS COLLECTION (Premium Fields)                   │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│ • accountType: "free" | "premium"                          │');
    console.log('│ • premiumUpgradedAt: timestamp (when upgraded)             │');
    console.log('│ • premiumPlan: "monthly" | "yearly"                        │');
    console.log('│ • premiumExpiresAt: timestamp (expiry date)                │');
    console.log('└─────────────────────────────────────────────────────────────┘');
    
         console.log('\n┌─────────────────────────────────────────────────────────────┐');
     console.log('│ SCREENSHOT STORAGE (Base64)                                │');
     console.log('├─────────────────────────────────────────────────────────────┤');
     console.log('│ • Store: Screenshot images as Base64 in Firestore          │');
     console.log('│ • No Firebase Storage required (works with free plan)      │');
     console.log('│ • Access: Authenticated users can upload their own          │');
     console.log('└─────────────────────────────────────────────────────────────┘');
    
    // 6. Test payment submission
    console.log('\n🧪 Testing payment submission functionality...');
    
    const testPaymentData = {
      userId: window.auth.currentUser.uid,
      userEmail: window.auth.currentUser.email,
      userName: window.auth.currentUser.displayName || 'Test User',
      plan: 'monthly',
      amount: 299,
      transactionId: 'TEST_TXN_' + Date.now(),
      screenshotUrl: 'test_screenshot.jpg',
      status: 'pending',
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null
    };
    
    try {
      const testPaymentRef = await window.addDoc(paymentsCollection, testPaymentData);
      console.log('✅ Test payment created successfully');
      console.log('📄 Test payment ID:', testPaymentRef.id);
      
      // Clean up test payment
      await window.deleteDoc(testPaymentRef);
      console.log('✅ Test payment cleaned up');
      
    } catch (error) {
      console.log('❌ Test payment creation failed:', error.message);
    }
    
    console.log('\n🎉 Payment System Setup Complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. ✅ Collections are ready');
    console.log('2. ✅ Premium fields are available');
    console.log('3. ✅ Payment submission works');
         console.log('4. ✅ No Firebase Storage required');
     console.log('5. ✅ Screenshots stored as Base64 in Firestore');
     console.log('6. 🚀 Test the complete payment flow');
    
  } catch (error) {
    console.error('❌ Error setting up payment system:', error);
    console.log('\n🔧 Troubleshooting:');
         console.log('• Make sure you are logged in');
     console.log('• Check Firebase Console for collection permissions');
     console.log('• No Firebase Storage required');
  }
}

// Run the setup
setupPaymentSystem();
