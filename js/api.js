/* ═══════════════════════════════════════════
   API SERVICE LAYER (PRO)
═══════════════════════════════════════════ */

const API_CONFIG = {
    BASE_URL: 'https://localhost:44311/api', // Pointing to ReadIraq backend
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
};

/**
 * Core API Client
 */
const apiClient = {
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const token = localStorage.getItem('auth_token');

        const headers = {
            ...API_CONFIG.HEADERS,
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            let data = null;

            // ABP often returns results wrapped in a "result" object
            try {
                data = await response.json();
            } catch (e) {
                console.warn('Response is not JSON');
            }

            if (!response.ok) {
                if (response.status === 401) {
                    handleUnauthorized();
                }
                throw { status: response.status, ...data };
            }

            // Unwrap ABP result if it exists
            return data && data.result !== undefined ? data.result : data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
    },

    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
};

/**
 * Handle Session Expiry
 */
function handleUnauthorized() {
    localStorage.removeItem('auth_token');
    if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html?session=expired';
    }
}

/**
 * Specialized API Services
 */
const AppAPI = {
    auth: {
        // Updated to match TokenAuthController.cs
        login: (credentials) => apiClient.post('/TokenAuth/Authenticate', {
            userNameOrEmailAddress: credentials.username,
            password: credentials.password,
            rememberClient: credentials.remember || false
        }),
        logout: () => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_id');
            window.location.href = 'login.html';
        }
    },
    dashboard: {
        getStats: () => apiClient.get('/admin/stats'),
        getChartData: () => apiClient.get('/admin/charts/revenue')
    },
    content: {
        getClasses: () => apiClient.get('/admin/classes'),
        addClass: (data) => apiClient.post('/admin/classes', data),
        getSubjects: () => apiClient.get('/admin/subjects'),
        getTeachers: () => apiClient.get('/admin/teachers'),
        getVideos: () => apiClient.get('/admin/videos')
    },
    codes: {
        getAll: () => apiClient.get('/admin/codes'),
        create: (data) => apiClient.post('/admin/codes', data),
        getRequests: () => apiClient.get('/admin/code-requests')
    },
    users: {
        getStudents: () => apiClient.get('/admin/students'),
        getParents: () => apiClient.get('/admin/parents')
    }
};
