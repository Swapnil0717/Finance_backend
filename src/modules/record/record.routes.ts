import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  createRecordSchema,
  updateRecordSchema,
  getRecordsSchema,
  recordIdSchema,
} from "../../validations/record.validation";
import { RecordController } from "./record.controller";

const router = Router();

// PROTECTED ROUTES
router.use(authMiddleware);

//  CREATE 
router.post(
  "/",
  validate(createRecordSchema),
  RecordController.create
);

//  GET ALL
router.get(
  "/",
  validate(getRecordsSchema),
  RecordController.getAll
);

//  GET ONE
router.get(
  "/:id",
  validate(recordIdSchema),
  RecordController.getOne
);

//  UPDATE
router.patch(
  "/:id",
  validate(updateRecordSchema),
  RecordController.update
);

// DELETE
router.delete(
  "/:id",
  validate(recordIdSchema),
  RecordController.delete
);

export default router;