import "reflect-metadata"
import { DataSource } from "typeorm"
import path = require("path")
import { configDotenv } from "dotenv"
configDotenv();

const entities = path.join(__dirname, '../dist/entity/*.js')
const migrations = path.join(__dirname, '../dist/migration/*.js')
const subscribers = path.join(__dirname, '../dist/subscriber/*.js')

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE_NAME || "uballet",
    synchronize: false,
    logging: false,
    migrationsRun: true,
    migrationsTransactionMode: 'each',
    entities: [entities],
    migrations: [migrations],
    subscribers: [subscribers],
})
