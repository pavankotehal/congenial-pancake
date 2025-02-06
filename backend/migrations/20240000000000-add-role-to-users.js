'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First check if the column exists
    const tableInfo = await queryInterface.describeTable('Users');
    
    if (!tableInfo.role) {
      // Add the role column if it doesn't exist
      await queryInterface.addColumn('Users', 'role', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'
      });
    }

    // Update specific user to admin (replace with your admin email)
    await queryInterface.sequelize.query(
      `UPDATE Users SET role = 'admin' WHERE email = 'admin@example.com'`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'role');
  }
}; 