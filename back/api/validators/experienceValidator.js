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
    .optional({ values: "null" })
    .isISO8601()
    .withMessage('O campo "startDate" deve ser uma data válida (YYYY-MM-DD).'),

  body("endDate")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage('O campo "endDate" deve ser uma data válida (YYYY-MM-DD).')
    .custom((endDate, { req }) => {
      if (endDate && req.body.startDate) {
        if (new Date(endDate) < new Date(req.body.startDate)) {
          throw new Error("A data de fim não pode ser anterior à data de início.");
        }
      }
      return true;
    }),

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
    .optional({ values: "null" })
    .isISO8601()
    .withMessage('O campo "startDate" deve ser uma data válida (YYYY-MM-DD).'),

  body("endDate")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage('O campo "endDate" deve ser uma data válida (YYYY-MM-DD).')
    .custom((endDate, { req }) => {
      if (endDate && req.body.startDate) {
        if (new Date(endDate) < new Date(req.body.startDate)) {
          throw new Error("A data de fim não pode ser anterior à data de início.");
        }
      }
      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage('O campo "description" deve ser uma string.'),
];
