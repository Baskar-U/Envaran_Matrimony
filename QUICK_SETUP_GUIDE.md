# Quick Setup Guide for Like Functionality

## 🚀 **Step 1: Run Browser Console Script**

1. **Open your application** at `localhost:3001`
2. **Log in** to your account
3. **Open browser console** (F12 → Console tab)
4. **Copy and paste** the entire content of `ultra-simple-setup.js` into the console
5. **Press Enter** to run the script

## 📋 **Step 2: Create Firebase Indexes**

Go to **Firebase Console** → **Firestore Database** → **Indexes** tab and create:

### Likes Collection Indexes:
- `likerId` (Ascending)
- `likedId` (Ascending)
- `createdAt` (Descending)
- `likerId` + `createdAt` (Composite)
- `likedId` + `createdAt` (Composite)

### Matches Collection Indexes:
- `user1Id` (Ascending)
- `user2Id` (Ascending)
- `createdAt` (Descending)
- `user1Id` + `createdAt` (Composite)
- `user2Id` + `createdAt` (Composite)

### Notifications Collection Indexes:
- `userId` (Ascending)
- `type` (Ascending)
- `read` (Ascending)
- `createdAt` (Descending)
- `userId` + `read` (Composite)
- `userId` + `createdAt` (Composite)

## 🔒 **Step 3: Update Security Rules**

In **Firebase Console** → **Firestore Database** → **Rules**, update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Likes collection
    match /likes/{likeId} {
      allow read: if request.auth != null && 
        (resource.data.likerId == request.auth.uid || 
         resource.data.likedId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.likerId == request.auth.uid;
      allow update, delete: if request.auth != null && 
        resource.data.likerId == request.auth.uid;
    }
    
    // Matches collection
    match /matches/{matchId} {
      allow read: if request.auth != null && 
        (resource.data.user1Id == request.auth.uid || 
         resource.data.user2Id == request.auth.uid);
      allow create: if request.auth != null && 
        (request.resource.data.user1Id == request.auth.uid || 
         request.resource.data.user2Id == request.auth.uid);
      allow update: if request.auth != null && 
        (resource.data.user1Id == request.auth.uid || 
         resource.data.user2Id == request.auth.uid);
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Registrations collection
    match /registrations/{registrationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🧪 **Step 4: Test the Functionality**

1. **Go to `/profiles`** page
2. **Click "Like"** on a profile
3. **Check button changes** to "Liked" (green)
4. **Go to `/matches`** page
5. **See liked profile** in "You Liked Profiles" tab

## ✅ **Success Indicators**

- ✅ Like button changes from blue "Like" to green "Liked"
- ✅ Liked profiles appear in matches page
- ✅ No console errors during like operations
- ✅ Collections exist in Firebase Console

## 🔧 **Troubleshooting**

If the console script doesn't work:

1. **Manual Setup**: Go to Firebase Console and manually create the collections
2. **Check Authentication**: Make sure you're logged in
3. **Check Console**: Look for error messages
4. **Verify Firebase Config**: Ensure Firebase is properly configured

## 📞 **Need Help?**

1. Check the detailed `LIKE_FUNCTIONALITY_SETUP.md` file
2. Look at the test scripts in the files
3. Check browser console for error messages
4. Verify Firebase Console setup

---

**Happy matching! 💕**
