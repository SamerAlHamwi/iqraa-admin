/* ═══════════════════════════════════════════
   SUBSCRIPTIONS / ENROLLMENTS LOGIC (PRO)
═══════════════════════════════════════════ */

async function initSubscriptionsPage() {
    await fetchSubscriptions();
}

async function fetchSubscriptions() {
    const tbody = document.querySelector('#p-subscriptions tbody');
    if (!tbody) return;

    try {
        // Fetching from Enrollments API
        const result = await apiClient.get('/services/app/Enrollment/GetAll', { params: { MaxResultCount: 50 } });
        const subs = result.items || [];

        tbody.innerHTML = subs.map(s => `
            <tr>
                <td>
                    <div class="u-row">
                        <div class="u-av">${(s.userName || 'S').charAt(0)}</div>
                        <div><div class="u-name">${s.userName}</div></div>
                    </div>
                </td>
                <td>${s.gradeName || '—'}</td>
                <td><span class="chip chip-brand">${s.subjectName || 'كلاس كامل'}</span></td>
                <td>${new Date(s.creationTime).toLocaleDateString('ar-EG')}</td>
                <td>—</td>
                <td>${s.price || '0'}</td>
                <td><span class="chip chip-green">● نشط</span></td>
            </tr>
        `).join('') || '<tr><td colspan="7" style="text-align:center">لا توجد اشتراكات نشطة</td></tr>';
    } catch (error) {
        showToast('Failed to load subscriptions', 'error');
    }
}
