import asyncHandler from "../utils/asyncHandler";

const findOwnedPerson = async (models, personId, userId) => {
  const person = await models.Person.findByPk(personId);
  if (!person) return { error: "Pessoa não encontrada.", status: 404 };
  if (person.userId !== userId) return { error: "Acesso negado.", status: 403 };
  return { person };
};

// Campos permitidos para Education (inclui degree)
const ALLOWED_FIELDS = ["institutionName", "course", "degree", "startDate", "endDate", "status"];

// Sanitiza campos de data: "" → null
const sanitizeDates = (data) => {
  const sanitized = { ...data };
  if (sanitized.startDate === "") sanitized.startDate = null;
  if (sanitized.endDate === "") sanitized.endDate = null;
  return sanitized;
};

const pickFields = (body, fields) => {
  const data = {};
  fields.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  return data;
};

const getAllEducations = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const educations = await req.context.models.Education.findAll({
    where: { personId },
  });
  return res.status(200).json(educations);
});

const createEducation = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const { person, error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const data = sanitizeDates(pickFields(req.body, ALLOWED_FIELDS));

  const education = await req.context.models.Education.create({
    ...data,
    personId: person.objectId,
  });
  return res.status(201).json(education);
});

const updateEducation = asyncHandler(async (req, res) => {
  const { personId, educationId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const data = sanitizeDates(pickFields(req.body, ALLOWED_FIELDS));

  const [affectedRows, updated] = await req.context.models.Education.update(
    data,
    { where: { objectId: educationId, personId }, returning: true }
  );
  if (affectedRows === 0)
    return res.status(404).json({ error: "Formação não encontrada." });

  return res.status(200).json(updated[0]);
});

const deleteEducation = asyncHandler(async (req, res) => {
  const { personId, educationId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const deleted = await req.context.models.Education.destroy({
    where: { objectId: educationId, personId },
  });
  if (deleted === 0)
    return res.status(404).json({ error: "Formação não encontrada." });

  return res.status(204).send();
});

export default { getAllEducations, createEducation, updateEducation, deleteEducation };
