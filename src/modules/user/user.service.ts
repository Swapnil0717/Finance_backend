import prisma from "../../config/prisma";
import { Role } from "@prisma/client";

export class UserService {
  // GET ALL USERS
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // UPDATE ROLE
  static async updateUserRole(userId: string, role: Role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  // TOGGLE ACTIVE STATUS
  static async toggleUserStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw { statusCode: 404, message: "User not found" };
    }

    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
  }
}