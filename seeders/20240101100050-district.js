"use strict";

const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const district = await axios.get(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json",
      { responseType: "json" }
    );

    const data = district.data.map((item) => ({
      id: item.id,
      nameThai: item.name_th,
      nameEng: item.name_en,
      provinceId: item.province_id,
    }));

    return queryInterface.bulkInsert("district", data);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("district", null, {});
  },
};
