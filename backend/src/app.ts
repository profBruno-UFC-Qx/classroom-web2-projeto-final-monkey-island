import express from "express";
import cors from "cors"; // 1. Importe o cors
import authRoutes from "./routes/auth.route";
import researcherRequestRoutes from "./routes/researcher.request.route";
import artifactRoutes from "./routes/artifact.route";
import path from "node:path";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/images", express.static(path.resolve(__dirname, "..", "public")));

// As rotas devem vir depois do cors e do json
app.use(authRoutes, researcherRequestRoutes, artifactRoutes);

export default app;