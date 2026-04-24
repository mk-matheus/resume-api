import asyncHandler from "../utils/asyncHandler";
import findOwnedPerson from "../utils/findOwnedPerson";
import { pickFields, sanitizeDates } from "../utils/sanitizers";

const ALLOWED_FIELDS = ["institutionName", "course", "degree", "startDate", "endDate", "status"];

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
