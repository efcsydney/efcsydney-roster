const ValidationResult = require('./validation-result');
const validator = require('validator');

function validate(user) {
  const validation = new ValidationResult();
  if (!user) {
    validation.addError('Invalid User object');
  }

  if (!validator.isEmail(user.email) || validator.isEmpty(user.email)) {
    validation.addError('The email is invalid.');
  }

  if (validator.isEmpty(user.primaryName)) {
    validation.addError('The primary name is a require field.');
  }

  return validation;
}

module.exports = { validate };
