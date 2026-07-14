import express from "express";
import taskRoutes from "./routes/taskRouters.js";
import userRoutes from "./routes/userRoutes.js"; // 👈 1. Import thêm routes của User/Auth từ folder routes của bạn vào đây
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from 'cors';
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
const __dirname = path.resolve();

// --- Middlewares ---

// 🎯 ĐƯA ĐOẠN NÀY LÊN ĐẦU: CORS phải luôn là middleware được nạp đầu tiên để xử lý request từ port 5173
app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Thêm OPTIONS để duyệt trước các lệnh POST/PUT/DELETE
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 👈 2. Thêm dòng này giống như trong video (hỗ trợ đọc dữ liệu dạng form urlencoded)
app.use(express.urlencoded({ extended: false })); 


// --- Routes ---

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}


// Kết nối Database và chạy Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});