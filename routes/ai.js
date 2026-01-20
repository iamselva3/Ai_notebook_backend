import express from "express";
import { summarizeContent, quickTest } from "../controllers/aicontroller.js";

const router = express.Router();

router.post("/summary", summarizeContent);
router.get("/quick-test", quickTest);

export default router;
