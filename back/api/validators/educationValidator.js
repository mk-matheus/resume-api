import { body } from "express-validator";

export const createEducationRules = [
  body("institutionName")
    .notEmpty()
    .withMessage('O campo "institutionName" é obrigatório.')
    .isString()
    .withMessage('O campo "institutionName" deve ser uma string.'),

  body("course")
    .notEmpty()
    .withMessage('O campo "course" é obrigatório.')
    .isString()
    .withMessage('O campo "course" deve ser uma string.'),

  body("status")
    .optional()
    .isString()
    .withMessage('O campo "status" deve ser uma string.'),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage('O campo "startDate" deve ser uma data válida (YYYY-MM-DD).'),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage('O campo "endDate" deve ser uma data válida (YYYY-MM-DD).'),
];

export const updateEducationRules = [
  body("institutionName")
    .optional()
    .isString()
    .withMessage('O campo "institutionName" deve ser uma string.'),

  body("course")
    .optional()
    .isString()
    .withMessage('O campo "course" deve ser uma string.'),

  body("status")
    .optional()
    .isString()
    .withMessage('O campo "status" deve ser uma string.'),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage('O campo "startDate" deve ser uma data válida (YYYY-MM-DD).'),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage('O campo "endDate" deve ser uma data válida (YYYY-MM-DD).'),
];
