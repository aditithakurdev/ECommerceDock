"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "currency", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "usd",
    });

    await queryInterface.addColumn("orders", "stripePaymentIntentId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("orders", "stripeCustomerId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("orders", "paymentMethod", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "currency");
    await queryInterface.removeColumn("orders", "stripePaymentIntentId");
    await queryInterface.removeColumn("orders", "stripeCustomerId");
    await queryInterface.removeColumn("orders", "paymentMethod");
  },
};
