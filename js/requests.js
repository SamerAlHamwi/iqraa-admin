/* ═══════════════════════════════════════════
   CODE REQUESTS LOGIC
═══════════════════════════════════════════ */

let reqsDB = [];

function renderReqsTable(filter) {
    let tbody = document.getElementById('reqsTableBody');
    if (!tbody) return;

    tbody.innerHTML = reqsDB.map(r => `
        <tr>
            <td>${r.name}</td>
            <td>${r.phone}</td>
            <td>${r.city}</td>
            <td>${r.time}</td>
            <td><span class="chip chip-amber">معلق</span></td>
            <td><button class="btn btn-primary btn-xs">إرسال</button></td>
        </tr>
    `).join('') || '<tr><td colspan="6">لا توجد طلبات</td></tr>';

    const pendingEl = document.getElementById('pendingCount');
    if (pendingEl) pendingEl.innerHTML = `⏳ ${reqsDB.length} طلب معلّق`;
}

function filterReqsStatus(v) {
    renderReqsTable(v);
}
