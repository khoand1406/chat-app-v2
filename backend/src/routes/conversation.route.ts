import express from "express";
import { ConversationController } from "../controllers/coversation.controller";
import { upload } from "../services/upload.services";
import { checkToken } from "../middlewares/authMiddleware";

const router = express.Router();
const controller = new ConversationController();

router.get("/",checkToken, controller.getConversations);
router.post("/group",checkToken, upload.single("avatarUrl"), controller.createGroupConversation);
router.post("/user", checkToken, controller.createUserConversation);
router.delete("/group/:id",checkToken, controller.deleteGroupConversation);

export default router;
