import { body } from "express-validator";

export const createExternalLinkRules = [
  body("type")
    .notEmpty()
    .withMessage('O campo "type" é obrigatório.')
    .isString()
    .withMessage('O campo "type" deve ser uma string.'),

  body("url")
    .notEmpty()
    .withMessage('O campo "url" é obrigatório.')
    .isURL()
    .withMessage('O campo "url" deve ser uma URL válida.'),
];

export const updateExternalLinkRules = [
  body("type")
    .optional()
    .isString()
    .withMessage('O campo "type" deve ser uma string.'),

  body("url")
    .optional()
    .isURL()
    .withMessage('O campo "url" deve ser uma URL válida.'),
];
