import asyncHandler from "../utils/asyncHandler";
import findOwnedPerson from "../utils/findOwnedPerson";
import { pickFields, sanitizeDates } from "../utils/sanitizers";

const ALLOWED_FIELDS = ["companyName", "role", "startDate", "endDate", "description"];

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

  const data = sanitizeDates(pickFields(req.body, ALLOWED_FIELDS));

  const experience = await req.context.models.Experience.create({
    ...data,
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

  const data = sanitizeDates(pickFields(req.body, ALLOWED_FIELDS));

  const [affectedRows, updated] = await req.context.models.Experience.update(
    data,
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
