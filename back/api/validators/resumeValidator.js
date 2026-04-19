import { body } from "express-validator";

export const createResumeRules = [
  body("title")
    .notEmpty()
    .withMessage('O campo "title" é obrigatório.')
    .isString()
    .withMessage('O campo "title" deve ser uma string.'),

  body("summary")
    .optional()
    .isString()
    .withMessage('O campo "summary" deve ser uma string.'),
];

export const updateResumeRules = [
  body("title")
    .optional()
    .isString()
    .withMessage('O campo "title" deve ser uma string.'),

  body("summary")
    .optional()
    .isString()
    .withMessage('O campo "summary" deve ser uma string.'),
];
