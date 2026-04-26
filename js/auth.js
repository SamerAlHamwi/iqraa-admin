/* ═══════════════════════════════════════════
   AUTH LOGIC
═══════════════════════════════════════════ */

async function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> جاري التحقق...';

    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;
    const remember = document.querySelector('input[type="checkbox"]')?.checked || false;

    try {
        // PRO: Calling real ReadIraq API
        const result = await AppAPI.auth.login({ username, password, remember });

        // ASP.NET Boilerplate returns AccessToken
        if (result && result.accessToken) {
            localStorage.setItem('auth_token', result.accessToken);
            localStorage.setItem('user_id', result.userId);

            if (typeof showToast === 'function') showToast('toast_login_success', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        } else {
            throw new Error('No access token received');
        }
    } catch (error) {
        console.error('Login error:', error);
        let errorMsg = 'toast_login_error';

        if (error.error && error.error.message) {
            errorMsg = error.error.message; // Use message from backend if available
        }

        if (typeof showToast === 'function') showToast(errorMsg, 'error');
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

