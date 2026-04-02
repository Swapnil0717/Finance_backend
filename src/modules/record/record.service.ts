import prisma from "../../config/prisma";
import { Prisma, Role } from "@prisma/client";

export class RecordService {
  // CREATE
  static async createRecord(userId: string, role: Role, data: any) {
    return prisma.financialRecord.create({
      data: {
        ...data,
        createdBy: { connect: { id: userId } },
      },
    });
  }

  // GET ALL
  static async getRecords(userId: string, role: Role, filters: any) {
    const {
      type,
      category,
      startDate,
      endDate,
      page,
      limit,
    } = filters;

    const where: Prisma.FinancialRecordWhereInput = {
      isDeleted: false,
      ...(type && { type }),
      ...(category && { category }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    };

    if (role === "ANALYST") {
      where.createdById = userId;
    }

    const [data, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.financialRecord.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  // GET ONE
  static async getRecordById(userId: string, role: Role, id: string) {
    const where: Prisma.FinancialRecordWhereInput = {
      id,
      isDeleted: false,
      ...(role === "ANALYST" && { createdById: userId }),
    };

    const record = await prisma.financialRecord.findFirst({ where });

    if (!record) {
      throw { statusCode: 404, message: "Record not found" };
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
    const where: Prisma.FinancialRecordWhereInput = {
      id,
      isDeleted: false,
      ...(role === "ANALYST" && { createdById: userId }),
    };

    const existing = await prisma.financialRecord.findFirst({ where });

    if (!existing) {
      throw { statusCode: 404, message: "Record not found" };
    }

    return prisma.financialRecord.update({
      where: { id },
      data,
    });
  }

  // DELETE (SOFT)
  static async deleteRecord(userId: string, role: Role, id: string) {
    const where: Prisma.FinancialRecordWhereInput = {
      id,
      isDeleted: false,
      ...(role === "ANALYST" && { createdById: userId }),
    };

    const existing = await prisma.financialRecord.findFirst({ where });

    if (!existing) {
      throw { statusCode: 404, message: "Record not found" };
    }

    return prisma.financialRecord.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}