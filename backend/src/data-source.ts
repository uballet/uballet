import "reflect-metadata";
import { DataSource } from "typeorm";
import path = require("path");
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./env";

const entities = path.join(__dirname, "./entity/*.js");
const migrations = path.join(__dirname, "/migration/*.js");
const subscribers = path.join(__dirname, "../dist/subscriber/*.js");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "localhost",
  port: DB_PORT ? parseInt(DB_PORT) : 5432,
  username: DB_USER || "postgres",
  password: DB_PASSWORD || "postgres",
  database: DB_NAME || "uballet",
  synchronize: false,
  logging: false,
  migrationsRun: true,
  migrationsTransactionMode: "each",
  entities: [entities],
  migrations: [migrations],
  subscribers: [subscribers],
});
