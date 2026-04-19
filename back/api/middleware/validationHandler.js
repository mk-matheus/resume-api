import { validationResult } from "express-validator";
//Middleware que captura os resultados da validação do express-validator.

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Se houver erros, retorna 400 com o array de erros
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default handleValidationErrors;
