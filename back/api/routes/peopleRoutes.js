import { Router } from "express";
import controllers from "../controllers";
import authMiddleware from "../middleware/authMiddleware";
import handleValidationErrors from "../middleware/validationHandler";
import { updatePersonRules } from "../validators/personValidator";

import experienceRoutes from "./experienceRoutes";
import educationRoutes from "./educationRoutes";
import externalLinkRoutes from "./externalLinkRoutes";
import resumeRoutes from "./resumeRoutes";
import skillRoutes from "./skillRoutes";

const router = Router();

// --- Rotas públicas (leitura) ---
router.get("/", controllers.people.getAllPeople);
router.get("/u/:username", controllers.people.getPersonByUsername);
router.get("/:personId", controllers.people.getPersonById);

// --- Rotas privadas (escrita) ---
router.put(
  "/:personId",
  authMiddleware,
  updatePersonRules,
  handleValidationErrors,
  controllers.people.updatePerson
);

router.delete("/:personId", authMiddleware, controllers.people.deletePerson);

// --- Sub-rotas (todas protegidas internamente pelos controllers) ---
router.use("/:personId/experiences", experienceRoutes);
router.use("/:personId/externallinks", externalLinkRoutes);
router.use("/:personId/educations", educationRoutes);
router.use("/:personId/resumes", resumeRoutes);
router.use("/:personId/skills", skillRoutes);

export default router;
