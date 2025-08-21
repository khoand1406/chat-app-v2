import express from "express";
import { NotificationController } from "../controllers/notification.controller";
import { checkToken } from "../middlewares/authMiddleware";
const router= express.Router();
const notificationController= new NotificationController();

router.get("/", checkToken ,notificationController.getNotification);
router.post("/send",checkToken, notificationController.sendNotification)
router.post("/:id/read",checkToken, notificationController.readNotification)
router.post("/read-all",checkToken, notificationController.markAsreadAll)

export default router;