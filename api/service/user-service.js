const { createUser, updateUser, getUsers } = require('../data/user-repository');

async function saveUser(user) {
  if (user.id) {
    return await updateUser(user);
  } else {
    return await createUser(user);
  }
}

module.exports = {
  saveUser,
  getUsers
};
