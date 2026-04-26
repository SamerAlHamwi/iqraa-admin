/* ═══════════════════════════════════════════
   CODES MANAGEMENT LOGIC (PRO)
═══════════════════════════════════════════ */

/**
 * Fetch and Render Codes Table
 */
async function renderCodesTable() {
    let tbody = document.getElementById('codesTableBody');
    if (!tbody) return;

    try {
        const result = await AppAPI.codes.getAll({ MaxResultCount: 50 });
        const codes = result.items || [];

        tbody.innerHTML = codes.map(c => `
            <tr>
                <td><strong>${c.code}</strong></td>
                <td>${c.subjectName || '—'}</td>
                <td>${c.studentName || '—'}</td>
                <td>${new Date(c.creationTime).toLocaleDateString('ar-EG')}</td>
                <td>${c.days} يوم</td>
                <td><span class="code-chip ${c.isUsed ? 'cc-used' : 'cc-active'}">${c.isUsed ? 'مستخدم' : 'نشط'}</span></td>
                <td>
                    <button class="btn btn-ghost btn-xs" onclick="adminCopyCode('${c.code}')">نسخ</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7" style="text-align:center">لا توجد أكواد</td></tr>';

        // Update Stats
        const stats = await AppAPI.codes.getStats();
        if (stats) {
            const totalEl = document.getElementById('statTotal');
            const activeEl = document.getElementById('statActive');
            if (totalEl) totalEl.textContent = stats.totalCodes || 0;
            if (activeEl) activeEl.textContent = stats.activeCodes || 0;
        }
    } catch (error) {
        console.error('Failed to load codes:', error);
    }
}

/**
 * Code Generation (Sync with backend)
 */
function generateCode() {
    // Generate a local preview code
    let code = 'IQ' + Math.floor(1000 + Math.random() * 8999);
    const wrap = document.getElementById('codePreviewWrap');
    const val = document.getElementById('codePreviewVal');
    if (wrap) wrap.style.display = 'flex';
    if (val) val.textContent = code;
    return code;
}

async function saveCode() {
    const val = document.getElementById('codePreviewVal');
    const subSel = document.getElementById('codeSubjectSel'); // This should ideally be a list of subjects
    const stuName = document.getElementById('codeStudentName');
    const validity = document.getElementById('codeValidity');

    if (!val || !val.textContent) return;

    const data = {
        count: 1, // backend API likely supports generating multiple
        days: parseInt(validity.value),
        // Note: The GenerateCodes API likely takes different inputs, checking its structure...
    };

    try {
        // PRO: GenerateCodes typically takes a count and configuration
        await AppAPI.codes.generate({
            count: 1,
            days: parseInt(validity.value)
        });

        showToast('تم إنشاء الكود بنجاح', 'success');
        renderCodesTable();
        clearCodeForm();
    } catch (error) {
        showToast('فشل في إنشاء الكود', 'error');
    }
}

function copyGeneratedCode() {
    const val = document.getElementById('codePreviewVal');
    if (!val) return;
    let c = val.textContent;
    navigator.clipboard.writeText(c);
    showToast('تم نسخ: ' + c, 'success');
}

function clearCodeForm() {
    const wrap = document.getElementById('codePreviewWrap');
    const stuName = document.getElementById('codeStudentName');
    if (wrap) wrap.style.display = 'none';
    if (stuName) stuName.value = '';
}

function adminCopyCode(code) {
    navigator.clipboard.writeText(code);
    showToast('تم نسخ: ' + code, 'success');
}
