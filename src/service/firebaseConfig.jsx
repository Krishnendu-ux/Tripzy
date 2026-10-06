// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYkArr4GLvXc5yKMYDblDgghrZ_IrejxY",
  authDomain: "ai-travel-planner-d531b.firebaseapp.com",
  projectId: "ai-travel-planner-d531b",
  storageBucket: "ai-travel-planner-d531b.firebasestorage.app",
  messagingSenderId: "778608957053",
  appId: "1:778608957053:web:494aa53f3266a4c8288314",
  measurementId: "G-85S3XQNR02"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);