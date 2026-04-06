import { Request, Response, NextFunction } from "express";
import { AssignmentService } from "./assignment.service";
import { sendResponse } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";

export class AssignmentController {
  static async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const { analystId, userId } = req.body;

      const data = await AssignmentService.assignUser(
        analystId,
        userId
      );

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User assigned to analyst",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async removeAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await AssignmentService.removeAssignment(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Assignment removed",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AssignmentService.getAssignments();

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Assignments fetched",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMyUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const analystId = req.user!.id;

      const data = await AssignmentService.getMyUsers(analystId);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Assigned users fetched",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}