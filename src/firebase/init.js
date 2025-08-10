// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore} from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB15gVYLqAzaP1leCS2n0akHm8buVPyLg8",
  authDomain: "week-9d00a.firebaseapp.com",
  projectId: "week-9d00a",
  storageBucket: "week-9d00a.firebasestorage.app",
  messagingSenderId: "644601183356",
  appId: "1:644601183356:web:f6cf6e64f324f00e785df9"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const  db = getFirestore();
export default db;
