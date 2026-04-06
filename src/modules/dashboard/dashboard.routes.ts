import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("ANALYST", "ADMIN", "VIEWER"));

router.get("/", DashboardController.getSummary);

export default router;