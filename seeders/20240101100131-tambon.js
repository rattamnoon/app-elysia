"use strict";

const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tambon = await axios.get(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json",
      { responseType: "json" }
    );

    const tambons = tambon.data.map((tambon) => ({
      id: tambon.id,
      nameThai: tambon.name_th,
      nameEng: tambon.name_en,
      zipCode: tambon.zip_code,
      amphureId: tambon.amphure_id,
    }));

    return queryInterface.bulkInsert("tambon", tambons);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("province", null, {});
  },
};
