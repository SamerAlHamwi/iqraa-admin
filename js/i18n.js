/* ═══════════════════════════════════════════
   I18N - LOCALIZATION SYSTEM
═══════════════════════════════════════════ */

const translations = {
    ar: {
        // App
        app_name: "منصة اقرأ",
        app_sub: "لوحة الإدارة",

        // Navigation
        nav_dashboard: "لوحة التحكم",
        nav_reports: "التقارير والإحصاء",
        nav_classes: "الصفوف الدراسية",
        nav_grade_groups: "المراحل التعليمية",
        nav_grades: "الصفوف",
        nav_subjects: "المواد الدراسية",
        nav_teachers: "المدرسون",
        nav_videos: "الفيديوهات",
        nav_subscriptions: "الاشتراكات",
        nav_codes: "إدارة الأكواد",
        nav_code_reqs: "طلبات الأكواد",
        nav_students: "الطلاب",
        nav_notifications: "الإشعارات",
        nav_parents: "أولياء الأمور",
        nav_ratings: "التقييم الأسبوعي",
        nav_uni: "التعليم الجامعي",
        nav_uni_overview: "نظرة عامة",
        nav_uni_colleges: "الكليات",
        nav_uni_subjects: "المواد الجامعية",
        nav_uni_teachers: "الأساتذة الجامعيون",
        nav_uni_videos: "فيديوهات الجامعة",
        nav_ecourses: "الدورات الإلكترونية",

        // UI Elements
        search_placeholder: "ابحث عن مادة، مدرس، أو درس...",
        admin_mode: "الإدارة",
        admin_name: "مدير النظام",
        admin_role: "Administrator",
        add_new: "إضافة جديد",
        export_report: "تصدير التقرير",
        logout: "تسجيل الخروج",

        // Dashboard
        db_welcome: "مرحباً بك في منصة اقرأ التعليمية — العراق 🇮🇶",
        db_total_students: "إجمالي الطلاب",
        db_active_subs: "المشتركون النشطون",
        db_total_revenue: "الإيرادات (دينار)",
        db_total_videos: "إجمالي الفيديوهات",
        db_most_viewed: "أكثر المواد مشاهدةً",
        db_recent_subs: "آخر المشتركين",
        db_recent_activity: "آخر النشاطات",

        // Login
        login_title: "لوحة الإدارة",
        login_sub: "سجل دخولك للمتابعة إلى المنصة",
        login_user_label: "اسم المستخدم أو البريد الإلكتروني",
        login_pass_label: "كلمة المرور",
        login_remember: "تذكرني",
        login_forgot: "نسيت كلمة المرور؟",
        login_btn: "دخول النظام",
        login_footer: "ليس لديك حساب؟ تواصل مع الدعم الفني",

        // Toasts & Alerts
        toast_login_success: "تم تسجيل الدخول بنجاح",
        toast_login_error: "خطأ في اسم المستخدم أو كلمة المرور",
        toast_logout: "جاري تسجيل الخروج...",
        toast_day_mode: "وضع نهاري",
        toast_night_mode: "وضع ليلي"
    },
    en: {
        // App
        app_name: "IQRAA Platform",
        app_sub: "Admin Panel",

        // Navigation
        nav_dashboard: "Dashboard",
        nav_reports: "Reports & Stats",
        nav_classes: "Classes",
        nav_grade_groups: "Edu Stages",
        nav_grades: "Grades",
        nav_subjects: "Subjects",
        nav_teachers: "Teachers",
        nav_videos: "Videos",
        nav_subscriptions: "Subscriptions",
        nav_codes: "Codes Management",
        nav_code_reqs: "Code Requests",
        nav_students: "Students",
        nav_notifications: "Notifications",
        nav_parents: "Parents",
        nav_ratings: "Weekly Rating",
        nav_uni: "University Education",
        nav_uni_overview: "Overview",
        nav_uni_colleges: "Colleges",
        nav_uni_subjects: "Uni Subjects",
        nav_uni_teachers: "Uni Professors",
        nav_uni_videos: "Uni Videos",
        nav_ecourses: "E-Courses",

        // UI Elements
        search_placeholder: "Search for subject, teacher, or lesson...",
        admin_mode: "Admin",
        admin_name: "System Admin",
        admin_role: "Administrator",
        add_new: "Add New",
        export_report: "Export Report",
        logout: "Logout",

        // Dashboard
        db_welcome: "Welcome to IQRAA Platform — Iraq 🇮🇶",
        db_total_students: "Total Students",
        db_active_subs: "Active Subscribers",
        db_total_revenue: "Total Revenue (IQD)",
        db_total_videos: "Total Videos",
        db_most_viewed: "Most Viewed Subjects",
        db_recent_subs: "Recent Subscribers",
        db_recent_activity: "Recent Activity",

        // Login
        login_title: "Admin Panel",
        login_sub: "Sign in to continue to platform",
        login_user_label: "Username or Email",
        login_pass_label: "Password",
        login_remember: "Remember me",
        login_forgot: "Forgot password?",
        login_btn: "Login System",
        login_footer: "Don't have an account? Contact technical support",

        // Toasts & Alerts
        toast_login_success: "Login successful",
        toast_login_error: "Invalid username or password",
        toast_logout: "Logging out...",
        toast_day_mode: "Day Mode",
        toast_night_mode: "Night Mode"
    }
};

const I18n = {
    lang: localStorage.getItem('lang') || 'ar',

    init() {
        this.apply();
    },

    setLang(lang) {
        this.lang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.apply();

        // Trigger a custom event for any specific component updates (like charts)
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    },

    t(key) {
        return translations[this.lang][key] || key;
    },

    apply() {
        const elements = document.querySelectorAll('[data-t]');
        elements.forEach(el => {
            const key = el.getAttribute('data-t');
            const translation = this.t(key);

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        });

        // Sync toggles if they exist
        const enBtn = document.getElementById('langEn');
        const arBtn = document.getElementById('langAr');
        if (enBtn && arBtn) {
            enBtn.classList.toggle('on', this.lang === 'en');
            arBtn.classList.toggle('on', this.lang === 'ar');
        }
    }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});
