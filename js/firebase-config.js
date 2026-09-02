// firebase-config.js - Configuration for Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAK_m986n8_RflhMKgquEZSeTcc7EM3Zlk",
  authDomain: "dompetku-3ca75.firebaseapp.com",
  projectId: "dompetku-3ca75",
  storageBucket: "dompetku-3ca75.firebasestorage.app",
  messagingSenderId: "414654550059",
  appId: "1:414654550059:web:846d1da727c61c957dda6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export for use in other files
export { app, auth, db, storage, analytics };
