import axios from 'axios';

const PORT = "5001";
const hostname = window.location.hostname;

const BASE_URL = hostname === 'localhost' || hostname === '127.0.0.1'
  ? `http://localhost:${PORT}/api`
  : `http://${hostname}:${PORT}/api`;

const api = axios.create({
  baseURL: BASE_URL,
});

api.defaults.headers.common['Content-Type'] = 'application/json';

export default api;