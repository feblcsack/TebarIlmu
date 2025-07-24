

// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyAZYCpodZsxfg34xbp6vyCHggEI54ISZoE",

  authDomain: "tebarilmu-2ef10.firebaseapp.com",

  projectId: "tebarilmu-2ef10",

  storageBucket: "tebarilmu-2ef10.firebasestorage.app",

  messagingSenderId: "856189030746",

  appId: "1:856189030746:web:249bbfb0d439ee67d02363"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// Import the functions you need from the SDKs you need
