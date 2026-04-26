/* ═══════════════════════════════════════════
   UI & NAVIGATION LOGIC
═══════════════════════════════════════════ */

const PAGES = ['dashboard', 'classes', 'subjects', 'teachers', 'videos', 'subscriptions', 'codes', 'code-requests', 'users', 'reports', 'notifications', 'parents', 'ratings', 'uni-overview', 'uni-colleges', 'uni-subjects', 'uni-teachers', 'uni-videos', 'ec-overview', 'ec-classes', 'ec-subjects', 'ec-teachers', 'ec-videos'];

function showP(id, btn) {
    PAGES.forEach(p => {
        let el = document.getElementById('p-' + p);
        if (el) el.style.display = 'none';
    });

    let target = document.getElementById('p-' + id);
    if (target) target.style.display = 'block';

    document.querySelectorAll('.sb-link').forEach(i => i.classList.remove('on'));
    if (btn) btn.classList.add('on');

    if (window.innerWidth <= 768) closeSb();

    // Page specific initializers
    if (id === 'dashboard') {
        if (typeof initDashboardChart === 'function') initDashboardChart();
    }
    if (id === 'codes') {
        if (typeof renderCodesTable === 'function') renderCodesTable();
    }
    if (id === 'code-requests') {
        if (typeof renderReqsTable === 'function') renderReqsTable('all');
    }
}

function toggleSb() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sbOv').classList.toggle('open');
}

function closeSb() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sbOv').classList.remove('open');
}

function openM(id) {
    let el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

function closeM(id) {
    let el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

function showToast(msgKey, type) {
    let box = document.getElementById('toastBox');
    if (!box) return;
    let t = document.createElement('div');
    t.className = 'toast toast-' + type;

    // Check if msgKey is a translation key, otherwise use as literal
    const message = (typeof I18n !== 'undefined' && translations[I18n.lang][msgKey])
                    ? I18n.t(msgKey)
                    : msgKey;

    t.innerHTML = '<span>✅</span><span>' + message + '</span>';
    box.appendChild(t);
    setTimeout(() => {
        t.classList.add('hide');
        setTimeout(() => t.remove(), 250);
    }, 2500);
}

function toggleDark() {
    let d = document.documentElement;
    let isDark = d.getAttribute('data-theme') === 'dark';
    let newTheme = isDark ? '' : 'dark';

    d.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const btn = document.getElementById('darkBtn');
    if (btn) btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';

    showToast(newTheme === 'dark' ? 'toast_night_mode' : 'toast_day_mode', 'info');
}

function handleLogout() {
    showToast('toast_logout', 'info');
    localStorage.removeItem('auth_token'); // PRO: Clear token
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 800);
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    // Theme sync
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const btn = document.getElementById('darkBtn');
        if (btn) btn.textContent = '☀️';
    }

    // Resize handler
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeSb();
    });
});
