import _ from 'lodash';
import Pusher from 'pusher-js';
import config from 'config/pusher.json';

const env = process.env.NODE_ENV;
const key = _.get(config, `${env}.key`, null);
const cluster = _.get(config, `${env}.cluster`, null);

const pusher = new Pusher(key, {
  cluster,
  encrypted: true
});

export default pusher;
