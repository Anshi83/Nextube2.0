// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth ,GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_y6rU41imbEvEKsP2WU1ycsIuUFGn1v8",
  authDomain: "nextube-84bcf.firebaseapp.com",
  projectId: "nextube-84bcf",
  storageBucket: "nextube-84bcf.firebasestorage.app",
  messagingSenderId: "605129749746",
  appId: "1:605129749746:web:8f5db43c864d6cfb53cc6b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };