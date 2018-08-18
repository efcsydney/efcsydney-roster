const { saveUser, getUsers } = require('../service/user-service');
const { validationResult } = require('express-validator/check');
const toValidationErrorString = require('../utilities/express-validator-helper');
const { ok, fail } = require('../utilities/response-helper');

const log = require('../utilities/logger');

async function save(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // VALIDATION ERRORS
      return res.status(422).json(fail(toValidationErrorString(errors)));
    }

    const user = { id: req.params.id, ...req.body };
    const updatedUser = await saveUser(user);

    res.json(ok(updatedUser));
  } catch (err) {
    log.error(err);
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const users = await getUsers();

    res.json(ok(users));
  } catch (err) {
    log.error(err);
    next(err);
  }
}

module.exports = {
  save,
  get
};
