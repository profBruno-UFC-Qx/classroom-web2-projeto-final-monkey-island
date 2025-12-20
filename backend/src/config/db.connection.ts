import { DataSource } from "typeorm";
import path from "node:path";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "..", "db", "db.sqlite"),
  entities: [],
  migrations: [path.join(__dirname, "..", "migrations", "**", "*.ts")],
  synchronize: false,
  logging: true,
});
