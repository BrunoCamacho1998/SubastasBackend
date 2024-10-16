// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyADQ1FTZ26IT_P8hYZNZXadgoDXqvavJtE",
  authDomain: "subasta-afe97.firebaseapp.com",
  projectId: "subasta-afe97",
  storageBucket: "subasta-afe97.appspot.com",
  messagingSenderId: "32372181008",
  appId: "1:32372181008:web:1229fbce86d27ee0456295"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

export default db;