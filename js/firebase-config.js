// firebase-config.js - Configuration for Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1LTeVKZGUbBHq8iXxOX-OVcp1iMG64y0",
  authDomain: "cash-reward-2fcb1.firebaseapp.com",
  projectId: "cash-reward-2fcb1",
  storageBucket: "cash-reward-2fcb1.firebasestorage.app",
  messagingSenderId: "254447222132",
  appId: "1:254447222132:web:058304f9b4deeb4c8b4021"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export for use in other files
export { app, auth, db, storage, analytics };
