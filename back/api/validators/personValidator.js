import { body } from "express-validator";

export const createPersonRules = [
  body("name").notEmpty().withMessage("Nome é obrigatório."),
  body("email").isEmail().withMessage("E-mail inválido."),
  body("phone").optional().isString(),
  body("jobTitle").optional().isString(),
  body("location").optional().isString(),
  body("avatarUrl").optional().isURL().withMessage("URL do avatar inválida."),
];

export const updatePersonRules = [
  body("name").optional().notEmpty().withMessage("Nome não pode ser vazio."),
  body("email").optional().isEmail().withMessage("E-mail inválido."),
  body("phone").optional().isString(),
  body("jobTitle").optional().isString(),
  body("location").optional().isString(),
  body("avatarUrl").optional().isURL().withMessage("URL do avatar inválida."),
];
