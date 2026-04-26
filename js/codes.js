/* ═══════════════════════════════════════════
   CODES MANAGEMENT LOGIC
═══════════════════════════════════════════ */

let codesDB = [
    { id: 'c1', code: 'IQRAA001', subject: 'الرياضيات', student: '', created: '2026-03-10', days: 365, status: 'active', usedBy: '' },
    { id: 'c2', code: 'PHYS9881', subject: 'الفيزياء', student: '', created: '2026-03-15', days: 365, status: 'active', usedBy: '' }
];

function renderCodesTable() {
    let tbody = document.getElementById('codesTableBody');
    if (!tbody) return;

    tbody.innerHTML = codesDB.map(c => `
        <tr>
            <td>${c.code}</td>
            <td>${c.subject}</td>
            <td>${c.student || '—'}</td>
            <td>${c.created}</td>
            <td>${c.days} يوم</td>
            <td><span class="code-chip cc-active">نشط</span></td>
            <td><button class="btn btn-ghost btn-xs" onclick="adminCopyCode('${c.code}')">نسخ</button></td>
        </tr>
    `).join('');

    const totalEl = document.getElementById('statTotal');
    const activeEl = document.getElementById('statActive');
    if (totalEl) totalEl.textContent = codesDB.length;
    if (activeEl) activeEl.textContent = codesDB.filter(c => c.status === 'active').length;
}

function generateCode() {
    let code = 'IQ' + Math.floor(Math.random() * 9999);
    const wrap = document.getElementById('codePreviewWrap');
    const val = document.getElementById('codePreviewVal');
    if (wrap) wrap.style.display = 'flex';
    if (val) val.textContent = code;
    return code;
}

function copyGeneratedCode() {
    const val = document.getElementById('codePreviewVal');
    if (!val) return;
    let c = val.textContent;
    navigator.clipboard.writeText(c);
    if (typeof showToast === 'function') showToast('تم نسخ: ' + c, 'success');
}

function saveCode() {
    const val = document.getElementById('codePreviewVal');
    const subSel = document.getElementById('codeSubjectSel');
    const stuName = document.getElementById('codeStudentName');
    const validity = document.getElementById('codeValidity');

    if (!val) return;
    let code = val.textContent;

    if (code && !codesDB.find(c => c.code === code)) {
        codesDB.unshift({
            id: 'c' + Date.now(),
            code: code,
            subject: subSel ? subSel.value || 'عام' : 'عام',
            student: stuName ? stuName.value : '',
            created: new Date().toISOString().split('T')[0],
            days: validity ? parseInt(validity.value) : 365,
            status: 'active',
            usedBy: ''
        });
        renderCodesTable();
        if (typeof showToast === 'function') showToast('تم حفظ الكود', 'success');
        clearCodeForm();
    }
}

function clearCodeForm() {
    const wrap = document.getElementById('codePreviewWrap');
    const stuName = document.getElementById('codeStudentName');
    if (wrap) wrap.style.display = 'none';
    if (stuName) stuName.value = '';
}

function adminCopyCode(code) {
    navigator.clipboard.writeText(code);
    if (typeof showToast === 'function') showToast('تم نسخ: ' + code, 'success');
}
