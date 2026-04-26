/* ═══════════════════════════════════════════
   DASHBOARD & CHARTS
═══════════════════════════════════════════ */

/**
 * Global Chart Instance
 */
let dashboardChart = null;

/**
 * Initialize Dashboard
 */
async function initDashboard() {
    await fetchStats();
    initDashboardChart();
}

/**
 * Fetch and Update KPI Cards
 */
async function fetchStats() {
    try {
        const stats = await AppAPI.users.getStatisticalNumbers();

        if (stats) {
            updateKPICard(0, stats.totalCount);   // Total Students
            updateKPICard(1, stats.activeUsers);  // Active Subscribers (Mapped from activeUsers)
            updateKPICard(2, stats.teachers);     // Teachers count (Replacing Revenue for now)
            updateKPICard(3, stats.deActiveUsers); // Deactive Users (Replacing Videos count)

            // Note: If you want to use the chart data from backend:
            // stats.chartPoints is available for the chart labels/data
            if (stats.chartPoints) {
                renderDashboardChart(stats.chartPoints);
            }
        }
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
    }
}

function updateKPICard(index, value) {
    const kpiCards = document.querySelectorAll('.kpi-val');
    if (kpiCards[index]) {
        kpiCards[index].textContent = typeof value === 'number' ? value.toLocaleString() : value;
    }
}

/**
 * Initial empty chart or bar placeholder
 */
function initDashboardChart() {
    const ctx = document.getElementById('chartRepRev');
    if (!ctx || !window.Chart) return;

    // Placeholder data if no dynamic data loaded yet
    const placeholderData = [10, 13, 18.4];
    const placeholderLabels = ['يناير', 'فبراير', 'مارس'];

    renderDashboardChart(null, placeholderLabels, placeholderData);
}

/**
 * Render Chart with Backend Data
 */
function renderDashboardChart(points, customLabels, customData) {
    const ctx = document.getElementById('chartRepRev');
    if (!ctx || !window.Chart) return;

    if (dashboardChart) {
        dashboardChart.destroy();
    }

    let labels = customLabels || [];
    let data = customData || [];

    if (points && points.length > 0) {
        const monthNames = {
            1: 'يناير', 2: 'فبراير', 3: 'مارس', 4: 'أبريل',
            5: 'مايو', 6: 'يونيو', 7: 'يوليو', 8: 'أغسطس',
            9: 'سبتمبر', 10: 'أكتوبر', 11: 'نوفمبر', 12: 'ديسمبر'
        };

        labels = points.map(p => monthNames[p.month] || p.month);
        data = points.map(p => p.userCount);
    }

    dashboardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'الطلاب الجدد',
                data: data,
                backgroundColor: '#4DA8DA',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
