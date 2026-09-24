import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('stm_token');
}

const http = axios.create({ baseURL: BASE_URL });

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.auth !== false) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function request(method, path, { body, auth = true } = {}) {
  try {
    const res = await http.request({ method, url: path, data: body, auth });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Request failed';
    throw new Error(message);
  }
}

export const api = {
  get: (path) => request('get', path),
  post: (path, body, opts) => request('post', path, { body, ...opts }),
  patch: (path, body) => request('patch', path, { body }),
  del: (path) => request('delete', path),
  getToken,
};
