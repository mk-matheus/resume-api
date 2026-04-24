/**
 * Extrai apenas os campos permitidos de um objeto.
 * Previne Mass Assignment ao filtrar campos não autorizados do req.body.
 *
 * @param {Object} source - Objeto de origem (ex: req.body)
 * @param {string[]} allowedFields - Lista de campos permitidos
 * @returns {Object} Objeto apenas com os campos permitidos
 */
const pickFields = (source, allowedFields) => {
  const data = {};
  allowedFields.forEach((field) => {
    if (source[field] !== undefined) {
      data[field] = source[field];
    }
  });
  return data;
};

/**
 * Sanitiza campos de data: converte strings vazias ("") para null.
 * Necessário porque inputs HTML date retornam "" quando vazios,
 * mas o PostgreSQL DATEONLY não aceita string vazia.
 *
 * @param {Object} data - Objeto com campos de data
 * @returns {Object} Objeto com datas sanitizadas
 */
const sanitizeDates = (data) => {
  const sanitized = { ...data };
  if (sanitized.startDate === "") sanitized.startDate = null;
  if (sanitized.endDate === "") sanitized.endDate = null;
  return sanitized;
};

export { pickFields, sanitizeDates };
