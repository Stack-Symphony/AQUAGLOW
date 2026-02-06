'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('services', [
      {
        name: 'Full Detail',
        description: 'Complete interior/exterior clean + wax + engine',
        basePrice: 1200.00,
        duration: 180,
        vehicleTypes: ['SEDAN','SUV','TRUCK','LUXURY'],
        category: 'premium',
        features: ['Full wash','Deep interior','Wax protection','Engine bay clean'],
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // add others...
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('services', null, {});
  }
};