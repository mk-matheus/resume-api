import asyncHandler from "../utils/asyncHandler";

const findOwnedPerson = async (models, personId, userId) => {
  const person = await models.Person.findByPk(personId);
  if (!person) return { error: "Pessoa não encontrada.", status: 404 };
  if (person.userId !== userId) return { error: "Acesso negado.", status: 403 };
  return { person };
};

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

  const skill = await req.context.models.Skill.create({
    ...req.body,
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

  const [affectedRows, updated] = await req.context.models.Skill.update(
    req.body,
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
