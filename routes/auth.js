import express from "express";
import { register, login, ping } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/ping", ping);

export default router;
