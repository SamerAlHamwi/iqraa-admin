/* ═══════════════════════════════════════════
   CODE REQUESTS LOGIC (PRO)
═══════════════════════════════════════════ */

async function renderReqsTable() {
    let tbody = document.getElementById('reqsTableBody');
    if (!tbody) return;

    try {
        const result = await AppAPI.codes.getRequests({ MaxResultCount: 50 });
        const reqs = result.items || [];

        tbody.innerHTML = reqs.map(r => `
            <tr>
                <td><strong>${r.fullName || r.userName}</strong></td>
                <td>${r.phoneNumber || '—'}</td>
                <td>${r.city || '—'}</td>
                <td>${new Date(r.creationTime).toLocaleString('ar-EG')}</td>
                <td><span class="chip chip-amber">معلق</span></td>
                <td>
                    <button class="btn btn-primary btn-xs" onclick="approveRequest('${r.id}')">إرسال كود</button>
                    <button class="btn btn-danger btn-xs" onclick="deleteRequest('${r.id}')">حذف</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="6" style="text-align:center">لا توجد طلبات معلقة</td></tr>';

        const pendingEl = document.getElementById('pendingCount');
        if (pendingEl) pendingEl.innerHTML = `⏳ ${reqs.length} طلب معلّق`;

        // Update Sidebar Badge
        const badge = document.getElementById('reqBadge');
        if (badge) {
            badge.style.display = reqs.length > 0 ? 'inline-block' : 'none';
            badge.textContent = reqs.length;
        }

    } catch (error) {
        console.error('Failed to load code requests:', error);
    }
}

async function deleteRequest(id) {
    if (!confirm('حذف هذا الطلب؟')) return;
    try {
        await AppAPI.codes.deleteRequest(id);
        showToast('تم حذف الطلب', 'success');
        renderReqsTable();
    } catch (error) {
        showToast('فشل في الحذف', 'error');
    }
}

function approveRequest(id) {
    // Logic to navigate to Codes page or open generation modal for this user
    showP('codes');
    showToast('قم بتوليد كود وإرساله للطالب', 'info');
}

function filterReqsStatus(v) {
    // Logic for filtering by status if backend supports it
    renderReqsTable();
}
