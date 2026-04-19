import { Router } from "express";
import controllers from "../controllers";
import authMiddleware from "../middleware/authMiddleware";
import handleValidationErrors from "../middleware/validationHandler";
import { createExperienceRules, updateExperienceRules } from "../validators/experienceValidator";

const router = Router({ mergeParams: true });

router.get("/", controllers.experience.getAllExperiences);

router.post(
  "/",
  authMiddleware,
  createExperienceRules,
  handleValidationErrors,
  controllers.experience.createExperience
);

router.put(
  "/:experienceId",
  authMiddleware,
  updateExperienceRules,
  handleValidationErrors,
  controllers.experience.updateExperience
);

router.delete("/:experienceId", authMiddleware, controllers.experience.deleteExperience);

export default router;
