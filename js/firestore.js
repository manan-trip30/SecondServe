import { db } from './firebase.js';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

// User Collection
const usersCollection = collection(db, 'users');

// Save user data to Firestore
export const saveUserData = async (userId, userData) => {
  try {
    await setDoc(doc(usersCollection, userId), {
      ...userData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving user data:', error);
    return { success: false, error: error.message };
  }
};

// Get user data from Firestore
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(usersCollection, userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return { success: false, error: error.message };
  }
};

// Donations Collection
const donationsCollection = collection(db, 'donations');

// Create a new donation listing
export const createDonation = async (donationData) => {
  try {
    const docRef = await addDoc(donationsCollection, {
      ...donationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'available' // available, pending, completed, expired
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating donation:', error);
    return { success: false, error: error.message };
  }
};

// Get user's donations
export const getUserDonations = async (userId, status = null) => {
  try {
    let q;
    
    if (status) {
      q = query(
        donationsCollection,
        where('userId', '==', userId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        donationsCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const donations = [];
    
    querySnapshot.forEach((doc) => {
      donations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, donations };
  } catch (error) {
    console.error('Error getting user donations:', error);
    return { success: false, error: error.message };
  }
};

// Update a donation
export const updateDonation = async (donationId, updateData) => {
  try {
    await updateDoc(doc(donationsCollection, donationId), {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating donation:', error);
    return { success: false, error: error.message };
  }
};

// Delete a donation
export const deleteDonation = async (donationId) => {
  try {
    await deleteDoc(doc(donationsCollection, donationId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting donation:', error);
    return { success: false, error: error.message };
  }
};

// Get available donations (for receivers)
export const getAvailableDonations = async (limit = 20) => {
  try {
    const q = query(
      donationsCollection,
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const donations = [];
    
    querySnapshot.forEach((doc) => {
      donations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, donations };
  } catch (error) {
    console.error('Error getting available donations:', error);
    return { success: false, error: error.message };
  }
}; 