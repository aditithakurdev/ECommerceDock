import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config(); // load .env variables
// const sequelize = new Sequelize('sqlite::memory')
// const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/ecommercedb');

const db = new Sequelize(
 process.env.DB_NAME!,        // database name
  process.env.DB_USER!,        // username
  process.env.DB_PASSWORD!,    // password
  {
    host: process.env.DB_HOST!,              // correct env variable
    port:Number(process.env.DB_PORT),       // convert port to number
    dialect: "postgres",                     // correct spelling
    logging: console.log,                           // optional: disable SQL logging
  }
);

export default db;