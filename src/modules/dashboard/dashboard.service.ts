import prisma from "../../config/prisma";
import { Role, RecordType, Prisma } from "@prisma/client";

export class DashboardService {
  // BASE WHERE (RBAC)
  private static buildWhere(userId: string, role: Role) {
    const where: Prisma.FinancialRecordWhereInput = {
      isDeleted: false,
    };

    if (role === "ANALYST") {
      where.createdById = userId;
    }

    return where;
  }

  // TOTALS
  static async getTotals(userId: string, role: Role) {
    const where = this.buildWhere(userId, role);

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

  // CATEGORY WISE TOTALS
  static async getCategoryTotals(userId: string, role: Role) {
    const where = this.buildWhere(userId, role);

    const data = await prisma.financialRecord.groupBy({
      by: ["category", "type"],
      where,
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });

    return data.map((item) => ({
      category: item.category,
      type: item.type,
      total: Number(item._sum.amount || 0),
    }));
  }

  // MONTHLY TRENDS
  static async getMonthlyTrends(userId: string, role: Role) {
    const where = this.buildWhere(userId, role);

    const data = await prisma.financialRecord.groupBy({
      by: ["date", "type"],
      where,
      _sum: { amount: true },
    });

    // Transform into month-wise
    const map = new Map<string, { income: number; expense: number }>();

    data.forEach((item) => {
      const month = new Date(item.date).toISOString().slice(0, 7); // YYYY-MM

      if (!map.has(month)) {
        map.set(month, { income: 0, expense: 0 });
      }

      const entry = map.get(month)!;

      if (item.type === "INCOME") {
        entry.income += Number(item._sum.amount || 0);
      } else {
        entry.expense += Number(item._sum.amount || 0);
      }
    });

    return Array.from(map.entries()).map(([month, value]) => ({
      month,
      ...value,
    }));
  }

  // RECENT TRANSACTIONS
  static async getRecent(userId: string, role: Role) {
    const where = this.buildWhere(userId, role);

    return prisma.financialRecord.findMany({
      where,
      orderBy: { date: "desc" },
      take: 5,
    });
  }
}