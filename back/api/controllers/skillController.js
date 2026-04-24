import asyncHandler from "../utils/asyncHandler";
import findOwnedPerson from "../utils/findOwnedPerson";
import { pickFields } from "../utils/sanitizers";

const ALLOWED_FIELDS = ["name", "level"];

const getAllSkills = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const skills = await req.context.models.Skill.findAll({ where: { personId } });
  return res.status(200).json(skills);
});

const createSkill = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const { person, error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const data = pickFields(req.body, ALLOWED_FIELDS);

  const skill = await req.context.models.Skill.create({
    ...data,
    personId: person.objectId,
  });
  return res.status(201).json(skill);
});

const updateSkill = asyncHandler(async (req, res) => {
  const { personId, skillId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const data = pickFields(req.body, ALLOWED_FIELDS);

  const [affectedRows, updated] = await req.context.models.Skill.update(
    data,
    { where: { objectId: skillId, personId }, returning: true }
  );
  if (affectedRows === 0)
    return res.status(404).json({ error: "Skill não encontrada." });

  return res.status(200).json(updated[0]);
});

const deleteSkill = asyncHandler(async (req, res) => {
  const { personId, skillId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const deleted = await req.context.models.Skill.destroy({
    where: { objectId: skillId, personId },
  });
  if (deleted === 0)
    return res.status(404).json({ error: "Skill não encontrada." });

  return res.status(204).send();
});

export default { getAllSkills, createSkill, updateSkill, deleteSkill };
