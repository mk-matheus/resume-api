import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";

// POST /auth/register
// Cria User + Person vinculada em uma única operação
const register = asyncHandler(async (req, res) => {
  const { username, email, password, name, phone } = req.body;
  const models = req.context.models;

  // Verifica duplicatas antes de criar
  const existingUser = await models.User.findOne({
    where: { email },
  });
  if (existingUser) {
    return res.status(409).json({ error: "E-mail já cadastrado." });
  }

  const existingUsername = await models.User.findOne({
    where: { username },
  });
  if (existingUsername) {
    return res.status(409).json({ error: "Username já está em uso." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Cria o usuário e automaticamente cria o currículo (Person) vinculado
  const user = await models.User.create({ username, email, passwordHash });

  const person = await models.Person.create({
    name: name || username,
    email,
    phone: phone || null,
    userId: user.objectId,
  });

  const token = jwt.sign(
    { userId: user.objectId, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return res.status(201).json({
    token,
    user: {
      id: user.objectId,
      username: user.username,
      email: user.email,
    },
    person: {
      id: person.objectId,
      name: person.name,
    },
  });
});

// POST /auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const models = req.context.models;

  const user = await models.User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const token = jwt.sign(
    { userId: user.objectId, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return res.status(200).json({
    token,
    user: {
      id: user.objectId,
      username: user.username,
      email: user.email,
    },
  });
});

// GET /auth/me — retorna dados do usuário logado + Person
const me = asyncHandler(async (req, res) => {
  const models = req.context.models;

  const user = await models.User.findByPk(req.user.userId, {
    attributes: { exclude: ["passwordHash"] },
    include: [
      {
        model: models.Person,
        include: [
          models.Resume,
          models.Education,
          models.Experience,
          models.Skill,
          models.ExternalLink,
        ],
      },
    ],
  });

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  return res.status(200).json(user);
});

export default { register, login, me };
