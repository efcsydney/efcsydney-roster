const fs = require('fs');
const _ = require('lodash');
const { promisify } = require('util');
const Heroku = require('heroku-client');
const heroku = new Heroku({ token: '31ec6739-f215-49ca-92d2-3e777e9fd083' });

async function exec() {
  console.log('Updating the config/database.json ...'); // eslint-disable-line
  const app = await heroku.get('/apps/efcsydney-roster/config-vars');
  const url = _.get(app, 'CLEARDB_DATABASE_URL', '');
  const matches = url.match(/mysql:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)$/);
  const config = {
    production: _.defaults(
      {
        username: matches[1],
        password: matches[2],
        host: matches[3]
      },
      {
        username: 'root',
        password: null,
        host: '127.0.0.1',
        database: 'efcRoster',
        dialect: 'mysql',
        logging: false
      }
    )
  };

  await promisify(fs.writeFile)(
    __dirname + '/../config/database.json',
    JSON.stringify(config, null, 2)
  );

  console.log('Updated successfully'); // eslint-disable-line
}

exec().catch(e => {
  console.log(`Failed - ${e.body.message}`); // eslint-disable-line
});
