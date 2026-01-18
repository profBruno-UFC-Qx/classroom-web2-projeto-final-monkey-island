import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import researcherRequestRoutes from "./routes/researcher.request.route";
import artifactRoutes from "./routes/artifact.route";
import artifactCollectionRoutes from "./routes/artifact.collection.route";
import communityRoutes from "./routes/community.route";
import communityUserRoutes from "./routes/community.user.route";
import postRoutes from "./routes/post.route";
import postMediaRoutes from "./routes/post.media.routes";
import likeRoutes from "./routes/like.route";
import path from "node:path";
import userRoutes from "./routes/user.routes";
import commentRoutes from "./routes/comment.route";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/images", express.static(path.resolve(__dirname, "..", "public")));

app.use(
  authRoutes,
  userRoutes,
  researcherRequestRoutes,
  artifactRoutes,
  artifactCollectionRoutes,
  communityRoutes,
  communityUserRoutes,
  postRoutes,
  postMediaRoutes,
  likeRoutes,
  commentRoutes,
);

export default app;