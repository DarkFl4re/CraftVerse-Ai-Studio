import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyCBwnzrybZih8gyp5cZn8JuXf2fccvUqqM',
  authDomain: 'craftverse-app.firebaseapp.com',
  projectId: 'craftverse-app',
  storageBucket: 'craftverse-app.firebasestorage.app',
  messagingSenderId: '362787782858',
  appId: '1:362787782858:web:9865ea2a77934ecd97f433',
};

let app;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseAvailable = false;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch(() => {});
  isFirebaseAvailable = true;
} catch (err) {
  console.warn('Firebase initialization warning (using local fallback engine):', err);
}

export {
  app,
  db,
  auth,
  isFirebaseAvailable,
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
};
