import jwt from "jsonwebtoken";

// Middleware que protege rotas privadas.
// Lê o token do header Authorization: Bearer <token>
// e injeta req.user = { userId, username } se válido.

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, username, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

export default authMiddleware;
