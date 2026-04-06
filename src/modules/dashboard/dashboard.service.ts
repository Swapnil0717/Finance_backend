import prisma from "../../config/prisma";
import { Role, RecordType } from "@prisma/client";

export class DashboardService {

  // GET ACCESSIBLE USER IDS
  private static async getAccessibleUserIds(userId: string, role: Role) {
    if (role === "ADMIN") {
      return null; 
    }

    if (role === "VIEWER") {
      return [userId];
    }

    if (role === "ANALYST") {
      const assignments = await prisma.analystAssignment.findMany({
        where: { analystId: userId },
        select: { userId: true },
      });

      return assignments.map((a) => a.userId);
    }

    return [];
  }

  // TOTALS
  static async getTotals(userId: string, role: Role) {
    const userIds = await this.getAccessibleUserIds(userId, role);

    const where: any = { isDeleted: false };

    if (userIds) {
      where.createdById = { in: userIds };
    }

    const [income, expense] = await Promise.all([
      prisma.financialRecord.aggregate({
        where: { ...where, type: RecordType.INCOME },
        _sum: { amount: true },
      }),
      prisma.financialRecord.aggregate({
        where: { ...where, type: RecordType.EXPENSE },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(income._sum.amount || 0);
    const totalExpense = Number(expense._sum.amount || 0);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  }

  // CATEGORY TOTALS
  static async getCategoryTotals(userId: string, role: Role) {
    const userIds = await this.getAccessibleUserIds(userId, role);

    const where: any = { isDeleted: false };

    if (userIds) {
      where.createdById = { in: userIds };
    }

    const data = await prisma.financialRecord.groupBy({
      by: ["category", "type"],
      where,
      _sum: { amount: true },
    });

    return data.map((item) => ({
      category: item.category,
      type: item.type,
      total: Number(item._sum.amount || 0),
    }));
  }

  // MONTHLY TRENDS
  static async getMonthlyTrends(userId: string, role: Role) {
    const userIds = await this.getAccessibleUserIds(userId, role);

    const where: any = { isDeleted: false };

    if (userIds) {
      where.createdById = { in: userIds };
    }

    const data = await prisma.financialRecord.findMany({
      where,
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    const map = new Map<string, { income: number; expense: number }>();

    data.forEach((item) => {
      const month = new Date(item.date).toISOString().slice(0, 7);

      if (!map.has(month)) {
        map.set(month, { income: 0, expense: 0 });
      }

      const entry = map.get(month)!;

      if (item.type === "INCOME") {
        entry.income += Number(item.amount);
      } else {
        entry.expense += Number(item.amount);
      }
    });

    return Array.from(map.entries()).map(([month, value]) => ({
      month,
      ...value,
    }));
  }

  // RECENT
  static async getRecent(userId: string, role: Role) {
    const userIds = await this.getAccessibleUserIds(userId, role);

    const where: any = { isDeleted: false };

    if (userIds) {
      where.createdById = { in: userIds };
    }

    return prisma.financialRecord.findMany({
      where,
      orderBy: { date: "desc" },
      take: 5,
    });
  }


// USER BREAKDOWN (ADMIN / ANALYST)
static async getUserBreakdown(userId: string, role: Role) {

  if (role === "VIEWER") return null;

  const userIds = await this.getAccessibleUserIds(userId, role);

  const where: any = { isDeleted: false };

  if (userIds) {
    where.createdById = { in: userIds };
  }

  const data = await prisma.financialRecord.groupBy({
    by: ["createdById", "type"],
    where,
    _sum: {
      amount: true,
    },
  });

  const map = new Map<
    string,
    { income: number; expense: number }
  >();

  data.forEach((item) => {
    if (!map.has(item.createdById)) {
      map.set(item.createdById, { income: 0, expense: 0 });
    }

    const entry = map.get(item.createdById)!;

    if (item.type === "INCOME") {
      entry.income = Number(item._sum.amount || 0);
    } else {
      entry.expense = Number(item._sum.amount || 0);
    }
  });

  return Array.from(map.entries()).map(([userId, value]) => ({
    userId,
    ...value,
  }));
}
}