import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service";
import { sendResponse } from "../../utils/response";

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, role } = req.user!;

      const totals = await DashboardService.getTotals(id, role);
      const categories = await DashboardService.getCategoryTotals(id, role);
      const trends = await DashboardService.getMonthlyTrends(id, role);
      const recent = await DashboardService.getRecent(id, role);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Dashboard data fetched",
        data: {
          totals,
          categories,
          trends,
          recent,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}