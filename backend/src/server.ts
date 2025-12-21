import "reflect-metadata";
import { AppDataSource } from "./config/db.connection";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Database error", err);
    process.exit(1);
  }
}

bootstrap();
