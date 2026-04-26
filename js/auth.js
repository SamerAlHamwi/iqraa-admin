/* ═══════════════════════════════════════════
   AUTH LOGIC
═══════════════════════════════════════════ */

function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> جاري التحقق...';

    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    // Simulation of an API request
    setTimeout(() => {
        if (user === 'admin' && pass === 'admin') {
            if (typeof showToast === 'function') showToast('تم تسجيل الدخول بنجاح', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        } else {
            if (typeof showToast === 'function') showToast('خطأ في اسم المستخدم أو كلمة المرور', 'error');
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }, 1200);
}

