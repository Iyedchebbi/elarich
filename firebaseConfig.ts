
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

// Initialize modular SDK components
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Initialize compat app for Firestore to resolve "no exported member" errors
// We use a named app instance to avoid conflict with the default modular app
let compatApp;
try {
  compatApp = firebase.app('compat-firestore');
} catch {
  compatApp = firebase.initializeApp(firebaseConfig, 'compat-firestore');
}

export const db = compatApp.firestore();
