import { Router } from "express";
import controllers from "../controllers";
import authMiddleware from "../middleware/authMiddleware";
import handleValidationErrors from "../middleware/validationHandler";
import { createResumeRules, updateResumeRules } from "../validators/resumeValidator";

const router = Router({ mergeParams: true });

router.get("/", controllers.resume.getAllResumes);

router.post(
  "/",
  authMiddleware,
  createResumeRules,
  handleValidationErrors,
  controllers.resume.createResume
);

router.put(
  "/:resumeId",
  authMiddleware,
  updateResumeRules,
  handleValidationErrors,
  controllers.resume.updateResume
);

router.delete("/:resumeId", authMiddleware, controllers.resume.deleteResume);

export default router;
