import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "password",
  database: "db",
  define: {
    paranoid: true,
    timestamps: true,
  },
  //   models: [],
});

export default sequelize;
