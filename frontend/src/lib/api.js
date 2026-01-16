import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Event Types API
export const eventTypesAPI = {
  getAll: () => api.get('/api/event-types'),
  getById: (id) => api.get(`/api/event-types/${id}`),
  getBySlug: (slug) => api.get(`/api/event-types/slug/${slug}`),
  create: (data) => api.post('/api/event-types', data),
  update: (id, data) => api.put(`/api/event-types/${id}`, data),
  delete: (id) => api.delete(`/api/event-types/${id}`),
}

// Availability API
export const availabilityAPI = {
  getByEventType: (eventTypeId) => api.get(`/api/availability/event-type/${eventTypeId}`),
  create: (data) => api.post('/api/availability', data),
  createBulk: (data) => api.post('/api/availability/bulk', data),
  update: (id, data) => api.put(`/api/availability/${id}`, data),
  delete: (id) => api.delete(`/api/availability/${id}`),
  deleteAllForEventType: (eventTypeId) => api.delete(`/api/availability/event-type/${eventTypeId}`),
}

// Bookings API
export const bookingsAPI = {
  getAvailableSlots: (slug, date, timezone = 'UTC') => 
    api.get(`/api/bookings/available/${slug}`, { params: { date, timezone } }),
  create: (data) => api.post('/api/bookings', data),
}

// Meetings API
export const meetingsAPI = {
  getAll: (params) => api.get('/api/meetings', { params }),
  getUpcoming: () => api.get('/api/meetings/upcoming'),
  getPast: () => api.get('/api/meetings/past'),
  getById: (id) => api.get(`/api/meetings/${id}`),
  cancel: (id) => api.put(`/api/meetings/${id}/cancel`),
}

export default api
