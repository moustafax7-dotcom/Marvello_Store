// Theme Management - إدارة المظهر الليلي والنهاري

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme(this.theme);
        this.setupThemeToggle();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
        
        // تحديث أيقونة الزر
        this.updateThemeToggleIcon();
    }
    
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (this.theme === 'light') {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        }
    }
    
    getCurrentTheme() {
        return this.theme;
    }
}

// تهيئة مدير المظهر عند تحميل الصفحة
let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
});

// دالة مساعدة للوصول إلى مدير المظهر من أي مكان
function toggleTheme() {
    if (themeManager) {
        themeManager.toggleTheme();
    }
}

function getCurrentTheme() {
    return themeManager ? themeManager.getCurrentTheme() : 'light';
}
