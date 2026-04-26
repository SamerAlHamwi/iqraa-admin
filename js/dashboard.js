/* ═══════════════════════════════════════════
   DASHBOARD & CHARTS
═══════════════════════════════════════════ */

function initDashboardChart() {
    setTimeout(() => {
        const ctx = document.getElementById('chartRepRev');
        if (ctx && window.Chart) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['يناير', 'فبراير', 'مارس'],
                    datasets: [{
                        label: 'الإيرادات',
                        data: [10, 13, 18.4],
                        backgroundColor: '#4DA8DA'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    }, 50);
}
