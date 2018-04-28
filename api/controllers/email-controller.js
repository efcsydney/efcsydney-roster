const { getCurrentEmailHTML } = require('../service/send-email-service');

module.exports = {
  getEmail: async (req, res, next) => {
    try {
      const emailHTML = await getCurrentEmailHTML();
      res.send(emailHTML);
    } catch (err) {
      next(err);
    }
  }
};
