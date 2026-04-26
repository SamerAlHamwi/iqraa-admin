/* ═══════════════════════════════════════════
   VIDEOS MANAGEMENT LOGIC (PRO)
═══════════════════════════════════════════ */

async function initVideosPage() {
    await fetchVideos();
}

async function fetchVideos() {
    const tbody = document.querySelector('#p-videos tbody');
    if (!tbody) return;

    try {
        const result = await AppAPI.content.getVideos({ MaxResultCount: 50 });
        const videos = result.items || [];

        tbody.innerHTML = videos.map(v => `
            <tr>
                <td>
                    <div style="display:flex;align-items:center;gap:10px">
                        <div class="v-thumb">▶</div>
                        <div><div style="font-weight:700">${v.title}</div></div>
                    </div>
                </td>
                <td>${v.subjectName || '—'}</td>
                <td>${v.teacherName || '—'}</td>
                <td>${v.duration || '0'} د</td>
                <td>${v.viewCount || 0}</td>
                <td>★ ${v.rating || '0.0'}</td>
                <td><span class="chip chip-dark">🔒 ${v.isStreamingOnly ? 'بث فقط' : 'متاح'}</span></td>
                <td>
                    <button class="ico-btn" onclick="editVideo('${v.id}')">✏️</button>
                    <button class="ico-btn" onclick="deleteVideo('${v.id}')">🗑️</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="8" style="text-align:center">لا توجد فيديوهات</td></tr>';
    } catch (error) {
        showToast('Failed to load videos', 'error');
    }
}

async function deleteVideo(id) {
    if (!confirm('حذف هذا الفيديو؟')) return;
    try {
        await AppAPI.content.deleteVideo(id);
        showToast('تم الحذف بنجاح', 'success');
        fetchVideos();
    } catch (e) {
        showToast('فشل الحذف', 'error');
    }
}

function editVideo(id) {
    // Open upload/edit modal logic
}
