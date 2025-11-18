// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGm3bzsCxYSARcgVn41ta_EOut9fauWr0",
  authDomain: "ecommerce-74229.firebaseapp.com",
  projectId: "ecommerce-74229",
  storageBucket: "ecommerce-74229.firebasestorage.app",
  messagingSenderId: "47160479095",
  appId: "1:47160479095:web:335ba0e7c1562d6f7ea572",
  measurementId: "G-LPZHVZ1MBZ"
};

// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;