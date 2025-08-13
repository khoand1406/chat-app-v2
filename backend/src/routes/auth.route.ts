import express from "express";
import { AuthController } from "../controllers/auth.controlller";
import { UserController } from "../controllers/user.controller";

const router = express.Router();
const authController = new AuthController();
const userController= new UserController();
router.post("/login", authController.authenticateUser);
router.post("/register", userController.createUser)

export default router;
