import { MessageController } from "../controllers/message.controller";
import express from "express";
import { checkToken } from "../middlewares/authMiddleware";

const router = express.Router();
const controller = new MessageController();

router.get("/:id/messages",checkToken,  controller.getMessages);
router.post("/send",checkToken,  controller.sendMessage);
router.post("/read",checkToken,  controller.readMessages)
export default router;
