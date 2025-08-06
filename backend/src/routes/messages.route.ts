import { MessageController } from "../controllers/message.controller";
import express from "express";

const router = express.Router();
const controller = new MessageController();

router.get("/:id/messages", controller.getMessages);
router.post("/send", controller.sendMessage);
export default router;
