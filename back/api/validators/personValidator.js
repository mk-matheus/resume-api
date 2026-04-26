import { body } from "express-validator";

export const createPersonRules = [
  body("name").notEmpty().withMessage("Nome é obrigatório."),
  body("email").isEmail().withMessage("E-mail inválido."),
  body("phone").optional({ checkFalsy: true }).isString(),
  body("jobTitle").optional({ checkFalsy: true }).isString(),
  body("location").optional({ checkFalsy: true }).isString(),
];

export const updatePersonRules = [
  body("name").optional().notEmpty().withMessage("Nome não pode ser vazio."),
  body("email").optional().isEmail().withMessage("E-mail inválido."),
  body("phone").optional({ checkFalsy: true }).isString(),
  body("jobTitle").optional({ checkFalsy: true }).isString(),
  body("location").optional({ checkFalsy: true }).isString(),
];
