import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { db } from "./config/database.js";
import authRouter from "./routers/auth.js";
import materialsRouter from "./routers/materials.js";
import commentsRouter from "./routers/comments.js"

dotenv.config();

// Cria a aplicacao Express diretamente.
const app = express();
// Compartilha o banco com os controllers.
app.locals.db = db;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
// Converte o JSON do formulário em req.body.
app.use(express.json());
// Ao abrir localhost:8081, entrega a tela de login da pasta public.
app.use(express.static(fileURLToPath(new URL("../public", import.meta.url))));

// Cada recurso tem seu proprio router.
app.use("/api", authRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/comments", commentsRouter);

// Erros dos controllers chegam aqui, inclusive nas funções async (Express 5).
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON invalido." });
  }

  console.error(err.message);
  res.status(500).json({ message: "Erro interno. Verifique o servidor e o banco." });
});

// server.js importa esta aplicacao e abre a porta HTTP.
export default app;
