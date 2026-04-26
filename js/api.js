/* ═══════════════════════════════════════════
   API SERVICE LAYER (PRO)
═══════════════════════════════════════════ */

const API_CONFIG = {
    BASE_URL: 'https://iraq.autotap.site/api', // Pointing to ReadIraq backend
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
};

/**
 * Enums (Matching ReadIraq Backend)
 */
const Enums = {
    AttachmentRefType: {
        Profile: 1,
        Advertisiment: 2,
        Subject: 3,
        LessonSessionThumbnail: 4,
        LessonSessionVideo: 5,
        TeacherProfile: 6,
        LessonSessionOther: 7,
        Other: 8,
        Question: 9
    },
    AttachmentType: {
        PDF: 1,
        WORD: 2,
        JPEG: 3,
        PNG: 4,
        JPG: 5,
        MP4: 6,
        MP3: 7,
        APK: 8
    }
};

/**
 * Core API Client
 */
const apiClient = {
    async request(endpoint, options = {}) {
        let url = `${API_CONFIG.BASE_URL}${endpoint}`;

        // Handle query parameters
        if (options.params) {
            const params = new URLSearchParams(options.params).toString();
            url += (url.includes('?') ? '&' : '?') + params;
        }

        const token = localStorage.getItem('auth_token');

        const headers = {
            ...API_CONFIG.HEADERS,
            ...options.headers
        };

        // Don't set Content-Type for FormData (browser will set it with boundary)
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

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
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    data = await response.json();
                }
            } catch (e) {
                console.warn('Response parsing failed');
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
        const isFormData = body instanceof FormData;
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: isFormData ? body : JSON.stringify(body)
        });
    },

    put(endpoint, body, options = {}) {
        const isFormData = body instanceof FormData;
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: isFormData ? body : JSON.stringify(body)
        });
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
    attachments: {
        upload: (file, refType, description = "") => {
            const formData = new FormData();
            formData.append('File', file);
            formData.append('RefType', refType);
            formData.append('Description', description);
            return apiClient.post('/services/app/Attachment/Upload', formData);
        }
    },
    teachers: {
        // Profiles
        getAll: (params) => apiClient.get('/services/app/TeacherProfile/GetAll', { params }),
        get: (id) => apiClient.get('/services/app/TeacherProfile/Get', { params: { id } }),
        create: (data) => apiClient.post('/services/app/TeacherProfile/Create', data),
        update: (data) => apiClient.put('/services/app/TeacherProfile/Update', data),
        delete: (id) => apiClient.delete('/services/app/TeacherProfile/Delete', { params: { id } }),
        assignSubjects: (data) => apiClient.post('/services/app/TeacherProfile/AssignSubjects', data),
        getStats: (id) => apiClient.get('/services/app/TeacherProfile/GetStats', { params: { id } }),
        toggleActive: (id) => apiClient.post('/services/app/TeacherProfile/ToggleActive', { id }),

        // Features
        getFeatures: (params) => apiClient.get('/services/app/TeacherFeature/GetAll', { params }),
        createFeature: (data) => apiClient.post('/services/app/TeacherFeature/Create', data),
        updateFeature: (data) => apiClient.put('/services/app/TeacherFeature/Update', data),
        deleteFeature: (id) => apiClient.delete('/services/app/TeacherFeature/Delete', { params: { id } }),

        // Reports & Reviews
        getReports: (params) => apiClient.get('/services/app/TeacherReport/GetAll', { params }),
        deleteReport: (id) => apiClient.delete('/services/app/TeacherReport/Delete', { params: { id } }),
        getReviews: (params) => apiClient.get('/services/app/TeacherReview/GetAll', { params })
    },
    dashboard: {
        getStats: () => apiClient.get('/admin/stats'),
        getChartData: () => apiClient.get('/admin/charts/revenue')
    },
    content: {
        // Grade Groups (Educational Stages)
        getGradeGroups: (params) => apiClient.get('/services/app/GradeGroup/GetAll', { params }),
        createGradeGroup: (data) => apiClient.post('/services/app/GradeGroup/Create', data),
        updateGradeGroup: (data) => apiClient.put('/services/app/GradeGroup/Update', data),
        deleteGradeGroup: (id) => apiClient.delete('/services/app/GradeGroup/Delete', { params: { id } }),

        // Grades (Classrooms)
        getGrades: (params) => apiClient.get('/services/app/Grade/GetAll', { params }),
        createGrade: (data) => apiClient.post('/services/app/Grade/Create', data),
        updateGrade: (data) => apiClient.put('/services/app/Grade/Update', data),
        deleteGrade: (id) => apiClient.delete('/services/app/Grade/Delete', { params: { id } }),

        // Subjects
        getSubjects: (params) => apiClient.get('/services/app/Subject/GetAll', { params }),
        getSubject: (id) => apiClient.get('/services/app/Subject/Get', { params: { id } }),
        createSubject: (data) => apiClient.post('/services/app/Subject/Create', data),
        updateSubject: (data) => apiClient.put('/services/app/Subject/Update', data),
        deleteSubject: (id) => apiClient.delete('/services/app/Subject/Delete', { params: { id } }),
        toggleSubjectActive: (id) => apiClient.post('/services/app/Subject/ToggleActive', { id }),

        // Videos (Lesson Sessions)
        getVideos: (params) => apiClient.get('/services/app/LessonSession/GetAll', { params }),
        getVideo: (id) => apiClient.get('/services/app/LessonSession/Get', { params: { id } }),
        createVideo: (data) => apiClient.post('/services/app/LessonSession/Create', data),
        updateVideo: (data) => apiClient.put('/services/app/LessonSession/Update', data),
        deleteVideo: (id) => apiClient.delete('/services/app/LessonSession/Delete', { params: { id } })
    },
    codes: {
        getAll: (params) => apiClient.get('/services/app/ActivationCode/GetAll', { params }),
        generate: (data) => apiClient.post('/services/app/ActivationCode/GenerateCodes', data),
        getStats: () => apiClient.get('/services/app/ActivationCode/GetStatistics'),

        // Code Requests
        getRequests: (params) => apiClient.get('/services/app/ActivationCode/GetAllActivationCodeRequests', { params }),
        deleteRequest: (id) => apiClient.delete('/services/app/ActivationCode/DeleteActivationCodeRequest', { params: { id } })
    },
    users: {
        getStudents: (params) => apiClient.get('/services/app/User/GetAll', { params }),
        getParents: (params) => apiClient.get('/services/app/Parent/GetAll', { params }),
        getStatisticalNumbers: (year) => apiClient.get('/services/app/User/GetStatisticalNumbers', {
            params: year ? { year } : {}
        })
    }
};
