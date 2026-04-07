import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBUN9UbDnsD0K5E5DxGpGaoQs2xpLnNayE",
  authDomain: "elite-by-s.firebaseapp.com",
  projectId: "elite-by-s",
  storageBucket: "elite-by-s.firebasestorage.app",
  messagingSenderId: "911900427556",
  appId: "1:911900427556:web:230e73ea3b3d1c0db51fb1"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

export const initMessaging = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getMessaging(app);
  }
  return null;
};
