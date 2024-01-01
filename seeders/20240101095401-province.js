"use strict";

const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const province = await axios.get(
      " https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json",
      { responseType: "json" }
    );

    const provinces = province.data.map((province) => ({
      id: province.id,
      nameThai: province.name_th,
      nameEng: province.name_en,
    }));

    return queryInterface.bulkInsert("province", provinces);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("province", null, {});
  },
};
