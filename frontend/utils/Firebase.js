import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "logintrendies.firebaseapp.com",
  projectId: "logintrendies",
  storageBucket: "logintrendies.firebasestorage.app",
  messagingSenderId: "957487765799",
  appId: "1:957487765799:web:f55afb20d6c7407533b102"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};