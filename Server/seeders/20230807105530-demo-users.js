'use strict';
// const bcrypt = require('bcryptjs');
const { hashPassword } = require('../helpers/bcrypt');
// const { secretKey } = require('../helpers/jwt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let dataUsers = require('../data/users.json');
    dataUsers.forEach(el => {
      el.password = hashPassword(el.password);
      el.createdAt = el.updatedAt = new Date();
    });
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert("Users", dataUsers, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  }
};
