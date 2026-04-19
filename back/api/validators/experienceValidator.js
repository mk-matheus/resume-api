import { body } from "express-validator";

// Regras para criação (POST)
export const createExperienceRules = [
  body("companyName")
    .notEmpty()
    .withMessage('O campo "companyName" é obrigatório.')
    .isString()
    .withMessage('O campo "companyName" deve ser uma string.'),

  body("role")
    .notEmpty()
    .withMessage('O campo "role" é obrigatório.')
    .isString()
    .withMessage('O campo "role" deve ser uma string.'),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage('O campo "startDate" deve ser uma data válida (YYYY-MM-DD).'),

  body("description")
    .optional()
    .isString()
    .withMessage('O campo "description" deve ser uma string.'),
];

// Regras para atualização (PUT) - tudo opcional
export const updateExperienceRules = [
  body("companyName")
    .optional()
    .isString()
    .withMessage('O campo "companyName" deve ser uma string.'),

  body("role")
    .optional()
    .isString()
    .withMessage('O campo "role" deve ser uma string.'),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage('O campo "startDate" deve ser uma data válida (YYYY-MM-DD).'),

  body("description")
    .optional()
    .isString()
    .withMessage('O campo "description" deve ser uma string.'),
];
