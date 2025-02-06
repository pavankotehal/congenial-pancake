'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('Users', 'role', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'
      });

      // Set admin role for a specific user (replace with your admin email)
      await queryInterface.sequelize.query(
        `UPDATE Users SET role = 'admin' WHERE email = ?`,
        {
          replacements: ['admin@example.com'], // Replace with your admin email
          type: Sequelize.QueryTypes.UPDATE
        }
      );
    } catch (error) {
      console.error('Migration error:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('Users', 'role');
    } catch (error) {
      console.error('Migration rollback error:', error);
    }
  }
}; 