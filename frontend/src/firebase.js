import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDI4o3SWV5nXzgmupq3QC1nRsZRgistqds",
  authDomain: "ericsgarden-5476e.firebaseapp.com",
  projectId: "ericsgarden-5476e",
  storageBucket: "ericsgarden-5476e.firebasestorage.app",
  messagingSenderId: "202619240138",
  appId: "1:202619240138:web:6cc9398fb4d4ed857bbe33",
  measurementId: "G-P4XL4S9RWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);