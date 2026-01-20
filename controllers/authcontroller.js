import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

// Register
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("User already exists with email:", email);
            return res.status(400).json({ error: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        await User.create({ email, password: hash });

        return res.status(201).json({ success: true });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ error: "Registration failed" });
    }
};

// Login
export const login = async (req, res) => {
    console.log("Login attempt received");

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing");
            return res.status(500).json({ error: "Server misconfiguration" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        return res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Login failed" });
    }
};

// Health check
export const ping = (req, res) => {
    return res.send("auth alive");
};
