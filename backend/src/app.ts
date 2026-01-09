import express from "express";
import authRoutes from "./routes/auth.route";
import researcherRequestRoutes from "./routes/researcher.request.route";
import artifactRoutes from "./routes/artifact.route";
import artifactCollectionRoutes from "./routes/artifact.collection.route";
import communityRoutes from "./routes/community.route";
import communityUserRoutes from "./routes/community.user.route";
import postRoutes from "./routes/post.route";
import postMediaRoutes from "./routes/post.media.routes";
import path from "node:path";

const app = express();
app.use(express.json());
app.use("/images", express.static(path.resolve(__dirname, "..", "public")));

app.use(
  authRoutes,

  researcherRequestRoutes,
  artifactRoutes,
  artifactCollectionRoutes,
  communityRoutes,
  communityUserRoutes,
  postRoutes,
  postMediaRoutes
);

export default app;
