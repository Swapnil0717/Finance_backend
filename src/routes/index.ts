import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import recordRoutes from "../modules/record/record.routes";

const router = Router();

// Routes
router.use("/auth", authRoutes);
router.use("/records", recordRoutes);

export default router;