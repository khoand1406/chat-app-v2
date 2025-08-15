import express from "express";
import { NotificationController } from "../controllers/notification.controller";
const router= express.Router();
const notificationController= new NotificationController();

router.get("/", notificationController.getNotification);
router.post("/send", notificationController.sendNotification)
router.post("/:id/read", notificationController.readNotification)
router.post("/read-all", notificationController.markAsreadAll)

export default router;