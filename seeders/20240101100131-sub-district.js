"use strict";

const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const subDistrict = await axios.get(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json",
      { responseType: "json" }
    );

    const data = subDistrict.data.map((item) => ({
      id: item.id,
      nameThai: item.name_th,
      nameEng: item.name_en,
      zipCode: item.zip_code,
      districtId: item.amphure_id,
    }));

    return queryInterface.bulkInsert("subDistrict", data);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("subDistrict", null, {});
  },
};
