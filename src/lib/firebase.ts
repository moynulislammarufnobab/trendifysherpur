import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
// User-provided custom Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc1yQ9_hzKmdB1r8QP_yHZmylVdQQ5lrA",
  authDomain: "trendy-156cb.firebaseapp.com",
  projectId: "trendy-156cb",
  storageBucket: "trendy-156cb.firebasestorage.app",
  messagingSenderId: "595823018131",
  appId: "1:595823018131:web:e6f6af241646cb07b68d66",
  measurementId: "G-Z3HQ2BGXG5"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
};
export type { FirebaseUser };
