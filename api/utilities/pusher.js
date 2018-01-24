const Pusher = require('pusher');
const config = require('config');

module.exports = new Pusher({
  appId: config.get('pusher.appId'),
  key: config.get('pusher.key'),
  secret: config.get('pusher.secret'),
  cluster: config.get('pusher.cluster')
});
