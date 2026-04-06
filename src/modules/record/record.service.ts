import prisma from "../../config/prisma";
import { Prisma, Role } from "@prisma/client";
import { getPagination } from "../../utils/pagination";

export class RecordService {

  // CREATE RECORD
  static async createRecord(userId: string, role: Role, data: any) {
    let targetUserId = userId;

    if (role === "VIEWER") {
      throw { statusCode: 403, message: "Access denied" };
    }

    if (role === "ADMIN") {
      if (!data.userId) {
        throw { statusCode: 400, message: "userId is required for admin" };
      }
      targetUserId = data.userId;
    }

    return prisma.financialRecord.create({
      data: {
        amount: data.amount,
        type: data.type,
        category: data.category,
        note: data.note,
        date: new Date(data.date),
        createdById: targetUserId,
      },
    });
  }

  // GET ALL RECORDS
  static async getRecords(userId: string, role: Role, filters: any) {
    const {
      userId: targetUserId,
      type,
      category,
      startDate,
      endDate,
    } = filters;

    const pageNumber = Number(filters.page) || 1;
    const limitNumber = Number(filters.limit) || 10;

    const { skip, take } = getPagination({
      page: pageNumber,
      limit: limitNumber,
    });

    const where: Prisma.FinancialRecordWhereInput = {
      isDeleted: false,

      ...(type && { type }),
      ...(category && { category }),

      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    if (role === "VIEWER") {
      where.createdById = userId;
    }

    else if (role === "ANALYST") {
      if (!targetUserId) {
        throw {
          statusCode: 400,
          message: "userId is required for analyst",
        };
      }

      const assignment = await prisma.analystAssignment.findUnique({
        where: {
          analystId_userId: {
            analystId: userId,
            userId: targetUserId,
          },
        },
      });

      if (!assignment) {
        throw {
          statusCode: 403,
          message: "You are not assigned to this user",
        };
      }

      where.createdById = targetUserId;
    }

    else if (role === "ADMIN") {
      if (targetUserId) {
        where.createdById = targetUserId;
      }
    }

    const [data, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip,
        take,
        orderBy: { date: "desc" },
      }),
      prisma.financialRecord.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
      },
    };
  }

  // GET ONE
  static async getRecordById(userId: string, role: Role, id: string) {
    const record = await prisma.financialRecord.findUnique({
      where: { id },
    });

    if (!record || record.isDeleted) {
      throw { statusCode: 404, message: "Record not found" };
    }

    if (role === "VIEWER" && record.createdById !== userId) {
      throw { statusCode: 403, message: "Access denied" };
    }

    if (role === "ANALYST") {
      const assignment = await prisma.analystAssignment.findUnique({
        where: {
          analystId_userId: {
            analystId: userId,
            userId: record.createdById,
          },
        },
      });

      if (!assignment) {
        throw { statusCode: 403, message: "Not assigned to this user" };
      }
    }

    return record;
  }

  // UPDATE
  static async updateRecord(
    userId: string,
    role: Role,
    id: string,
    data: any
  ) {
    const record = await prisma.financialRecord.findUnique({
      where: { id },
    });

    if (!record || record.isDeleted) {
      throw { statusCode: 404, message: "Record not found" };
    }

    if (role === "VIEWER") {
      throw { statusCode: 403, message: "Access denied" };
    }

    if (role === "ANALYST") {
      const assignment = await prisma.analystAssignment.findUnique({
        where: {
          analystId_userId: {
            analystId: userId,
            userId: record.createdById,
          },
        },
      });

      if (!assignment) {
        throw { statusCode: 403, message: "Not assigned" };
      }
    }

    return prisma.financialRecord.update({
      where: { id },
      data: {
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.type && { type: data.type }),
        ...(data.category && { category: data.category }),
        ...(data.note !== undefined && { note: data.note }),
        ...(data.date && { date: new Date(data.date) }),
      },
    });
  }

  // DELETE (SOFT)
  static async deleteRecord(userId: string, role: Role, id: string) {
    const record = await prisma.financialRecord.findUnique({
      where: { id },
    });

    if (!record || record.isDeleted) {
      throw { statusCode: 404, message: "Record not found" };
    }

    if (role === "VIEWER") {
      throw { statusCode: 403, message: "Access denied" };
    }

    if (role === "ANALYST") {
      const assignment = await prisma.analystAssignment.findUnique({
        where: {
          analystId_userId: {
            analystId: userId,
            userId: record.createdById,
          },
        },
      });

      if (!assignment) {
        throw { statusCode: 403, message: "Not assigned" };
      }
    }

    return prisma.financialRecord.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}