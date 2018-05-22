const log = require('../utilities/logger');
const { getCurrentEmailHTML } = require('../service/send-email-service');

module.exports = {
  getEmail: async (req, res, next) => {
    try {
      log.info('getEmail');
      const emailHTML = await getCurrentEmailHTML();
      res.send(emailHTML);
    } catch (err) {
      log.error(err);
      next(err);
    }
  }
};
