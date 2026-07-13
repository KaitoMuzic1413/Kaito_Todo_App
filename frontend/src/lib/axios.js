import axios from 'axios';

const BASE_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5001/api" 
    : "/api";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Bắt buộc phải có dòng này để Backend nhận diện đúng session khi gửi request POST/PUT
});

// Thêm đoạn cấu hình header mặc định này để đảm bảo gửi data dạng JSON luôn thành công
api.defaults.headers.common['Content-Type'] = 'application/json';

export default api;