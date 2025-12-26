
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDiSxtzNUvk8_f6QCBJxFwXPq_adm9kvXs",
  authDomain: "residence-el-arich.firebaseapp.com",
  projectId: "residence-el-arich",
  storageBucket: "residence-el-arich.firebasestorage.app",
  messagingSenderId: "1041962428288",
  appId: "1:1041962428288:web:cdd19726f53dae7ac44365",
  measurementId: "G-RDX59868QS"
};

// Initialize Firebase using the Compat SDK to ensure the default app 
// is shared correctly between Modular Auth and Compat Firestore.
// This fixes the issue where Firestore queries didn't see the authenticated user.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the default app's services
// Modular Auth (works with getAuth() consuming the default app)
export const auth = getAuth(); 

// Modular Analytics
export const analytics = getAnalytics();

// Compat Firestore (works with firebase.firestore() using the default app)
export const db = firebase.firestore();
