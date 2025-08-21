import express from "express"
import { EventController } from "../controllers/event.controller";
import { checkToken } from "../middlewares/authMiddleware";

const router= express.Router();
const controller= new EventController();

router.get("/", checkToken, controller.getEvents)
router.get("/date", checkToken, controller.getEventsByDate)
router.get("/:id", checkToken, controller.getEventDetails)
router.post("/create", checkToken, controller.createEvent)
router.post("/update/:id", checkToken, controller.updateEvent)
router.delete("/delete/:id", checkToken, controller.deleteEvent)
export default router
