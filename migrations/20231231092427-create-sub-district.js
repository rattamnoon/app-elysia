"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("subDistrict", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      zipCode: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      nameThai: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      nameEng: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      districtId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "district", key: "id" },
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      deletedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("subDistrict");
  },
};
