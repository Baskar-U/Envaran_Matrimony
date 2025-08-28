// CORRECTED FIREBASE SECURITY RULES
// Copy and paste this into Firebase Console > Firestore Database > Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read and write their own profiles
    match /profiles/{profileId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow authenticated users to read all profiles (for browsing)
    match /profiles/{profileId} {
      allow read: if request.auth != null;
    }
    
    // Allow authenticated users to manage their own registrations
    match /registrations/{registrationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow authenticated users to read all registrations (for profile viewing)
    match /registrations/{registrationId} {
      allow read: if request.auth != null;
    }
    
    // Allow authenticated users to manage their own likes
    match /likes/{likeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.likerId;
    }
    
    // Allow authenticated users to read likes (for notifications and matches)
    match /likes/{likeId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.likerId || 
        request.auth.uid == resource.data.likedId  // ✅ CORRECTED FIELD NAME
      );
    }
    
    // Allow authenticated users to manage their own matches
    match /matches/{matchId} {
      allow read, write: if request.auth != null && (
        request.auth.uid == resource.data.user1Id || 
        request.auth.uid == resource.data.user2Id
      );
    }
    
    // Allow authenticated users to manage their own notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Default rule - deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
