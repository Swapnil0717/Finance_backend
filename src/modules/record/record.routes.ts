import { Router } from "express";
import { RecordController } from "./record.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  createRecordSchema,
  updateRecordSchema,
  getRecordsSchema,
  recordIdSchema,
} from "../../validations/record.validation";

const router = Router();

// Protected routes
router.use(authMiddleware);
router.use(requireRole("ANALYST", "ADMIN"));

router.post("/", validate(createRecordSchema), RecordController.create);
router.get("/", validate(getRecordsSchema), RecordController.getAll);
router.get("/:id", validate(recordIdSchema), RecordController.getOne);
router.patch("/:id", validate(updateRecordSchema), RecordController.update);
router.delete("/:id", validate(recordIdSchema), RecordController.delete);

export default router;