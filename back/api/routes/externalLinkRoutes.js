import { Router } from "express";
import controllers from "../controllers";
import authMiddleware from "../middleware/authMiddleware";
import handleValidationErrors from "../middleware/validationHandler";
import { createExternalLinkRules, updateExternalLinkRules } from "../validators/externalLinkValidator";

const router = Router({ mergeParams: true });

router.get("/", controllers.externalLink.getAllExternalLinks);

router.post(
  "/",
  authMiddleware,
  createExternalLinkRules,
  handleValidationErrors,
  controllers.externalLink.createExternalLink
);

router.put(
  "/:linkId",
  authMiddleware,
  updateExternalLinkRules,
  handleValidationErrors,
  controllers.externalLink.updateExternalLink
);

router.delete("/:linkId", authMiddleware, controllers.externalLink.deleteExternalLink);

export default router;
