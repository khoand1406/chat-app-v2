import { Sequelize } from "sequelize-typescript";
import { models } from "../models";

console.log("Database configuration loaded");
import { Dialect } from "sequelize";

export const sequelize = new Sequelize({
  dialect: (process.env.DB_DIALECT as Dialect) || "mssql",
  host: process.env.DB_HOST || "DESKTOP-Q6BEF3C",
  database: process.env.DB_NAME || "ChatApp",
  username: process.env.DB_USER || "khoand",
  password: process.env.DB_PASSWORD || "12345",
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    }
  },
  logging: console.log,
});

sequelize.addModels(models);

