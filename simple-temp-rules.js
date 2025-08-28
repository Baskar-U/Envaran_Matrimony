// SIMPLE TEMPORARY FIREBASE RULES
// Copy and paste this into Firebase Console > Firestore Database > Rules
// This will allow all authenticated users to read/write all collections

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
