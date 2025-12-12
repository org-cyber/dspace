import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCdMK8-vf7z7cg8O7PpD17_7cTtx5GuONc",
    authDomain: "podchat-66bed.firebaseapp.com",
    databaseURL: "https://podchat-66bed-default-rtdb.firebaseio.com",
    projectId: "podchat-66bed",
    storageBucket: "podchat-66bed.firebasestorage.app",
    messagingSenderId: "535144486092",
    appId: "1:535144486092:web:b93f4eb277c2496162de69",
    measurementId: "G-LJ7QPRDM9N"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// NOTE: For this hackathon demo, ensure your Firebase Realtime Database Rules allow public access:
// {
//   "rules": {
//     ".read": true,
//     ".write": true
//   }
// }
//
// For production, implement proper authentication and security rules.
