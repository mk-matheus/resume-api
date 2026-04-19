import asyncHandler from "../utils/asyncHandler";

// Helper: busca a Person e valida que pertence ao usuário logado
const findOwnedPerson = async (models, personId, userId) => {
  const person = await models.Person.findByPk(personId);
  if (!person) return { error: "Pessoa não encontrada.", status: 404 };
  if (person.userId !== userId) return { error: "Acesso negado.", status: 403 };
  return { person };
};

const getAllExperiences = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const experiences = await req.context.models.Experience.findAll({
    where: { personId },
  });
  return res.status(200).json(experiences);
});

const createExperience = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const { person, error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const experience = await req.context.models.Experience.create({
    ...req.body,
    personId: person.objectId,
  });
  return res.status(201).json(experience);
});

const updateExperience = asyncHandler(async (req, res) => {
  const { personId, experienceId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const [affectedRows, updated] = await req.context.models.Experience.update(
    req.body,
    { where: { objectId: experienceId, personId }, returning: true }
  );
  if (affectedRows === 0)
    return res.status(404).json({ error: "Experiência não encontrada." });

  return res.status(200).json(updated[0]);
});

const deleteExperience = asyncHandler(async (req, res) => {
  const { personId, experienceId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const deleted = await req.context.models.Experience.destroy({
    where: { objectId: experienceId, personId },
  });
  if (deleted === 0)
    return res.status(404).json({ error: "Experiência não encontrada." });

  return res.status(204).send();
});

export default { getAllExperiences, createExperience, updateExperience, deleteExperience };
