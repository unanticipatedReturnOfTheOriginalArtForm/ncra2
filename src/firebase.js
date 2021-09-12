import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyA_FNXkB6jETM3WY8-Knj1cXgLAnYRbxZE",
  authDomain: "ncra-44907.firebaseapp.com",
  projectId: "ncra-44907",
  storageBucket: "ncra-44907.appspot.com",
  messagingSenderId: "83420188718",
  appId: "1:83420188718:web:13c18482d124a43df40fbf"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig); // For the LOVE of Amitābha

export const db = firebase.firestore();
export const auth = firebase.auth();
export default firebase;