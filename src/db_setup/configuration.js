// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCPFIb5D3DKd4gyxnLqNoG5zQ8-Jzpp1NA",
  authDomain: "todo-d247d.firebaseapp.com",
  databaseURL: "https://todo-d247d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todo-d247d",
  storageBucket: "todo-d247d.firebasestorage.app",
  messagingSenderId: "261175365610",
  appId: "1:261175365610:web:0538dff138548a2783ec93",
  measurementId: "G-5VE6CHFC20"
};


const app = initializeApp(firebaseConfig);

export default app;