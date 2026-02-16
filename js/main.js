// main.js - Main Application Script
// main.js - Main Application Script
import { authSystem } from './auth.js';
import { DatabaseHelper } from './utils.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize database on first load
    await DatabaseHelper.initializeDatabase();
    
    // ... rest of your existing code ...
});
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle - FIXED: Check if elements exist
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && hamburger) {
            if (!event.target.closest('.nav-menu') && !event.target.closest('.hamburger')) {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetId = href;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                    if (hamburger) {
                        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Check auth state for protected pages
    const protectedPages = ['dashboard', 'task', 'create-task', 'withdraw', 'referral', 'leaderboard', 'profile'];
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    if (protectedPages.includes(currentPage)) {
        authSystem.checkAuthState().then(user => {
            if (!user) {
                window.location.href = 'login.html';
            }
        }).catch(error => {
            console.error('Auth check error:', error);
        });
    }

    // Notification system
    window.showNotification = function(message, type = 'info') {
        // Remove old notifications
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(notif => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        });
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            background-color: ${type === 'success' ? '#4CAF50' : 
                             type === 'error' ? '#f44336' : 
                             '#2196F3'};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1002;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            font-family: 'Poppins', sans-serif;
        `;
        
        const icon = type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Add animation styles if not present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    };

    // Format currency
    window.formatCurrency = function(amount) {
        if (isNaN(amount)) amount = 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    window.formatDate = function(dateString) {
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
    };

    // Short date format
    window.formatShortDate = function(dateString) {
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
    };

    // Debounce function
    window.debounce = function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Loader functions
    window.showLoader = function(element) {
        if (!element) return null;
        
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.style.cssText = `
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4a8d88;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        `;
        
        // Add spin animation if not present
        if (!document.querySelector('#loader-styles')) {
            const style = document.createElement('style');
            style.id = 'loader-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.appendChild(loader);
        return loader;
    };

    window.hideLoader = function(loader) {
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    };

    // Modal functions
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.zIndex = '1001';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Close modal when clicking outside or with Escape key
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal[style*="display: flex"]').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    // Logout functionality
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                await authSystem.logout();
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('Gagal logout: ' + error.message, 'error');
            }
        });
    });
});