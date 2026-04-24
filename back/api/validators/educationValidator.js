import { body } from "express-validator";

const VALID_STATUSES = ["Em andamento", "Concluído", "Trancado", "Pausado"];
const VALID_DEGREES = [
  "Técnico",
  "Tecnólogo",
  "Graduação",
  "Pós-graduação",
  "Mestrado",
  "Doutorado",
  "Curso Livre",
  "Bootcamp",
];

// Validação customizada: coerência entre status e datas
const validateStatusVsDates = (status, { req }) => {
  const { startDate, endDate } = req.body;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  if (status === "Concluído" && endDate && endDate > today) {
    throw new Error(
      'Status "Concluído" não é compatível com data de fim no futuro.'
    );
  }

  if (status === "Em andamento" && endDate && endDate < today) {
    throw new Error(
      'Status "Em andamento" não é compatível com data de fim no passado.'
    );
  }

  return true;
};

// Validação customizada: startDate <= endDate
const validateDateRange = (endDate, { req }) => {
  if (endDate && req.body.startDate) {
    if (new Date(endDate) < new Date(req.body.startDate)) {
      throw new Error(
        "A data de fim não pode ser anterior à data de início."
      );
    }
  }
  return true;
};

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

  body("degree")
    .optional()
    .isString()
    .withMessage('O campo "degree" deve ser uma string.')
    .isIn(VALID_DEGREES)
    .withMessage(
      `Tipo de formação inválido. Valores aceitos: ${VALID_DEGREES.join(", ")}`
    ),

  body("status")
    .optional()
    .isString()
    .withMessage('O campo "status" deve ser uma string.')
    .isIn(VALID_STATUSES)
    .withMessage(
      `Status inválido. Valores aceitos: ${VALID_STATUSES.join(", ")}`
    )
    .custom(validateStatusVsDates),

  body("startDate")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage('O campo "startDate" deve ser uma data válida (YYYY-MM-DD).'),

  body("endDate")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage('O campo "endDate" deve ser uma data válida (YYYY-MM-DD).')
    .custom(validateDateRange),
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

  body("degree")
    .optional()
    .isString()
    .withMessage('O campo "degree" deve ser uma string.')
    .isIn(VALID_DEGREES)
    .withMessage(
      `Tipo de formação inválido. Valores aceitos: ${VALID_DEGREES.join(", ")}`
    ),

  body("status")
    .optional()
    .isString()
    .withMessage('O campo "status" deve ser uma string.')
    .isIn(VALID_STATUSES)
    .withMessage(
      `Status inválido. Valores aceitos: ${VALID_STATUSES.join(", ")}`
    )
    .custom(validateStatusVsDates),

  body("startDate")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage('O campo "startDate" deve ser uma data válida (YYYY-MM-DD).'),

  body("endDate")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage('O campo "endDate" deve ser uma data válida (YYYY-MM-DD).')
    .custom(validateDateRange),
];
