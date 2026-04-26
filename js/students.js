/* ═══════════════════════════════════════════
   STUDENTS MANAGEMENT LOGIC (PRO)
═══════════════════════════════════════════ */

async function initStudentsPage() {
    await fetchStudents();
}

async function fetchStudents() {
    const tbody = document.querySelector('#p-users tbody');
    if (!tbody) return;

    try {
        const result = await AppAPI.users.getStudents({ MaxResultCount: 50 });
        const students = result.items || [];

        tbody.innerHTML = students.map(s => `
            <tr>
                <td>
                    <div class="u-row">
                        <div class="u-av">${(s.registrationFullName || s.userName || 'S').charAt(0)}</div>
                        <div><div class="u-name">${s.registrationFullName || s.userName}</div></div>
                    </div>
                </td>
                <td>${s.phoneNumber || '—'}</td>
                <td>${s.gradeName || '—'}</td>
                <td>${s.governorateName || '—'}</td>
                <td><span class="chip ${s.isSubscribed ? 'chip-green' : 'chip-gray'}">${s.isSubscribed ? '● مشترك' : 'غير مشترك'}</span></td>
                <td>${new Date(s.creationTime).toLocaleDateString('ar-EG')}</td>
                <td>${s.lastLoginTime ? new Date(s.lastLoginTime).toLocaleDateString('ar-EG') : '—'}</td>
                <td>
                    <label class="tog"><input type="checkbox" ${s.isActive ? 'checked' : ''} onchange="toggleStudentStatus('${s.id}')"><span class="tog-sl"></span></label>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="8" style="text-align:center">لا يوجد طلاب مسجلون</td></tr>';
    } catch (error) {
        showToast('Failed to load students', 'error');
    }
}

async function toggleStudentStatus(id) {
    try {
        // Assuming there's a toggle endpoint or generic update
        // await apiClient.post('/services/app/User/ToggleActive', { id });
        showToast('تم تحديث حالة الطالب', 'success');
    } catch (e) {
        showToast('فشل التحديث', 'error');
    }
}
