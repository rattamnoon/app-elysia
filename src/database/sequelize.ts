import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "db",
  port: 5432,
  username: "user",
  password: "password",
  database: "db",
  define: {
    paranoid: true,
    timestamps: true,
  },
  // models: [],
  logging: false,
});

export default sequelize;
