import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDocs, 
    collection, 
    query, 
    where, 
    updateDoc, 
    increment, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Fungsi buat kode referral otomatis (Misal: RSY-ABCD)
const generateRefCode = () => "CRW-" + Math.random().toString(36).substring(2, 6).toUpperCase();

// Fungsi buat ID perangkat unik
const getDeviceId = () => {
    let id = localStorage.getItem('deviceId');
    if (!id) {
        id = 'dev-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('deviceId', id);
    }
    return id;
};

// OBJECT authSystem agar bisa dipanggil authSystem.register di HTML
export const authSystem = {
    // SESUAIKAN URUTAN: email, password, name, referralCode
    register: async (email, password, name, referralCode) => {
        try {
            const deviceId = getDeviceId();

            // 1. CEK 1 DEVICE 1 AKUN
            const qDevice = query(collection(db, "users"), where("deviceId", "==", deviceId));
            const deviceSnap = await getDocs(qDevice);
            if (!deviceSnap.empty) {
                throw new Error("Perangkat ini sudah terdaftar!");
            }

            // 2. BUAT AKUN DI AUTH
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 3. LOGIKA BONUS REFERRAL (DIBERIKAN KE PENGUNDANG)
            if (referralCode) {
                const qRef = query(collection(db, "users"), where("referralCode", "==", referralCode));
                const refSnap = await getDocs(qRef);

                if (!refSnap.empty) {
                    const inviterDoc = refSnap.docs[0];
                    const inviterRef = doc(db, "users", inviterDoc.id);

                    // Pengundang dapet Rp 1.000
                    await updateDoc(inviterRef, {
                        balance: increment(1000),
                        referralEarnings: increment(1000),
                        totalReferrals: increment(1)
                    });
                }
            }

            // 4. SIMPAN DATA USER BARU KE FIRESTORE
            await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: name,
    email: email,
    isAdmin: false,                  // WAJIB ADA: default bukan admin
    isBanned: false,                 // Tambahan keamanan
    isOnline: true,
    balance: 5000,                   
    pendingBalance: 0,               // Penting untuk fitur withdraw
    totalEarned: 5000,
    totalWithdrawn: 0,               // Biar dashboard gak error NaN
    referralCode: generateRefCode(),
    referredBy: referralCode || "",  // Samakan dengan data manual (bukan invitedBy)
    referralCount: 0,                // Samakan dengan data manual
    totalReferralEarnings: 0,        // Samakan dengan data manual
    accountLevel: "basic",
    completedTasks: 0,
    totalTasks: 0,
    dailyStreak: 0,
    deviceId: deviceId || "",
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),    // Tambahkan track login terakhir
    lastCheckin: null
});

            return { success: true };
        } catch (error) {
            console.error("Gagal Daftar:", error);
            throw error;
        }
    }
};

// --- FUNGSI LOGIN ---
export const loginUser = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        throw error;
    }
};