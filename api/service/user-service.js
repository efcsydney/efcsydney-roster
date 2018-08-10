const {
  createUser,
  updateUser,
  getUsers: getAllUsers
} = require('../data/user-repository');
const { validate } = require('../models-validator/user-validator');
const ValidationError = require('../models-validator/validation-error');
const ValidationResult = require('../models-validator/validation-result');
const Sequelize = require('sequelize');

async function saveUser(user) {
  handleUserValidation(user);

  try {
    if (user.id) {
      return await updateUser(user);
    } else {
      return await createUser(user);
    }
  } catch (err) {
    handleUniqueEmailValidation(err);
    throw err;
  }
}

function handleUserValidation(user) {
  const result = validate(user);
  if (!result.success) {
    throw new ValidationError(result);
  }
}

function handleUniqueEmailValidation(err) {
  if (err instanceof Sequelize.UniqueConstraintError) {
    throw new ValidationError(
      new ValidationResult('The email already exists in the database')
    );
  }
}

async function getUsers() {
  return await getAllUsers();
}

module.exports = {
  saveUser,
  getUsers
};
