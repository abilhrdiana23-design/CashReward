// firebase-config.js - Configuration for Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuLxv-AA8CQE4-ObFQahgLZ1RlCfAk_c4",
  authDomain: "quick-taks-web.firebaseapp.com",
  projectId: "quick-taks-web",
  storageBucket: "quick-taks-web.firebasestorage.app",
  messagingSenderId: "730716150941",
  appId: "1:730716150941:web:493b5c787e3a10624b4874"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export for use in other files
export { app, auth, db, storage, analytics };