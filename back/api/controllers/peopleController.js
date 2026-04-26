import asyncHandler from "../utils/asyncHandler";

const getAllPeople = asyncHandler(async (req, res) => {
  const people = await req.context.models.Person.findAll({
    attributes: { exclude: ["userId"] },
  });
  return res.status(200).json(people);
});

// Rota pública — usada pela página /u/:username do frontend
const getPersonByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const models = req.context.models;

  const user = await models.User.findOne({
    where: { username },
    attributes: [],
    include: [
      {
        model: models.Person,
        include: [
          { model: models.Resume },
          { model: models.Education },
          { model: models.Experience },
          { model: models.Skill },
          { model: models.ExternalLink },
        ],
      },
    ],
  });

  if (!user || !user.Person) {
    return res.status(404).json({ error: "Currículo não encontrado." });
  }

  return res.status(200).json(user.Person);
});

const getPersonById = asyncHandler(async (req, res) => {
  const person = await req.context.models.Person.findByPk(
    req.params.personId,
    {
      include: [
        { model: req.context.models.Resume },
        { model: req.context.models.Education },
        { model: req.context.models.Experience },
        { model: req.context.models.Skill },
        { model: req.context.models.ExternalLink },
      ],
    }
  );

  if (!person) {
    return res.status(404).json({ error: "Pessoa não encontrada." });
  }

  return res.status(200).json(person);
});

const updatePerson = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const models = req.context.models;

  const person = await models.Person.findByPk(personId);
  if (!person) {
    return res.status(404).json({ error: "Pessoa não encontrada." });
  }

  // Garante que só o dono pode editar
  if (person.userId !== req.user.userId) {
    return res.status(403).json({ error: "Acesso negado." });
  }

  const allowedFields = ["name", "email", "phone", "jobTitle", "location", "avatarUrl"];
  const data = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  });

  await person.update(data);
  return res.status(200).json(person);
});

const deletePerson = asyncHandler(async (req, res) => {
  const { personId } = req.params;
  const models = req.context.models;

  const person = await models.Person.findByPk(personId);
  if (!person) {
    return res.status(404).json({ error: "Pessoa não encontrada." });
  }

  if (person.userId !== req.user.userId) {
    return res.status(403).json({ error: "Acesso negado." });
  }

  // Deleta o User (que por CASCADE remove a Person e todos os sub-recursos)
  await models.User.destroy({ where: { objectId: person.userId } });
  return res.status(204).send();
});

export default {
  getAllPeople,
  getPersonByUsername,
  getPersonById,
  updatePerson,
  deletePerson,
};
