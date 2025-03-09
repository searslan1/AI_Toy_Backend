import { Request, Response } from "express";
import AnalyticsService from "./analytics.service";

class AnalyticsController {
  async getUsage(req: Request, res: Response) {
    const { deviceId } = req.params;
    const usage = await AnalyticsService.getUsage(deviceId);
    res.json(usage);
  }
}

export default new AnalyticsController();
