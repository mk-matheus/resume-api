import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    name: "Resume API",
    version: "2.0.0",
    status: "ok",
    docs: "https://github.com/mk-matheus/resume-api",
    endpoints: {
      auth: [
        "POST /auth/register",
        "POST /auth/login",
        "GET  /auth/me  (privado)",
      ],
      public: [
        "GET /people",
        "GET /people/:personId",
        "GET /people/u/:username",
      ],
      private: [
        "PUT    /people/:personId",
        "DELETE /people/:personId",
        "POST   /people/:personId/experiences",
        "PUT    /people/:personId/experiences/:id",
        "DELETE /people/:personId/experiences/:id",
        "POST   /people/:personId/educations",
        "PUT    /people/:personId/educations/:id",
        "DELETE /people/:personId/educations/:id",
        "POST   /people/:personId/skills",
        "PUT    /people/:personId/skills/:id",
        "DELETE /people/:personId/skills/:id",
        "POST   /people/:personId/resumes",
        "PUT    /people/:personId/resumes/:id",
        "DELETE /people/:personId/resumes/:id",
        "POST   /people/:personId/externallinks",
        "PUT    /people/:personId/externallinks/:id",
        "DELETE /people/:personId/externallinks/:id",
      ],
    },
  });
});

export default router;
