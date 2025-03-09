import { Router } from "express";
import AnalyticsController from "./analytics.controller";

const router = Router();

router.get("/usage/:deviceId", AnalyticsController.getUsage);

export default router;
