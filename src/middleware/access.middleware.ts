import { Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "./auth.middleware";

export const checkRecordOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const recordId = req.params.id;

    const record = await prisma.financialRecord.findFirst({
      where: {
        id: recordId,
        isDeleted: false,
      },
      select: {
        createdById: true,
      },
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (req.user?.role === "ADMIN") {
      return next();
    }

    if (record.createdById !== req.user?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (err) {
    next(err);
  }
};