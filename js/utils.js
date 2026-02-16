// utils.js - Utility Functions
import { db } from './firebase-config.js';
import { collection, getDocs, getDoc, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class DatabaseHelper {
    static async initializeDatabase() {
        try {
            // Check if config exists
            const configDoc = await getDoc(doc(db, 'system_config', 'app_config'));
            
            if (!configDoc.exists()) {
                // Create default config
                await setDoc(doc(db, 'system_config', 'app_config'), {
                    minWithdrawal: 30000,
                    maxWithdrawal: 10000000,
                    referralBonus: 1000,
                    dailyCheckinBase: 200,
                    taskCommission: 0,
                    maintenanceMode: false,
                    updatedAt: new Date().toISOString()
                });
                console.log('Default config created');
            }
            
            // Check if sample tasks exist
            const tasksSnapshot = await getDocs(collection(db, 'tasks'));
            if (tasksSnapshot.empty) {
                await this.createSampleTasks();
            }
            
            console.log('Database initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing database:', error);
            return false;
        }
    }
    
    static async createSampleTasks() {
        const sampleTasks = [
            {
                title: "Follow Instagram @rewardsharey",
                description: "Follow Instagram official RewardSharey dan like 3 postingan terbaru",
                type: "follow",
                reward: 5000,
                totalSlots: 100,
                availableSlots: 100,
                difficulty: "easy",
                instructions: "1. Follow Instagram @rewardsharey\n2. Like 3 postingan terbaru\n3. Screenshot bukti follow dan like",
                proofType: "screenshot",
                status: "active",
                createdBy: "system",
                depositRequired: false,
                depositAmount: 0,
                createdAt: new Date().toISOString()
            },
            {
                title: "Download Aplikasi Shopee",
                description: "Download aplikasi Shopee dari Play Store/App Store",
                type: "download",
                reward: 10000,
                totalSlots: 50,
                availableSlots: 50,
                difficulty: "easy",
                instructions: "1. Download aplikasi Shopee\n2. Register akun baru\n3. Screenshot halaman beranda aplikasi",
                proofType: "screenshot",
                status: "active",
                createdBy: "system",
                depositRequired: false,
                depositAmount: 0,
                createdAt: new Date().toISOString()
            },
            {
                title: "Like Facebook Page RewardSharey",
                description: "Like Facebook page RewardSharey dan comment 'Mantap!'",
                type: "like",
                reward: 3000,
                totalSlots: 200,
                availableSlots: 200,
                difficulty: "easy",
                instructions: "1. Like Facebook page RewardSharey\n2. Comment 'Mantap!' di postingan terbaru\n3. Screenshot bukti like dan comment",
                proofType: "screenshot",
                status: "active",
                createdBy: "system",
                depositRequired: false,
                depositAmount: 0,
                createdAt: new Date().toISOString()
            },
            {
                title: "Subscribe YouTube Channel",
                description: "Subscribe YouTube channel teknologi dan like 2 video",
                type: "follow",
                reward: 8000,
                totalSlots: 75,
                availableSlots: 75,
                difficulty: "medium",
                instructions: "1. Subscribe channel teknologi populer\n2. Like 2 video terbaru\n3. Screenshot bukti subscribe dan like",
                proofType: "screenshot",
                status: "active",
                createdBy: "system",
                depositRequired: false,
                depositAmount: 0,
                createdAt: new Date().toISOString()
            },
            {
                title: "Review Aplikasi di Play Store",
                description: "Beri rating 5 bintang dan review untuk aplikasi populer",
                type: "review",
                reward: 15000,
                totalSlots: 30,
                availableSlots: 30,
                difficulty: "medium",
                instructions: "1. Cari aplikasi populer di Play Store\n2. Beri rating 5 bintang\n3. Tulis review minimal 20 kata\n4. Screenshot bukti review",
                proofType: "screenshot",
                status: "active",
                createdBy: "system",
                depositRequired: false,
                depositAmount: 0,
                createdAt: new Date().toISOString()
            }
        ];
        
        try {
            for (const task of sampleTasks) {
                await addDoc(collection(db, 'tasks'), task);
            }
            console.log('Sample tasks created successfully');
        } catch (error) {
            console.error('Error creating sample tasks:', error);
        }
    }
    
    static async getConfig() {
        try {
            const configDoc = await getDoc(doc(db, 'system_config', 'app_config'));
            if (configDoc.exists()) {
                return configDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error getting config:', error);
            return null;
        }
    }
    
    static async updateConfig(data) {
        try {
            await updateDoc(doc(db, 'system_config', 'app_config'), {
                ...data,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('Error updating config:', error);
            return false;
        }
    }
}

// Format currency helper
export function formatCurrency(amount) {
    if (isNaN(amount)) amount = 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date helper
export function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format short date
export function formatShortDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get task type label
export function getTaskTypeLabel(type) {
    const labels = {
        'follow': 'Follow Social Media',
        'like': 'Like & Comment',
        'download': 'Download App',
        'review': 'Review & Rating',
        'survey': 'Survey',
        'other': 'Lainnya'
    };
    return labels[type] || 'Lainnya';
}

// Get task type icon
export function getTaskTypeIcon(type) {
    const icons = {
        'follow': 'fa-user-plus',
        'like': 'fa-thumbs-up',
        'download': 'fa-download',
        'review': 'fa-star',
        'survey': 'fa-clipboard-list',
        'other': 'fa-tasks'
    };
    return icons[type] || 'fa-tasks';
}

// Validate email
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Debounce function
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}