# Like Functionality Setup Guide

This guide explains how to set up and use the like functionality in your SecondChance matrimony application.

## 🎯 Overview

The like functionality allows users to:
- **Like profiles** they're interested in
- **See liked profiles** in their matches page
- **Get notifications** when someone likes them
- **Create mutual matches** when both users like each other
- **View button state changes** (Like → Liked with green color)

## 📋 Required Firebase Collections

The like system requires these Firebase Firestore collections:

### 1. `likes` Collection
Stores all like interactions between users.

**Document Structure:**
```javascript
{
  id: "auto-generated-id",
  likerId: "user-who-liked-id",
  likedId: "user-who-was-liked-id", 
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. `matches` Collection
Stores mutual matches when both users like each other.

**Document Structure:**
```javascript
{
  id: "auto-generated-id",
  user1Id: "first-user-id",
  user2Id: "second-user-id",
  createdAt: timestamp,
  updatedAt: timestamp,
  status: "active" // active, archived, etc.
}
```

### 3. `notifications` Collection
Stores notifications for likes and matches.

**Document Structure:**
```javascript
{
  id: "auto-generated-id",
  userId: "user-who-receives-notification-id",
  type: "like", // like, match, message, etc.
  data: {
    likerId: "user-who-liked-id",
    likerName: "John Doe",
    likerProfileImage: "https://example.com/image.jpg"
  },
  read: false,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🚀 Setup Instructions

### Step 1: Run the Setup Script

1. **Update Firebase Config**: Edit `setup-like-collections.js` and replace the Firebase config with your actual project details.

2. **Install Dependencies**: Make sure you have Firebase SDK installed:
   ```bash
   npm install firebase
   ```

3. **Run Setup Script**:
   ```bash
   node setup-like-collections.js
   ```

### Step 2: Create Firestore Indexes

Go to Firebase Console > Firestore Database > Indexes tab and create these indexes:

#### Likes Collection Indexes:
- `likerId` (Ascending)
- `likedId` (Ascending) 
- `createdAt` (Descending)
- `likerId` (Ascending) + `createdAt` (Descending)
- `likedId` (Ascending) + `createdAt` (Descending)

#### Matches Collection Indexes:
- `user1Id` (Ascending)
- `user2Id` (Ascending)
- `createdAt` (Descending)
- `user1Id` (Ascending) + `createdAt` (Descending)
- `user2Id` (Ascending) + `createdAt` (Descending)

#### Notifications Collection Indexes:
- `userId` (Ascending)
- `type` (Ascending)
- `read` (Ascending)
- `createdAt` (Descending)
- `userId` (Ascending) + `read` (Ascending)
- `userId` (Ascending) + `createdAt` (Descending)
- `userId` (Ascending) + `type` (Ascending) + `createdAt` (Descending)

### Step 3: Update Security Rules

In Firebase Console > Firestore Database > Rules, update your security rules:

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
    
    // Registrations collection (for profile data)
    match /registrations/{registrationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🧪 Testing the Functionality

### Step 1: Run Test Script

1. **Update Firebase Config**: Edit `test-like-functionality.js` with your Firebase config.

2. **Run Test**:
   ```bash
   node test-like-functionality.js
   ```

This will:
- Create test likes between users
- Verify like checking functionality
- Test mutual match detection
- Show button state simulations

### Step 2: Manual Testing

1. **Like a Profile**: Go to `/profiles` and click "Like" on a profile
2. **Check Button State**: The button should change to "Liked" with green color
3. **Check Matches Page**: Go to `/matches` and see the liked profile in "You Liked Profiles" tab
4. **Test Mutual Match**: If the other user also likes you, it should appear in "Your Matches" tab

## 🎨 How It Works

### Like Button States

The like button has these states:

1. **Loading**: Shows "Loading..." while checking if already liked
2. **Like**: Blue button with "Like" text (not liked yet)
3. **Liking**: Shows "Liking..." while processing the like
4. **Liked**: Green button with "Liked" text and filled heart icon

### Like Flow

1. **User clicks "Like"** on a profile card
2. **System checks** if user already liked this profile
3. **Creates like record** in `likes` collection
4. **Sends notification** to the liked user
5. **Checks for mutual like** and creates match if both users like each other
6. **Updates UI** to show "Liked" state
7. **Refreshes matches page** to show the liked profile

### Match Detection

When User A likes User B:
1. System checks if User B has already liked User A
2. If yes, creates a match record in `matches` collection
3. Sends match notifications to both users
4. Shows match in "Your Matches" tab (Premium feature)

## 📱 User Experience

### Free Users
- Can like profiles
- Can view profiles they've liked in "You Liked Profiles" tab
- Cannot view mutual matches (Premium feature)

### Premium Users  
- All free features
- Can view mutual matches in "Your Matches" tab
- Priority profile visibility

## 🔧 Troubleshooting

### Common Issues

1. **Button not changing to "Liked"**:
   - Check if Firebase collections are created
   - Verify security rules allow read/write
   - Check browser console for errors

2. **Liked profiles not showing in matches**:
   - Verify `getLikedProfiles` function is working
   - Check if user is authenticated
   - Ensure proper data structure in collections

3. **Notifications not working**:
   - Check notifications collection exists
   - Verify notification creation in Firebase functions
   - Check security rules for notifications

### Debug Steps

1. **Check Firebase Console**: Look for errors in Firestore logs
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Verify API calls are successful
4. **Test Script**: Run `test-like-functionality.js` to verify setup

## 📞 Support

If you encounter issues:

1. **Check the test script output** for detailed error messages
2. **Verify Firebase configuration** is correct
3. **Ensure all collections and indexes** are created
4. **Check security rules** are properly configured

## 🎉 Success Indicators

You'll know the like functionality is working when:

✅ Like button changes from blue "Like" to green "Liked"  
✅ Liked profiles appear in "You Liked Profiles" tab  
✅ Notifications are received when someone likes you  
✅ Mutual matches appear in "Your Matches" tab (Premium)  
✅ No console errors during like operations  
✅ Test script runs successfully without errors  

---

**Happy matching! 💕**
