import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDiSxtzNUvk8_f6QCBJxFwXPq_adm9kvXs",
  authDomain: "residence-el-arich.firebaseapp.com",
  projectId: "residence-el-arich",
  storageBucket: "residence-el-arich.firebasestorage.app",
  messagingSenderId: "1041962428288",
  appId: "1:1041962428288:web:cdd19726f53dae7ac44365",
  measurementId: "G-RDX59868QS"
};

// Initialize Firebase using the Compat SDK.
// We capture the 'app' instance explicitly to pass it to Modular SDKs.
let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

// 1. Authentication (Modular SDK with explicit app instance)
export const auth = getAuth(app); 

// 2. Analytics (Compat SDK)
// We handle potential errors (like ad-blockers) gracefully in App.tsx
export const analytics = firebase.analytics();

// 3. Firestore (Compat SDK for legacy syntax support: db.collection...)
// This automatically uses the default app initialized above
export const db = firebase.firestore();