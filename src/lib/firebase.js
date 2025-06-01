// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAK5pyV9bEF87hwu75U1TT7IBVl1ygXK74",
  authDomain: "habit-tracker-ap.firebaseapp.com",
  projectId: "habit-tracker-ap",
  storageBucket: "habit-tracker-ap.firebasestorage.app",
  messagingSenderId: "1011092602620",
  appId: "1:1011092602620:web:2eb757cb11c784074de179",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
