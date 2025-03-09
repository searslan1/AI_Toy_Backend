import { Router } from "express";
import DeviceController from "./device.controller";

const router = Router();

router.post("/register", DeviceController.registerDevice);
router.get("/list/:ownerId", DeviceController.listDevices);
router.delete("/remove/:deviceId", DeviceController.removeDevice);

export default router;
