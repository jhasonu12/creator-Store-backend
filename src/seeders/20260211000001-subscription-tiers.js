'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Sample subscription tiers
    return queryInterface.bulkInsert('subscription_tiers', [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Starter',
        description: 'Basic tier for new creators',
        price: 5.99,
        billingCycle: 'monthly',
        features: JSON.stringify(['Basic Analytics', 'Email Support']),
        maxSupport: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Pro',
        description: 'Pro tier with advanced features',
        price: 19.99,
        billingCycle: 'monthly',
        features: JSON.stringify(['Advanced Analytics', 'Priority Support', 'Custom Branding']),
        maxSupport: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Enterprise',
        description: 'Enterprise tier for established creators',
        price: 49.99,
        billingCycle: 'monthly',
        features: JSON.stringify(['Full Analytics', '24/7 Support', 'Custom Branding', 'API Access']),
        maxSupport: 10,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('subscription_tiers', null, {});
  }
};
