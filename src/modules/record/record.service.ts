import prisma from "../../config/prisma";
import { Prisma, Role } from "@prisma/client";
import { getPagination } from "../../utils/pagination";

export class RecordService {
  // =========================
  // CREATE RECORD
  // =========================
  static async createRecord(
    userId: string,
    role: Role,
    data: any
  ) {
    if (role === "VIEWER") {
      throw { statusCode: 403, message: "Access denied" };
    }

    return prisma.financialRecord.create({
      data: {
        amount: data.amount,
        type: data.type,
        category: data.category,
        note: data.note,
        date: new Date(data.date),
        createdBy: {
          connect: { id: userId },
        },
      },
    });
  }

  // =========================
  // GET ALL RECORDS (FILTER + PAGINATION)
  // =========================
  static async getRecords(
    userId: string,
    role: Role,
    filters: any
  ) {
    if (role === "VIEWER") {
      throw { statusCode: 403, message: "Access denied" };
    }

    const {
      type,
      category,
      startDate,
      endDate,
    } = filters;

    // ✅ CRITICAL FIX: ALWAYS CAST TO NUMBER
    const pageNumber = Number(filters.page) || 1;
    const limitNumber = Number(filters.limit) || 10;

    const { skip, take } = getPagination({
      page: pageNumber,
      limit: limitNumber,
    });

    // =========================
    // BUILD FILTER
    // =========================
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

    // =========================
    // RBAC FILTER
    // =========================
    if (role === "ANALYST") {
      where.createdById = userId;
    }

    // ADMIN → sees all records

    // =========================
    // QUERY
    // =========================
    const [data, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip,
        take, // ✅ ALWAYS NUMBER NOW
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

  // =========================
  // GET SINGLE RECORD
  // =========================
  static async getRecordById(
    userId: string,
    role: Role,
    id: string
  ) {
    const record = await prisma.financialRecord.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!record) {
      throw { statusCode: 404, message: "Record not found" };
    }

    if (role === "VIEWER") {
      throw { statusCode: 403, message: "Access denied" };
    }

    if (role === "ANALYST" && record.createdById !== userId) {
      throw { statusCode: 403, message: "Access denied" };
    }

    return record;
  }

  // =========================
  // UPDATE RECORD
  // =========================
  static async updateRecord(
    userId: string,
    role: Role,
    id: string,
    data: any
  ) {
    const record = await prisma.financialRecord.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!record) {
      throw { statusCode: 404, message: "Record not found" };
    }

    if (role === "VIEWER") {
      throw { statusCode: 403, message: "Access denied" };
    }

    if (role === "ANALYST" && record.createdById !== userId) {
      throw { statusCode: 403, message: "Access denied" };
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

  // =========================
  // DELETE RECORD (SOFT DELETE)
  // =========================
  static async deleteRecord(
    userId: string,
    role: Role,
    id: string
  ) {
    const record = await prisma.financialRecord.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!record) {
      throw { statusCode: 404, message: "Record not found" };
    }

    if (role === "VIEWER") {
      throw { statusCode: 403, message: "Access denied" };
    }

    if (role === "ANALYST" && record.createdById !== userId) {
      throw { statusCode: 403, message: "Access denied" };
    }

    return prisma.financialRecord.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}