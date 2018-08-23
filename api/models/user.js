const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;

const User = sequelizeClient.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  primaryName: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  secondaryName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  phone: {
    type: Sequelize.STRING
  }
});

module.exports = {
  User
};
