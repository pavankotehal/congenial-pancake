const { Sequelize } = require('sequelize');
const path = require('path');

// Create the sequelize instance with the full path to the SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'), // Use absolute path
  logging: false
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Make sure we're exporting the sequelize instance
module.exports = sequelize; 