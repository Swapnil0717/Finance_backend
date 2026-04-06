import prisma from "../../config/prisma";
import { Role } from "@prisma/client";

export class AssignmentService {

  // ASSIGN USER TO ANALYST
  static async assignUser(analystId: string, userId: string) {
    const [analyst, user] = await Promise.all([
      prisma.user.findUnique({ where: { id: analystId } }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

    // Validate analyst
    if (!analyst || analyst.role !== Role.ANALYST) {
      throw {
        statusCode: 400,
        message: "Invalid analyst",
      };
    }

    // Validate user (VIEWER = normal user)
    if (!user || user.role !== Role.VIEWER) {
      throw {
        statusCode: 400,
        message: "Invalid user",
      };
    }

    // Check if already assigned
    const existing = await prisma.analystAssignment.findUnique({
      where: {
        analystId_userId: {
          analystId,
          userId,
        },
      },
    });

    if (existing) {
      throw {
        statusCode: 400,
        message: "User already assigned to this analyst",
      };
    }

    // OPTIONAL: Enforce one analyst per user (recommended)
    const alreadyAssigned = await prisma.analystAssignment.findFirst({
      where: { userId },
    });

    if (alreadyAssigned) {
      throw {
        statusCode: 400,
        message: "User already assigned to another analyst",
      };
    }

    // Create assignment
    return prisma.analystAssignment.create({
      data: {
        analystId,
        userId,
      },
    });
  }

  // GET USERS ASSIGNED TO ANALYST
  static async getMyUsers(analystId: string) {
    const assignments = await prisma.analystAssignment.findMany({
      where: { analystId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return assignments.map((a) => a.user);
  }

  // REMOVE ASSIGNMENT
  static async removeAssignment(id: string) {
    const existing = await prisma.analystAssignment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw {
        statusCode: 404,
        message: "Assignment not found",
      };
    }

    return prisma.analystAssignment.delete({
      where: { id },
    });
  }

  // LIST ALL ASSIGNMENTS (ADMIN)
  static async getAssignments() {
    return prisma.analystAssignment.findMany({
      include: {
        analyst: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}