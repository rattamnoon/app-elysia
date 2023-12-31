import sequelize from "@/database/sequelize";

const healthCheck = async () => {
  try {
    await sequelize.authenticate();
    return "Connection has been established successfully.";
  } catch (error) {
    return "Unable to connect to the database";
  }
};

export default healthCheck;
