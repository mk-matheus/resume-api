import asyncHandler from "../utils/asyncHandler";

const findOwnedPerson = async (models, personId, userId) => {
  const person = await models.Person.findByPk(personId);
  if (!person) return { error: "Pessoa não encontrada.", status: 404 };
  if (person.userId !== userId) return { error: "Acesso negado.", status: 403 };
  return { person };
};

const getAllResumes = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const resumes = await req.context.models.Resume.findAll({ where: { personId } });
  return res.status(200).json(resumes);
});

const createResume = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const { person, error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const resume = await req.context.models.Resume.create({
    ...req.body,
    personId: person.objectId,
  });
  return res.status(201).json(resume);
});

const updateResume = asyncHandler(async (req, res) => {
  const { personId, resumeId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const [affectedRows, updated] = await req.context.models.Resume.update(
    req.body,
    { where: { objectId: resumeId, personId }, returning: true }
  );
  if (affectedRows === 0)
    return res.status(404).json({ error: "Resumo não encontrado." });

  return res.status(200).json(updated[0]);
});

const deleteResume = asyncHandler(async (req, res) => {
  const { personId, resumeId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const deleted = await req.context.models.Resume.destroy({
    where: { objectId: resumeId, personId },
  });
  if (deleted === 0)
    return res.status(404).json({ error: "Resumo não encontrado." });

  return res.status(204).send();
});

export default { getAllResumes, createResume, updateResume, deleteResume };
