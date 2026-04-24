import asyncHandler from "../utils/asyncHandler";
import findOwnedPerson from "../utils/findOwnedPerson";
import { pickFields } from "../utils/sanitizers";

const ALLOWED_FIELDS = ["title", "summary"];

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

  const data = pickFields(req.body, ALLOWED_FIELDS);

  const resume = await req.context.models.Resume.create({
    ...data,
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

  const data = pickFields(req.body, ALLOWED_FIELDS);

  const [affectedRows, updated] = await req.context.models.Resume.update(
    data,
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
