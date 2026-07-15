import crypto from "crypto";
import User from "../../models/userModel.js";

const createPasswordHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
};

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = createPasswordHash(password, salt);
    return { salt, passwordHash };
};

const verifyPassword = (password, passwordHash, salt) => {
    return createPasswordHash(password, salt) === passwordHash;
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const { salt, passwordHash } = hashPassword(password);
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: passwordHash,
            passwordSalt: salt,
        });

        const { password: _password, passwordSalt, ...safeUser } = user.toObject();

        res.status(201).json({
            message: "User registered successfully",
            user: safeUser,
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValidPassword = verifyPassword(password, user.password, user.passwordSalt);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { password: _password, passwordSalt, ...safeUser } = user.toObject();

        res.status(200).json({
            message: "Login successful",
            user: safeUser,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};