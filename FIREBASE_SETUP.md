# Firebase Backend Setup for SecondServe

This document explains how to set up the Firebase backend for the SecondServe food surplus management website.

## Prerequisites

- Node.js and npm installed
- A Google account to create a Firebase project

## Firebase Setup Steps

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the prompts to create a new project
   - Enter a name for your project (e.g., "SecondServe")
   - Enable Google Analytics if desired
   - Click "Create project"

2. **Register your app with Firebase**
   - In the Firebase console, click the web icon (`</>`)
   - Enter a nickname for your app (e.g., "SecondServe Web")
   - Register the app

3. **Copy your Firebase configuration**
   - After registering, Firebase will display your app's configuration
   - Copy the configuration values (apiKey, authDomain, projectId, etc.)

4. **Update your `.env` file**
   - Open the `.env` file in your project
   - Replace the placeholder values with your actual Firebase configuration:

   ```
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

5. **Enable Authentication Methods**
   - In the Firebase console, go to "Authentication" > "Sign-in method"
   - Enable "Email/Password" authentication
   - Enable "Google" authentication
   - If using Facebook authentication, enable that too and follow the setup instructions

6. **Set up Firestore Database**
   - In the Firebase console, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in production mode" or "Start in test mode" (for development)
   - Select a location closest to your users
   - Create the database

7. **Set up Firebase Storage (optional, for images)**
   - In the Firebase console, go to "Storage"
   - Click "Get started"
   - Follow the setup wizard

## Firebase Security Rules

### Firestore Security Rules

Create rules to secure your Firestore database:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Donations - providers can create and manage their donations
    match /donations/{donationId} {
      allow read: if true; // Anyone can see available donations
      allow create: if request.auth != null; // Logged-in users can create
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Security Rules (if using Storage)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /donations/{donationId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    (request.resource.metadata.userId == request.auth.uid ||
                     resource.metadata.userId == request.auth.uid);
    }
  }
}
```

## Running the Project

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Features Implemented

The Firebase backend implementation includes:

- User authentication (login, signup, logout)
- Email/password authentication
- Google authentication
- Facebook authentication
- User profile storage in Firestore
- Protected routes (dashboard requires authentication)
- Automatic redirection for logged-in users
- User session management 