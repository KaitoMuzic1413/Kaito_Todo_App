import express from 'express';
const router = express.Router();

// Import hàm xử lý từ controller (Nhớ phải có đuôi .js ở cuối tên file nha!)
import { registerUser, loginUser } from '../controllers/userController.js'; 

// 1. Cổng Đăng Ký: POST tới http://localhost:5001/api/users/
router.post('/', registerUser);

// 2. Cổng Đăng Nhập: POST tới http://localhost:5001/api/users/login
// (Tiện tay thêm luôn dòng này vì tí nữa video cũng sẽ bắt bạn thêm để làm tính năng Login)
router.post('/login', loginUser); 

export default router;