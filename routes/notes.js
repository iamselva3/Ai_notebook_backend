import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
    publicTest,
    protectedTest,
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
} from "../controllers/notes.js";

const router = express.Router();

// Public route
router.get("/public-test", publicTest);

// Protect everything below
router.use(authMiddleware);

// Protected test
router.get("/protected-test", protectedTest);

// Notes routes
router.post("/", createNote);
router.get("/", getNotes);

router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
