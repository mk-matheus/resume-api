import asyncHandler from "../utils/asyncHandler";
import findOwnedPerson from "../utils/findOwnedPerson";
import { pickFields } from "../utils/sanitizers";

const ALLOWED_FIELDS = ["type", "url"];

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

  const data = pickFields(req.body, ALLOWED_FIELDS);

  const link = await req.context.models.ExternalLink.create({
    ...data,
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

  const data = pickFields(req.body, ALLOWED_FIELDS);

  const [affectedRows, updated] = await req.context.models.ExternalLink.update(
    data,
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
