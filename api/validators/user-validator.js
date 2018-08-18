const { check } = require('express-validator/check');

module.exports = [
  check('email')
    .isEmail()
    .withMessage('The email is not a valid Email'),
  check('primaryName')
    .isLength({ min: 3 })
    .withMessage('The primary name must be at least 3 characters long.')
];
