// src/lib/api.js
// Centralized API service for communicating with Django backend

// In dev: Vite proxies /api → http://localhost:8000
// In prod: served from Django, same origin
const BASE_URL = '/api';

// ─── Token helpers ────────────────────────────────────────
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const saveTokens = ({ access, refresh }) => {
  localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('erp_user');
};

// ─── Core fetch wrapper ───────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // Auto refresh on 401
  if (res.status === 401 && getRefreshToken()) {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: getRefreshToken() }),
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      saveTokens(data);
      // Retry original request with new token
      headers.Authorization = `Bearer ${data.access}`;
      return fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    } else {
      clearTokens();
      window.location.href = '/login';
    }
  }

  return res;
}

// ─── Auth API ─────────────────────────────────────────────
export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json().then(data => ({ ok: res.ok, data }));
  },

  register: async ({ name, email, phone, password }) => {
    const [first_name, ...rest] = name.trim().split(' ');
    const last_name = rest.join(' ');
    const res = await fetch(`${BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name, email, phone, password, username: email }),
    });
    return res.json().then(data => ({ ok: res.ok, data }));
  },

  me: async () => {
    const res = await apiFetch('/auth/me/');
    return res.json();
  },
};

// ─── Customers API ────────────────────────────────────────
export const customersAPI = {
  list: async (search = '') => {
    const res = await apiFetch(`/customers/?search=${search}`);
    return res.json();
  },
  create: async (data) => {
    const res = await apiFetch('/customers/', { method: 'POST', body: JSON.stringify(data) });
    return res.json();
  },
  update: async (id, data) => {
    const res = await apiFetch(`/customers/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
    return res.json();
  },
  delete: async (id) => {
    await apiFetch(`/customers/${id}/`, { method: 'DELETE' });
  },
};

// ─── Shipments API ────────────────────────────────────────
export const shipmentsAPI = {
  list: async (status = '') => {
    const res = await apiFetch(`/shipments/${status ? `?status=${status}` : ''}`);
    return res.json();
  },
  search: async (hawb) => {
    const res = await apiFetch(`/shipments/search/?hawb=${encodeURIComponent(hawb)}`);
    return res.json();
  },
  create: async (data) => {
    const res = await apiFetch('/shipments/', { method: 'POST', body: JSON.stringify(data) });
    return res.json();
  },
  get: async (id) => {
    const res = await apiFetch(`/shipments/${id}/`);
    return res.json();
  },
  update: async (id, data) => {
    const res = await apiFetch(`/shipments/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
    return res.json();
  },
  delete: async (id) => {
    await apiFetch(`/shipments/${id}/`, { method: 'DELETE' });
  },
};

// ─── Inventory API ────────────────────────────────────────
export const inventoryAPI = {
  list: async (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const res = await apiFetch(`/inventory/?${params}`);
    return res.json();
  },
  create: async (data) => {
    const res = await apiFetch('/inventory/', { method: 'POST', body: JSON.stringify(data) });
    return res.json();
  },
  update: async (id, data) => {
    const res = await apiFetch(`/inventory/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
    return res.json();
  },
};

// ─── Dashboard API ────────────────────────────────────────
export const dashboardAPI = {
  stats: async () => {
    const res = await apiFetch('/dashboard/');
    return res.json();
  },
};
