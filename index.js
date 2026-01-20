import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";
import aiRoutes from "./routes/ai.js";
import deepseekRoutes from "./routes/deepseekai.js";
import { connectDB } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/ai", aiRoutes);
app.use("/deepai", deepseekRoutes);

// Root Route
app.get("/", (req, res) => res.send("API is running"));
app.get("/health", (req, res) =>
    res.json({ status: "ok", time: new Date().toISOString() })
);
app.get("/hh", (req, res) => res.send("API running"));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        path: req.path,
        method: req.method,
        availableRoutes: [
            "/",
            "/health",
            "/hh",
            "/auth/register",
            "/auth/login",
            "/auth/ping",
            "/notes",
            "/ai",
            "/deepai/summary",
            "/:id"
        ],
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
