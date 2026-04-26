/* ═══════════════════════════════════════════
   SUBJECTS MANAGEMENT LOGIC (PRO)
═══════════════════════════════════════════ */

/**
 * Initialize Subjects Page
 */
async function initSubjectsPage() {
    await fetchSubjects();
}

/**
 * Fetch and Render Subjects
 */
async function fetchSubjects() {
    try {
        const result = await AppAPI.content.getSubjects({ MaxResultCount: 100 });
        const subjects = result.items || [];
        renderSubjectsTable(subjects);
    } catch (error) {
        showToast('Failed to load subjects', 'error');
    }
}

function renderSubjectsTable(items) {
    const tbody = document.querySelector('#p-subjects tbody');
    if (!tbody) return;

    tbody.innerHTML = items.map(s => {
        const nameAr = s.name.find(t => t.code === 'ar')?.name || s.name[0]?.name;
        return `
            <tr>
                <td>
                    <div style="display:flex;align-items:center;gap:9px">
                        <div style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:var(--p50); border-radius:6px;">📚</div>
                        <div><strong>${nameAr}</strong></div>
                    </div>
                </td>
                <td><span class="chip chip-brand">${s.gradeName || '—'}</span></td>
                <td>${s.teachersCount || 0}</td>
                <td>${s.videosCount || 0}</td>
                <td><span class="chip chip-green">${s.subscribersCount || 0}</span></td>
                <td>★ ${s.rating || '0.0'}</td>
                <td>
                    <button class="ico-btn" onclick="editSubject('${s.id}')">✏️</button>
                    <button class="ico-btn" onclick="deleteSubject('${s.id}')">🗑️</button>
                </td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="7" style="text-align:center">لا توجد مواد دراسية</td></tr>';
}

async function deleteSubject(id) {
    if (!confirm('حذف هذه المادة؟')) return;
    try {
        await AppAPI.content.deleteSubject(id);
        showToast('تم الحذف بنجاح', 'success');
        fetchSubjects();
    } catch (e) {
        showToast('فشل في الحذف', 'error');
    }
}

function editSubject(id) {
    console.log('Edit subject:', id);
    // Logic to open modal and load subject data
}
