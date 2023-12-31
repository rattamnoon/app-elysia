import { Sequelize } from "@sequelize/core";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "password",
  database: "db",
  //   models: [],
});

export default sequelize;
