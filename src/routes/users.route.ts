import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();
const userController = new UserController();

router.get("/:id", userController.getUserById);
router.post("/create", userController.createUser);
router.get("/", userController.getUsers);


export default router;
