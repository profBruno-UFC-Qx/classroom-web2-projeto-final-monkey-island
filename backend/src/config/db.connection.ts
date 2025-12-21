import { DataSource } from "typeorm";
import path from "node:path";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "..", "db", "db.sqlite"),
  entities: [path.join(__dirname, "..", "entities", "*.ts")],
  migrations: [path.join(__dirname, "..", "migrations", "**", "*.ts")],
  synchronize: false,
  logging: true,
});
