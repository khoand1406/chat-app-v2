import { Sequelize } from "sequelize-typescript";
import { models } from "../models";

console.log("Database configuration loaded");
export const sequelize = new Sequelize({
  dialect: "mssql",
  host: "DESKTOP-Q6BEF3C",
  database: "ChatApp",
  username: "khoand",
  password: "12345",
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    }
  },
  logging: console.log,
});

sequelize.addModels(models);

