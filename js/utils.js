/* ═══════════════════════════════════════════
   UTILITY FUNCTIONS
═══════════════════════════════════════════ */

function filterTable(tableId, query) {
    let rows = document.querySelectorAll('#' + tableId + ' tbody tr');
    query = query.trim().toLowerCase();
    rows.forEach(r => {
        r.style.display = (!query || r.textContent.toLowerCase().includes(query)) ? '' : 'none';
    });
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderCodesTable === 'function' && document.getElementById('p-codes')?.style.display !== 'none') renderCodesTable();
    if (typeof renderReqsTable === 'function' && document.getElementById('p-code-requests')?.style.display !== 'none') renderReqsTable('all');
    if (typeof initDashboard === 'function' && document.getElementById('p-dashboard')?.style.display !== 'none') initDashboard();
});
