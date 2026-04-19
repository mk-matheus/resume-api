import { Router } from "express";
import { body } from "express-validator";
import controllers from "../controllers";
import handleValidationErrors from "../middleware/validationHandler";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// POST /auth/register
router.post(
  "/register",
  [
    body("username")
      .notEmpty().withMessage("Username é obrigatório.")
      .matches(/^[a-z0-9-]+$/i).withMessage("Username só pode conter letras, números e hífen."),
    body("email")
      .isEmail().withMessage("E-mail inválido."),
    body("password")
      .isLength({ min: 6 }).withMessage("Senha deve ter no mínimo 6 caracteres."),
    body("name")
      .notEmpty().withMessage("Nome é obrigatório."),
  ],
  handleValidationErrors,
  controllers.auth.register
);

// POST /auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("E-mail inválido."),
    body("password").notEmpty().withMessage("Senha é obrigatória."),
  ],
  handleValidationErrors,
  controllers.auth.login
);

// GET /auth/me — rota privada
router.get("/me", authMiddleware, controllers.auth.me);

export default router;
