const { saveUser, getUsers } = require('../service/user-service');
const log = require('../utilities/logger');

async function save(req, res, next) {
  try {
    const user = { id: req.params.id, ...req.body };
    const updatedUser = await saveUser(user);

    res.json({
      result: 'OK',
      error: { message: '' },
      data: updatedUser
    });
  } catch (err) {
    log.error(err);
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const users = await getUsers();

    res.json({
      result: 'OK',
      error: { message: '' },
      data: users
    });
  } catch (err) {
    log.error(err);
    next(err);
  }
}

module.exports = {
  save,
  get
};
