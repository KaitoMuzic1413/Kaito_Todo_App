import express from "express";
import taskRoutes from "./routes/taskRouters.js";
import userRoutes from "./routes/userRoutes.js"; // 👈 1. Import thêm routes của User/Auth từ folder routes của bạn vào đây
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

// --- Middlewares ---

app.use(express.json());

// 👈 2. Thêm dòng này giống như trong video (hỗ trợ đọc dữ liệu dạng form urlencoded)
app.use(express.urlencoded({ extended: false })); 

app.use(cors({ origin: ["http://localhost:5173"] }));

// --- Routes ---

app.use("/api/tasks", taskRoutes);

// 👈 3. Thêm cổng định tuyến cho các tính năng Login/Register của User
app.use("/api/users", userRoutes); 

// Kết nối Database và chạy Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});