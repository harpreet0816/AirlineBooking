'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Airplanes', [
      { modelNumber: 'A320', capacity: 180, createdAt: new Date(), updatedAt: new Date() },
      { modelNumber: 'B737', capacity: 160, createdAt: new Date(), updatedAt: new Date() },
      { modelNumber: 'A350', capacity: 300, createdAt: new Date(), updatedAt: new Date() },
      { modelNumber: 'B777', capacity: 350, createdAt: new Date(), updatedAt: new Date() },
      { modelNumber: 'A380', capacity: 500, createdAt: new Date(), updatedAt: new Date() },
      { modelNumber: 'B787', capacity: 250, createdAt: new Date(), updatedAt: new Date() },
      { modelNumber: 'CRJ900', capacity: 90, createdAt: new Date(), updatedAt: new Date() },
      { modelNumber: 'E190', capacity: 100, createdAt: new Date(), updatedAt: new Date() },
      { modelNumber: 'MD-11', capacity: 293, createdAt: new Date(), updatedAt: new Date() },
      { modelNumber: 'DC-10', capacity: 270, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Airplanes', null, {});
  }
};
