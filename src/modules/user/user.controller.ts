import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/response";

export class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users fetched",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await UserService.updateUserRole(id, role);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User role updated",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await UserService.toggleUserStatus(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User status updated",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}