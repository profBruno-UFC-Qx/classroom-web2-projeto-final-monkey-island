import express from "express";
import authRoutes from "./routes/auth.route";
import researcherRequestRoutes from "./routes/researcher.request.route";
import path from "node:path";

const app = express();
app.use(express.json());
app.use("/images", express.static(path.resolve(__dirname, "..", "public")));

app.use(authRoutes, researcherRequestRoutes);

export default app;
