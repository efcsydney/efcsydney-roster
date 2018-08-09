const {
  createUser,
  updateUser,
  getUsers: getAllUsers
} = require('../data/user-repository');

async function saveUser(user) {
  if (user.id) {
    return await updateUser(user);
  } else {
    return await createUser(user);
  }
}

async function getUsers() {
  return await getAllUsers();
}

module.exports = {
  saveUser,
  getUsers
};
