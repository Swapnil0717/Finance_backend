import { Router } from "express";
import { AssignmentController } from "./assignment.controller";
import { Role } from "@prisma/client";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { assignSchema, removeSchema } from "../../validations/assignment.validation";
import { requireRole } from "../../middleware/role.middleware";


const router = Router();

// ADMIN assigns user to analyst
router.post(
  "/",
  authMiddleware,
  requireRole(Role.ADMIN),
  validate(assignSchema),
  AssignmentController.assign
);

// ADMIN remove assignment
router.delete(
  "/:id",
  authMiddleware,
  requireRole(Role.ADMIN),
  validate(removeSchema),
  AssignmentController.removeAssignment
);

// ADMIN view all assignments
router.get(
  "/",
  authMiddleware,
  requireRole(Role.ADMIN),
  AssignmentController.list
);

// ANALYST: get assigned users
router.get(
  "/my-users",
  authMiddleware,
  requireRole(Role.ANALYST),
  AssignmentController.getMyUsers
);

export default router;