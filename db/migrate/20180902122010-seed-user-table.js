'use strict';
const { getEmailList } = require('../../api/service/send-email-service');
const { saveUser } = require('../../api/service/user-service');

module.exports = {
  up: async () => {
    /*
    The getEmailList function returns an array that contains the following objects
      [
        {
          email: 'fake_email@email.com,
          englishName: '',
          chineseName: '',
        }
      ]
    */
    const userEmails = getEmailList();

    const users = userEmails.map(mapToUser);

    for (var user of users) {
      if (!user.email || !user.primaryName) {
        continue;
      }

      await saveUser(user);
    }
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  }
};

function mapToUser(userEmail) {
  const { chineseName, englishName, email } = userEmail;
  return {
    primaryName: englishName,
    secondaryName: chineseName,
    email
  };
}
