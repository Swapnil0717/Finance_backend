import { Request, Response, NextFunction } from "express";
import { RecordService } from "./record.service";
import { sendResponse } from "../../utils/response";

export class RecordController {
  static async create(req: any, res: Response, next: NextFunction) {
    try {
      const record = await RecordService.createRecord(
        req.user.id,
        req.user.role,
        req.body
      );

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Record created",
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: any, res: Response, next: NextFunction) {
    try {
      const result = await RecordService.getRecords(
        req.user.id,
        req.user.role,
        req.query
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Records fetched",
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req: any, res: Response, next: NextFunction) {
    try {
      const record = await RecordService.getRecordById(
        req.user.id,
        req.user.role,
        req.params.id
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Record fetched",
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: any, res: Response, next: NextFunction) {
    try {
      const record = await RecordService.updateRecord(
        req.user.id,
        req.user.role,
        req.params.id,
        req.body
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Record updated",
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: any, res: Response, next: NextFunction) {
    try {
      await RecordService.deleteRecord(
        req.user.id,
        req.user.role,
        req.params.id
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Record deleted",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
}