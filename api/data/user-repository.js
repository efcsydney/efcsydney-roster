const User = require('../models/user').User;

async function createUser(user) {
  return await User.create(user);
}

async function updateUser(user) {
  await User.update(user, {
    where: { id: user.id }
  });
  return user;
}

async function getUsers() {
  return await User.findAll();
}

module.exports = {
  createUser,
  updateUser,
  getUsers
};
