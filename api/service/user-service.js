const {
  createUser,
  updateUser,
  getUsers: getAllUsers
} = require('../data/user-repository');
const {
  validate: validateUser
} = require('../models-validator/user-validator');
const ValidationError = require('../models-validator/validation-error');
const ValidationResult = require('../models-validator/validation-result');
const Sequelize = require('sequelize');

async function saveUser(user) {
  const validationResult = validateUser(user);
  if (!validationResult.success) {
    throw new ValidationError(validationResult);
  }

  try {
    if (user.id) {
      return await updateUser(user);
    } else {
      return await createUser(user);
    }
  } catch (err) {
    if (err instanceof Sequelize.UniqueConstraintError) {
      throw new ValidationError(
        new ValidationResult('The email already exists in the database')
      );
    }
    throw err;
  }
}

async function getUsers() {
  return await getAllUsers();
}

module.exports = {
  saveUser,
  getUsers
};
