/* ═══════════════════════════════════════════
   GRADES & STAGES MANAGEMENT LOGIC
═══════════════════════════════════════════ */

let currentGradeTab = 'groups';
let allGradeGroups = [];

/**
 * Initialize Page
 */
async function initGradesPage() {
    await switchGradeTab(currentGradeTab);
}

/**
 * Tab Switcher
 */
async function switchGradeTab(tab, btn) {
    currentGradeTab = tab;

    document.querySelectorAll('.g-tab').forEach(el => el.style.display = 'none');
    document.getElementById(`g-tab-${tab}`).style.display = 'block';

    if (btn) {
        btn.parentElement.querySelectorAll('.nm').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
    }

    if (tab === 'groups') await fetchGradeGroups();
    if (tab === 'grades') await fetchGrades();
}

/**
 * Fetch and Render Groups (Stages)
 */
async function fetchGradeGroups() {
    try {
        const result = await AppAPI.content.getGradeGroups({ MaxResultCount: 100 });
        allGradeGroups = result.items || [];
        renderGradeGroupsTable(allGradeGroups);
        populateGroupSelect();
    } catch (error) {
        showToast('Failed to load stages', 'error');
    }
}

function renderGradeGroupsTable(items) {
    const tbody = document.getElementById('gradeGroupsTableBody');
    tbody.innerHTML = items.map(item => {
        const nameAr = item.name.find(t => t.code === 'ar')?.name || '—';
        const nameEn = item.name.find(t => t.code === 'en')?.name || '—';
        return `
            <tr>
                <td><strong>${nameAr}</strong></td>
                <td>${nameEn}</td>
                <td>${item.priority}</td>
                <td>
                    <button class="ico-btn" onclick="editGradeGroup('${item.id}')">✏️</button>
                    <button class="ico-btn" onclick="deleteGradeGroup('${item.id}')">🗑️</button>
                </td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="4" style="text-align:center">لا توجد مراحل</td></tr>';
}

/**
 * Fetch and Render Grades
 */
async function fetchGrades() {
    try {
        const result = await AppAPI.content.getGrades({ MaxResultCount: 100 });
        renderGradesTable(result.items || []);
    } catch (error) {
        showToast('Failed to load grades', 'error');
    }
}

function renderGradesTable(items) {
    const tbody = document.getElementById('gradesTableBody');
    tbody.innerHTML = items.map(item => {
        const nameAr = item.name.find(t => t.code === 'ar')?.name || '—';
        const nameEn = item.name.find(t => t.code === 'en')?.name || '—';
        const group = allGradeGroups.find(g => g.id === item.gradeGroupId);
        const groupName = group ? (group.name.find(t => t.code === 'ar')?.name || group.name[0]?.name) : '—';

        return `
            <tr>
                <td><strong>${nameAr}</strong></td>
                <td>${nameEn}</td>
                <td><span class="chip chip-brand">${groupName}</span></td>
                <td>${item.priority}</td>
                <td>
                    <button class="ico-btn" onclick="editGrade('${item.id}')">✏️</button>
                    <button class="ico-btn" onclick="deleteGrade('${item.id}')">🗑️</button>
                </td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="5" style="text-align:center">لا توجد صفوف</td></tr>';
}

/**
 * Actions & Modals
 */
function openGradeModal() {
    if (currentGradeTab === 'groups') {
        document.getElementById('fGradeGroup').reset();
        document.getElementById('ggId').value = '';
        openM('mGradeGroup');
    } else {
        document.getElementById('fGrade').reset();
        document.getElementById('gId').value = '';
        populateGroupSelect();
        openM('mGrade');
    }
}

function populateGroupSelect() {
    const select = document.getElementById('gGroupId');
    if (!select) return;
    select.innerHTML = '<option value="">اختر المرحلة...</option>' +
        allGradeGroups.map(g => `<option value="${g.id}">${g.name.find(t => t.code === 'ar')?.name || g.name[0]?.name}</option>`).join('');
}

// Submissions
async function handleGradeGroupSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('ggId').value;
    const data = {
        name: [
            { code: 'ar', name: document.getElementById('ggNameAr').value },
            { code: 'en', name: document.getElementById('ggNameEn').value }
        ],
        priority: parseInt(document.getElementById('ggPriority').value),
        description: document.getElementById('ggDescription').value
    };

    try {
        if (id) {
            await AppAPI.content.updateGradeGroup({ ...data, id });
            showToast('تم التعديل بنجاح', 'success');
        } else {
            await AppAPI.content.createGradeGroup(data);
            showToast('تم الإضافة بنجاح', 'success');
        }
        closeM('mGradeGroup');
        fetchGradeGroups();
    } catch (e) { showToast('فشل في الحفظ', 'error'); }
}

async function handleGradeSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('gId').value;
    const data = {
        name: [
            { code: 'ar', name: document.getElementById('gNameAr').value },
            { code: 'en', name: document.getElementById('gNameEn').value }
        ],
        priority: parseInt(document.getElementById('gPriority').value),
        gradeGroupId: document.getElementById('gGroupId').value
    };

    try {
        if (id) {
            await AppAPI.content.updateGrade({ ...data, id });
            showToast('تم التعديل بنجاح', 'success');
        } else {
            await AppAPI.content.createGrade(data);
            showToast('تم الإضافة بنجاح', 'success');
        }
        closeM('mGrade');
        fetchGrades();
    } catch (e) { showToast('فشل في الحفظ', 'error'); }
}

// Edits
async function editGradeGroup(id) {
    const item = allGradeGroups.find(g => g.id === id);
    if (!item) return;
    document.getElementById('ggId').value = item.id;
    document.getElementById('ggNameAr').value = item.name.find(t => t.code === 'ar')?.name || '';
    document.getElementById('ggNameEn').value = item.name.find(t => t.code === 'en')?.name || '';
    document.getElementById('ggPriority').value = item.priority;
    document.getElementById('ggDescription').value = item.description || '';
    openM('mGradeGroup');
}

async function editGrade(id) {
    // We would ideally fetch by id or find in cached list
    try {
        const item = await apiClient.get('/services/app/Grade/Get', { params: { id } });
        document.getElementById('gId').value = item.id;
        document.getElementById('gNameAr').value = item.name.find(t => t.code === 'ar')?.name || '';
        document.getElementById('gNameEn').value = item.name.find(t => t.code === 'en')?.name || '';
        document.getElementById('gPriority').value = item.priority;
        populateGroupSelect();
        document.getElementById('gGroupId').value = item.gradeGroupId;
        openM('mGrade');
    } catch (e) { showToast('فشل في جلب البيانات', 'error'); }
}

// Deletes
async function deleteGradeGroup(id) {
    if (!confirm('حذف هذه المرحلة؟')) return;
    try {
        await AppAPI.content.deleteGradeGroup(id);
        fetchGradeGroups();
    } catch (e) { showToast('فشل الحذف', 'error'); }
}

async function deleteGrade(id) {
    if (!confirm('حذف هذا الصف؟')) return;
    try {
        await AppAPI.content.deleteGrade(id);
        fetchGrades();
    } catch (e) { showToast('فشل الحذف', 'error'); }
}
