import { Request, Response, NextFunction } from "express";
import { RecordService } from "./record.service";
import { sendResponse } from "../../utils/response";

export class RecordController {
  // CREATE RECORD
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const record = await RecordService.createRecord(
        req.user.id,
        req.user.role,
        req.body
      );

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Record created successfully",
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET ALL RECORDS
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await RecordService.getRecords(
        req.user.id,
        req.user.role,
        req.query
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Records fetched successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET SINGLE RECORD
  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const record = await RecordService.getRecordById(
        req.user.id,
        req.user.role,
        req.params.id
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Record fetched successfully",
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  // UPDATE RECORD
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const record = await RecordService.updateRecord(
        req.user.id,
        req.user.role,
        req.params.id,
        req.body
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Record updated successfully",
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  // DELETE RECORD (SOFT DELETE)
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      await RecordService.deleteRecord(
        req.user.id,
        req.user.role,
        req.params.id
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Record deleted successfully",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
}