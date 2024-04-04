// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cms-atria.firebaseapp.com",
  projectId: "cms-atria",
  storageBucket: "cms-atria.appspot.com",
  messagingSenderId: "294845410102",
  appId: "1:294845410102:web:9d144be96fafe4fab16197",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
