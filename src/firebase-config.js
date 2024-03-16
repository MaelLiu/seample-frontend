// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQY3eI0P73ZBFdT2hL-q2UDMdhFlB7wsU",
  authDomain: "seample-education.firebaseapp.com",
  projectId: "seample-education",
  storageBucket: "seample-education.appspot.com",
  messagingSenderId: "716265175870",
  appId: "1:716265175870:web:b07f7c0c0e22a010d00a6f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);