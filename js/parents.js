/* ═══════════════════════════════════════════
   PARENTS MANAGEMENT LOGIC (PRO)
═══════════════════════════════════════════ */

async function initParentsPage() {
    await fetchParents();
}

async function fetchParents() {
    const tbody = document.querySelector('#p-parents tbody');
    if (!tbody) return;

    try {
        const result = await AppAPI.users.getParents({ MaxResultCount: 50 });
        const parents = result.items || [];

        tbody.innerHTML = parents.map(p => `
            <tr>
                <td>
                    <div class="u-row">
                        <div class="u-av">${(p.name || 'P').charAt(0)}</div>
                        <div><div class="u-name">${p.name}</div></div>
                    </div>
                </td>
                <td>${p.phoneNumber || '—'}</td>
                <td>${p.childrenCount || 0} طلاب</td>
                <td>${p.gradeName || '—'}</td>
                <td><span class="chip chip-green">● نشط</span></td>
                <td>
                    <button class="ico-btn" onclick="editParent('${p.id}')">✏️</button>
                    <button class="ico-btn" onclick="deleteParent('${p.id}')">🗑️</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" style="text-align:center">لا يوجد أولياء أمور مسجلون</td></tr>';
    } catch (error) {
        showToast('Failed to load parents', 'error');
    }
}

function editParent(id) {
    // Open modal logic
}

async function deleteParent(id) {
    if (!confirm('حذف حساب ولي الأمر؟')) return;
    try {
        // await AppAPI.users.deleteParent(id);
        showToast('تم الحذف', 'success');
        fetchParents();
    } catch (e) {
        showToast('فشل الحذف', 'error');
    }
}
