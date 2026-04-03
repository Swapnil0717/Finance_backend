import { Router } from "express";
import { RecordController } from "./record.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  createRecordSchema,
  updateRecordSchema,
  getRecordsSchema,
  recordIdSchema,
} from "../../validations/record.validation";

const router = Router();

// PROTECTED ROUTES
router.use(authMiddleware);

// CREATE
router.post(
  "/",
  validate(createRecordSchema),
  RecordController.create
);

// GET ALL (FILTER + PAGINATION)
router.get(
  "/",
  validate(getRecordsSchema),
  RecordController.getAll
);

// GET ONE
router.get(
  "/:id",
  validate(recordIdSchema),
  RecordController.getOne
);

// UPDATE
router.patch(
  "/:id",
  validate(updateRecordSchema),
  RecordController.update
);

// DELETE (SOFT)
router.delete(
  "/:id",
  validate(recordIdSchema),
  RecordController.delete
);

export default router;