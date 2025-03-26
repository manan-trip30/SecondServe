import { auth } from './firebase.js';

// Check if user is logged in
export const checkAuthState = (onAuthSuccess, onAuthFailure) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      if (onAuthSuccess) onAuthSuccess(user);
    } else {
      // User is signed out
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Auth protection for pages
export const protectPage = () => {
  checkAuthState(
    // Success callback - user is authenticated
    (user) => {
      console.log('User is authenticated:', user.email);
    },
    // Failure callback - user is not authenticated
    () => {
      console.log('User is not authenticated, redirecting to login');
      window.location.href = 'login.html';
    }
  );
};

// Auth redirect for logged-in users (from login/signup pages)
export const redirectIfAuthenticated = (redirectPath = 'dashboard.html') => {
  checkAuthState(
    // Success callback - user is authenticated
    () => {
      console.log('User is already authenticated, redirecting');
      window.location.href = redirectPath;
    },
    // Failure callback - user is not authenticated (do nothing)
    () => {
      console.log('User is not authenticated, staying on login/signup page');
    }
  );
}; 