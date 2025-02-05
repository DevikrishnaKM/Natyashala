// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_sIMg1UQuf7Cu_Vw6wt_5wa901E9JyDE",
  authDomain: "natyashala-937cf.firebaseapp.com",
  projectId: "natyashala-937cf",
  storageBucket: "natyashala-937cf.firebasestorage.app",
  messagingSenderId: "961142944680",
  appId: "1:961142944680:web:055f65a627e9d14ab9239d"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
