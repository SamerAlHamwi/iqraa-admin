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
    if (typeof renderCodesTable === 'function') renderCodesTable();
    if (typeof renderReqsTable === 'function') renderReqsTable('all');
});
