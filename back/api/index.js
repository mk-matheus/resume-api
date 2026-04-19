import "dotenv/config";
import cors from "cors";
import express from "express";
import models, { sequelize } from "./models";
import routes from "./routes";

const app = express();
app.set("trust proxy", true);

// CORS — em produção, substitua pela URL do seu frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware de log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Injeta models no contexto de cada requisição
app.use((req, res, next) => {
  req.context = { models };
  next();
});

// Rotas
app.use("/", routes.root);
app.use("/auth", routes.auth);
app.use("/people", routes.people);

// Handler global de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = process.env.PORT ?? 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE === "true";

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    console.log("⚠️  Banco resetado. Rode novamente com ERASE_DATABASE=false.");
  }

  app.listen(port, () => {
    console.log(`🚀 Resume API rodando na porta ${port}`);
  });
});
