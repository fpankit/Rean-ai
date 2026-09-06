import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyCtgltMxX-No0Cpq-Jw1hXzKe5C3TmEr54",
  authDomain: "agora-7ef18.firebaseapp.com",
  projectId: "agora-7ef18",
  storageBucket: "agora-7ef18.firebasestorage.app",
  messagingSenderId: "288833212849",
  appId: "1:288833212849:web:2724c7c6c1997d20eaad90",
  measurementId: "G-LW93MVBSLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((err) => {
  console.warn("Analytics initialization skipped:", err);
});

export default app;
