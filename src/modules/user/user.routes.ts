import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { z } from "zod";

const router = Router();

const updateRoleSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    role: z.enum(["VIEWER", "ANALYST", "ADMIN"]),
  }),
};

const userIdSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

// ADMIN ONLY
router.use(authMiddleware);
router.use(requireRole("ADMIN"));

router.get("/", UserController.getAll);

router.patch(
  "/:id/role",
  validate(updateRoleSchema),
  UserController.updateRole
);

router.patch(
  "/:id/status",
  validate(userIdSchema),
  UserController.toggleStatus
);

export default router;