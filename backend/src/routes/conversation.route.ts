import express from "express";
import { ConversationController } from "../controllers/coversation.controller";
import { upload } from "../services/upload.services";

const router = express.Router();
const controller = new ConversationController();

router.get("/", controller.getConversations);
router.post("/group", upload.single("avatarUrl"), controller.createGroupConversation);
router.post("/user", controller.createUserConversation);
router.delete("/group/:id", controller.deleteGroupConversation);

export default router;
