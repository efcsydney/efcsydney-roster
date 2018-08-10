const ValidationResult = require('./validation-result');
const validator = require('validator');

function validate(user) {
  const validation = new ValidationResult();
  if (!user) {
    return validation.addError('Invalid User object');
  }

  if (!user.email) {
    return validation.addError('User email is a require field.');
  }

  if (!validator.isEmail(user.email)) {
    return validation.addError('The email is invalid.');
  }

  if (validator.isEmpty(user.primaryName)) {
    return validation.addError('The primary name is a require field.');
  }

  return validation;
}

module.exports = { validate };
