import { body } from "express-validator";

export const createSkillRules = [
  body("name")
    .notEmpty()
    .withMessage('O campo "name" é obrigatório.')
    .isString()
    .withMessage('O campo "name" deve ser uma string.'),

  body("level")
    .notEmpty()
    .withMessage('O campo "level" é obrigatório.')
    .isString()
    .withMessage('O campo "level" deve ser uma string.'),
];

export const updateSkillRules = [
  body("name")
    .optional()
    .isString()
    .withMessage('O campo "name" deve ser uma string.'),

  body("level")
    .optional()
    .isString()
    .withMessage('O campo "level" deve ser uma string.'),
];
