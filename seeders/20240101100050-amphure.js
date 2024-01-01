"use strict";

const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const amphure = await axios.get(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json",
      { responseType: "json" }
    );

    const amphures = amphure.data.map((amphure) => ({
      id: amphure.id,
      nameThai: amphure.name_th,
      nameEng: amphure.name_en,
      provinceId: amphure.province_id,
    }));

    return queryInterface.bulkInsert("amphure", amphures);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("province", null, {});
  },
};
