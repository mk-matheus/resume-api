import { Router } from "express";
import controllers from "../controllers";
import authMiddleware from "../middleware/authMiddleware";
import handleValidationErrors from "../middleware/validationHandler";
import { createEducationRules, updateEducationRules } from "../validators/educationValidator";

const router = Router({ mergeParams: true });

router.get("/", controllers.education.getAllEducations);

router.post(
  "/",
  authMiddleware,
  createEducationRules,
  handleValidationErrors,
  controllers.education.createEducation
);

router.put(
  "/:educationId",
  authMiddleware,
  updateEducationRules,
  handleValidationErrors,
  controllers.education.updateEducation
);

router.delete("/:educationId", authMiddleware, controllers.education.deleteEducation);

export default router;
