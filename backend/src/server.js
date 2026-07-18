import express from "express";
import taskRoutes from "./routes/taskRouters.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middlewares ---
app.use(cors({
    origin: [
        "https://kaito-todo-app.onrender.com",
        "https://www.kaito-todo-app.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

if(process.env.NODE_ENV === 'production'){
    const frontendPath = path.join(__dirname, "..", "..", "frontend", "dist");
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    })
}

connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
});