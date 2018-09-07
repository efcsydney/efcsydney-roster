const { saveUser, getUsers } = require('../service/user-service');
const { addChangelog } = require('../service/changelogs-service');
const { validationResult } = require('express-validator/check');
const pusher = require('../utilities/pusher');
const { ok, validationFail } = require('../utilities/response-helper');

const log = require('../utilities/logger');

async function save(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // VALIDATION ERRORS
      return res.status(422).json(validationFail(errors));
    }

    const user = { id: req.params.id, ...req.body };
    const updatedUser = await saveUser(user);

    await addChangelog('user', req, updatedUser);
    pusher.trigger('index', 'user-modified', updatedUser);

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
