import { Router } from "express";
import controllers from "../controllers";
import authMiddleware from "../middleware/authMiddleware";
import handleValidationErrors from "../middleware/validationHandler";
import { createSkillRules, updateSkillRules } from "../validators/skillValidator";

const router = Router({ mergeParams: true });

router.get("/", controllers.skill.getAllSkills);

router.post(
  "/",
  authMiddleware,
  createSkillRules,
  handleValidationErrors,
  controllers.skill.createSkill
);

router.put(
  "/:skillId",
  authMiddleware,
  updateSkillRules,
  handleValidationErrors,
  controllers.skill.updateSkill
);

router.delete("/:skillId", authMiddleware, controllers.skill.deleteSkill);

export default router;
