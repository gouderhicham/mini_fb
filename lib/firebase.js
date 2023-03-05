import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getApps } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBDvZpztrbpK82n-l3hQ-yPxshOVK5SOxg",
  authDomain: "next-app-68f03.firebaseapp.com",
  databaseURL:
    "https://next-app-68f03-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "next-app-68f03",
  storageBucket: "next-app-68f03.appspot.com",
  messagingSenderId: "590476262730",
  appId: "1:590476262730:web:71ba6e41c9d4763e2a95b3",
  measurementId: "G-Y700Y16M2S",
};
const apps = getApps();
if (!apps.length) {
  initializeApp(firebaseConfig);
}
const app = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const fsDB = getFirestore(app);
export const storage = getStorage(app);