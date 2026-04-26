/* ═══════════════════════════════════════════
   TEACHERS MANAGEMENT LOGIC (PRO)
═══════════════════════════════════════════ */

let currentTeacherTab = 'profiles';

/**
 * Initialize Teachers Page
 */
async function initTeachersPage() {
    switchTeacherTab(currentTeacherTab);
}

/**
 * Tab Switching Logic
 */
async function switchTeacherTab(tab, btn) {
    currentTeacherTab = tab;

    // UI Update
    document.querySelectorAll('.t-tab').forEach(el => el.style.display = 'none');
    document.getElementById(`t-tab-${tab}`).style.display = 'block';

    if (btn) {
        btn.parentElement.querySelectorAll('.nm').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
    }

    // Data Fetching
    if (tab === 'profiles') await fetchTeachers();
    if (tab === 'features') await fetchFeatures();
    if (tab === 'reports') await fetchReports();
    if (tab === 'reviews') await fetchReviews();
}

/**
 * --- PROFILES SECTION ---
 */
async function fetchTeachers() {
    try {
        const result = await AppAPI.teachers.getAll({ MaxResultCount: 100 });
        renderTeachersGrid(result.items || []);
    } catch (error) {
        showToast('Failed to load teachers', 'error');
    }
}

function renderTeachersGrid(teachers) {
    const grid = document.querySelector('#t-tab-profiles .tch-g');
    if (!grid) return;

    if (teachers.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--ink4);">لا يوجد مدرسون حالياً.</div>';
        return;
    }

    grid.innerHTML = teachers.map(t => `
        <div class="tch-card" style="border-top: 4px solid ${t.color || 'var(--p400)'}">
            <div class="tch-av">
                ${t.profilePictureUrl ? `<img src="${t.profilePictureUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : '👨‍🏫'}
            </div>
            <div class="tch-name">${t.name}</div>
            <div class="tch-meta">${t.specialization || 'بدون تخصص'}</div>
            <div class="tch-chips">
                <span class="chip chip-dark">${t.videosCount || 0} فيديو</span>
                <span class="chip ${t.isActive ? 'chip-green' : 'chip-amber'}">${t.isActive ? 'نشط' : 'متوقف'}</span>
            </div>
            <div class="tch-acts">
                <button class="btn btn-ghost btn-sm" onclick="editTeacher('${t.id}')">تعديل</button>
                <button class="btn btn-ghost btn-sm" onclick="toggleTeacherActive('${t.id}')">تبديل الحالة</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTeacher('${t.id}')">حذف</button>
            </div>
        </div>
    `).join('');
}

async function toggleTeacherActive(id) {
    try {
        await AppAPI.teachers.toggleActive(id);
        showToast('تم تغيير حالة المدرس', 'success');
        fetchTeachers();
    } catch (error) {
        showToast('فشل في تغيير الحالة', 'error');
    }
}

async function deleteTeacher(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المدرس؟')) return;
    try {
        await AppAPI.teachers.delete(id);
        showToast('تم حذف المدرس بنجاح', 'success');
        fetchTeachers();
    } catch (error) {
        showToast('فشل في حذف المدرس', 'error');
    }
}

/**
 * --- MODAL & FORM LOGIC ---
 */
function openTeacherModal(id = null) {
    const form = document.getElementById('fTeacher');
    form.reset();
    document.getElementById('tId').value = '';
    document.getElementById('tAttachmentId').value = '';
    document.getElementById('tPreview').innerHTML = '<span>📷</span>';

    if (id) {
        loadTeacherData(id);
    }

    openM('mTeacher');
}

async function loadTeacherData(id) {
    try {
        const t = await AppAPI.teachers.get(id);
        document.getElementById('tId').value = t.id;
        document.getElementById('tName').value = t.name;
        document.getElementById('tSpec').value = t.specialization;
        document.getElementById('tUserId').value = t.userId;
        document.getElementById('tBio').value = t.bio || '';
        document.getElementById('tColor').value = t.color || '#4DA8DA';
        document.getElementById('tAttachmentId').value = t.attachmentId || '';

        if (t.profilePictureUrl) {
            document.getElementById('tPreview').innerHTML = `<img src="${t.profilePictureUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        }
    } catch (error) {
        showToast('Failed to load teacher data', 'error');
    }
}

async function handleTeacherFileSelect(input) {
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const preview = document.getElementById('tPreview');
    preview.innerHTML = '<span class="spinner"></span>';

    try {
        const result = await AppAPI.attachments.upload(file, Enums.AttachmentRefType.TeacherProfile, "Teacher Profile");
        document.getElementById('tAttachmentId').value = result.id;
        preview.innerHTML = `<img src="${result.url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        showToast('تم رفع الصورة بنجاح', 'success');
    } catch (error) {
        preview.innerHTML = '<span>📷</span>';
        showToast('فشل رفع الصورة', 'error');
    }
}

async function handleTeacherSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('tSubmitBtn');
    const id = document.getElementById('tId').value;

    const data = {
        name: document.getElementById('tName').value,
        specialization: document.getElementById('tSpec').value,
        userId: parseInt(document.getElementById('tUserId').value),
        bio: document.getElementById('tBio').value,
        color: document.getElementById('tColor').value,
        attachmentId: parseInt(document.getElementById('tAttachmentId').value || 0)
    };

    btn.disabled = true;
    try {
        if (id) {
            await AppAPI.teachers.update({ ...data, id });
            showToast('تم تحديث بيانات المدرس', 'success');
        } else {
            await AppAPI.teachers.create(data);
            showToast('تم إضافة المدرس بنجاح', 'success');
        }
        closeM('mTeacher');
        fetchTeachers();
    } catch (error) {
        showToast(error.error?.message || 'فشل في حفظ البيانات', 'error');
    } finally {
        btn.disabled = false;
    }
}

function editTeacher(id) {
    openTeacherModal(id);
}

/**
 * --- FEATURES SECTION ---
 */
async function fetchFeatures() {
    try {
        const result = await AppAPI.teachers.getFeatures({ MaxResultCount: 100 });
        renderFeaturesTable(result.items || []);
    } catch (error) {
        showToast('Failed to load features', 'error');
    }
}

function renderFeaturesTable(items) {
    const tbody = document.getElementById('featuresTableBody');
    tbody.innerHTML = items.map(f => `
        <tr>
            <td><strong>${f.name}</strong></td>
            <td><span style="font-size:20px">${f.icon || '—'}</span></td>
            <td><div style="width:24px; height:24px; border-radius:4px; background:${f.color}"></div></td>
            <td>
                <button class="ico-btn" onclick="deleteFeature('${f.id}')">🗑️</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center">لا توجد مميزات</td></tr>';
}

async function handleFeatureSubmit(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('fName').value,
        icon: document.getElementById('fIcon').value,
        color: document.getElementById('fColor').value
    };
    try {
        await AppAPI.teachers.createFeature(data);
        showToast('تم إضافة الميزة', 'success');
        closeM('mFeature');
        fetchFeatures();
    } catch (error) {
        showToast('فشل الإضافة', 'error');
    }
}

async function deleteFeature(id) {
    if (!confirm('حذف الميزة؟')) return;
    try {
        await AppAPI.teachers.deleteFeature(id);
        fetchFeatures();
    } catch (error) {
        showToast('فشل الحذف', 'error');
    }
}

/**
 * --- REPORTS & REVIEWS ---
 */
async function fetchReports() {
    try {
        const result = await AppAPI.teachers.getReports({ MaxResultCount: 50 });
        document.getElementById('reportsTableBody').innerHTML = (result.items || []).map(r => `
            <tr>
                <td>${r.teacherName}</td>
                <td>${r.userName}</td>
                <td>${r.reason}</td>
                <td>${new Date(r.creationTime).toLocaleDateString('ar-EG')}</td>
                <td><button class="ico-btn" onclick="deleteReport('${r.id}')">🗑️</button></td>
            </tr>
        `).join('') || '<tr><td colspan="5" style="text-align:center">لا توجد بلاغات</td></tr>';
    } catch (e) {}
}

async function fetchReviews() {
    try {
        const result = await AppAPI.teachers.getReviews({ MaxResultCount: 50 });
        document.getElementById('reviewsTableBody').innerHTML = (result.items || []).map(r => `
            <tr>
                <td>${r.teacherName}</td>
                <td>${r.userName}</td>
                <td>★ ${r.rating}</td>
                <td>${r.comment || 'بدون تعليق'}</td>
                <td>${new Date(r.creationTime).toLocaleDateString('ar-EG')}</td>
            </tr>
        `).join('') || '<tr><td colspan="5" style="text-align:center">لا توجد تقييمات</td></tr>';
    } catch (e) {}
}

async function deleteReport(id) {
    if (!confirm('حذف البلاغ؟')) return;
    try {
        await AppAPI.teachers.deleteReport(id);
        fetchReports();
    } catch (e) {}
}
