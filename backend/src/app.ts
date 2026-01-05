import express from "express";
import cors from "cors"; // 1. Importe o cors
import authRoutes from "./routes/auth.route";
import researcherRequestRoutes from "./routes/researcher.request.route";
import artifactRoutes from "./routes/artifact.route";
import artifactCollectionRoutes from "./routes/artifact.collection.route";
import communityRoutes from "./routes/community.route";
import communityUserRoutes from "./routes/community.user.route";
import path from "node:path";

const app = express();

// 2. Configure o CORS (MUITO IMPORTANTE: Deve vir antes das rotas e do json)
app.use(cors({
  origin: "http://localhost:5173", // Permite apenas o seu Frontend Vite
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/images", express.static(path.resolve(__dirname, "..", "public")));

// 3. Suas rotas
app.use(
  authRoutes,
  researcherRequestRoutes,
  artifactRoutes,
  artifactCollectionRoutes,
  communityRoutes,
  communityUserRoutes
);

export default app;