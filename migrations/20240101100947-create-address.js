"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("address", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      provinceId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "province", key: "id" },
      },
      districtId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "district", key: "id" },
      },
      subDistrictId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "subDistrict", key: "id" },
      },
      type: {
        type: Sequelize.DataTypes.ENUM("home", "work", "other"),
        allowNull: false,
      },
      profileId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: { model: "profile", key: "id" },
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

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("address");
  },
};
