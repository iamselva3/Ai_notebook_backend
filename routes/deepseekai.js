import express from "express";
import { summarizeNote } from "../controllers/deepaicontroller.js";

const router = express.Router();

router.post("/summary", summarizeNote);

export default router;
