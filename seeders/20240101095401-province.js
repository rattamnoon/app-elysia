"use strict";

const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const province = await axios.get(
      " https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json",
      { responseType: "json" }
    );

    const data = province.data.map((item) => ({
      id: item.id,
      nameThai: item.name_th,
      nameEng: item.name_en,
    }));

    return queryInterface.bulkInsert("province", data);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("province", null, {});
  },
};
