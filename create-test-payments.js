// Create Test Payments - Manual Testing
console.log('🧪 Creating Test Payments...');

async function createTestPayments() {
  try {
    console.log('📋 Checking Firebase availability...');
    
    if (!window.db || !window.collection || !window.addDoc) {
      console.log('❌ Firebase functions not available');
      return;
    }
    
    console.log('✅ Firebase functions available');
    
    // Check if user is logged in
    if (!window.auth || !window.auth.currentUser) {
      console.log('❌ No user logged in');
      return;
    }
    
    console.log('✅ User logged in:', window.auth.currentUser.email);
    
    // Create test payments
    const testPayments = [
      {
        userId: 'test-user-1',
        userEmail: 'test1@example.com',
        userName: 'Test User 1',
        plan: 'monthly',
        amount: 299,
        transactionId: 'TXN_' + Date.now() + '_1',
        screenshotUrl: 'test-screenshot-1.jpg',
        screenshotBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        status: 'pending',
        submittedAt: new Date(),
        reviewedAt: null,
        reviewedBy: null
      },
      {
        userId: 'test-user-2',
        userEmail: 'test2@example.com',
        userName: 'Test User 2',
        plan: 'yearly',
        amount: 2999,
        transactionId: 'TXN_' + Date.now() + '_2',
        screenshotUrl: 'test-screenshot-2.jpg',
        screenshotBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        status: 'approved',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        reviewedAt: new Date(),
        reviewedBy: 'admin@example.com'
      },
      {
        userId: 'test-user-3',
        userEmail: 'test3@example.com',
        userName: 'Test User 3',
        plan: 'monthly',
        amount: 299,
        transactionId: 'TXN_' + Date.now() + '_3',
        screenshotUrl: 'test-screenshot-3.jpg',
        screenshotBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        status: 'denied',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        reviewedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        reviewedBy: 'admin@example.com'
      }
    ];
    
    console.log('📝 Creating test payments...');
    
    const paymentsCollection = window.collection(window.db, 'payments');
    
    for (let i = 0; i < testPayments.length; i++) {
      const payment = testPayments[i];
      try {
        const docRef = await window.addDoc(paymentsCollection, payment);
        console.log(`✅ Created payment ${i + 1}:`, {
          id: docRef.id,
          user: payment.userName,
          plan: payment.plan,
          amount: payment.amount,
          status: payment.status
        });
      } catch (error) {
        console.log(`❌ Failed to create payment ${i + 1}:`, error.message);
      }
    }
    
    console.log('\n🎉 Test payments creation complete!');
    console.log('📋 Next steps:');
    console.log('1. Refresh the payments page');
    console.log('2. Click "Refresh Payments" button');
    console.log('3. You should see 3 test payments');
    console.log('4. Check the console for debug info');
    
  } catch (error) {
    console.error('❌ Error creating test payments:', error);
    console.log('💡 Error details:', error.message);
  }
}

// Run the test
createTestPayments();
