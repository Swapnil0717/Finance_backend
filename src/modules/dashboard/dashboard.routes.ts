import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// Only logged-in users (ANALYST / ADMIN)
router.use(authMiddleware);
router.use(requireRole("ANALYST", "ADMIN"));

router.get("/", DashboardController.getSummary);

export default router;