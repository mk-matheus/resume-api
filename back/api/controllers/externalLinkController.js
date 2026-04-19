import asyncHandler from "../utils/asyncHandler";

const findOwnedPerson = async (models, personId, userId) => {
  const person = await models.Person.findByPk(personId);
  if (!person) return { error: "Pessoa não encontrada.", status: 404 };
  if (person.userId !== userId) return { error: "Acesso negado.", status: 403 };
  return { person };
};

const getAllExternalLinks = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const links = await req.context.models.ExternalLink.findAll({
    where: { personId },
  });
  return res.status(200).json(links);
});

const createExternalLink = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const { person, error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const link = await req.context.models.ExternalLink.create({
    ...req.body,
    personId: person.objectId,
  });
  return res.status(201).json(link);
});

const updateExternalLink = asyncHandler(async (req, res) => {
  const { personId, linkId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const [affectedRows, updated] = await req.context.models.ExternalLink.update(
    req.body,
    { where: { objectId: linkId, personId }, returning: true }
  );
  if (affectedRows === 0)
    return res.status(404).json({ error: "Link não encontrado." });

  return res.status(200).json(updated[0]);
});

const deleteExternalLink = asyncHandler(async (req, res) => {
  const { personId, linkId } = req.params;
  const { error, status } = await findOwnedPerson(
    req.context.models, personId, req.user.userId
  );
  if (error) return res.status(status).json({ error });

  const deleted = await req.context.models.ExternalLink.destroy({
    where: { objectId: linkId, personId },
  });
  if (deleted === 0)
    return res.status(404).json({ error: "Link não encontrado." });

  return res.status(204).send();
});

export default { getAllExternalLinks, createExternalLink, updateExternalLink, deleteExternalLink };
