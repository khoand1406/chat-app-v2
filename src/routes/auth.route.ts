import express from "express";
import { AuthController } from "../controllers/auth.controlller";

const router = express.Router();
const authController = new AuthController();

router.post("/login", authController.authenticateUser);

export default router;
