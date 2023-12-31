import sequelize from "@/database/sequelize";
import Elysia from "elysia";

const database = async () => {
  try {
    await sequelize.authenticate();
    return "Connection has been established successfully.";
  } catch (error) {
    return "Unable to connect to the database";
  }
};

const healthCheck = new Elysia({ prefix: "/health-check" }).get(
  "/database",
  database
);

export default healthCheck;
