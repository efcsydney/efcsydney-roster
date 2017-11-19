# efcsydney-roster

## Reference

* [Using create-react-app with a server](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/)

## Installation

### Install Node.js > 8.9.0

Please make sure your Node.js version is newer than `8.9.0`.
You can have multiple Node.js versions by using [nvm](https://github.com/creationix/nvm)
```
nvm install 8
```

### Install AVN

Use [avn](https://github.com/wbyoung/avn) for switching versions automatically according to `.node-version`.
```
yarn global add avn avn-nvm
avn setup
```

### Install Source code

```
git clone git@github.com:efcsydney/efcsydney-roster.git
cd efcsydney-roster
yarn

cd client
yarn

cd ..
```

## Setup database

Download and install MySql server. Browse to (https://dev.mysql.com/downloads/mysql/) and download MySql community server and MySql Workbench.

Make sure that the root user password is leave as blank. If the root user password has been set, execute the following query to remove the password.

```
SET PASSWORD FOR root@localhost=PASSWORD('');
```
Once MySql server is installed and the root user is configured, execute the following command. Make sure the working folder is set to the project root directory.

```
yarn db-create  // create database
yarn db-migrate // migrate database
yarn db-seed    // seed database
```
You can use other sequelize utilities eg. `node_modules/.bin/sequelize db:migrate:undo` to revert migrations

To use different environment, please add environmental variable NODE_ENV=xxx, ie. `NODE_ENV=test npm run db-create`.

## Run test

First you will have to setup the test database

```
NODE_ENV=test yarn db-create  // create database
NODE_ENV=test yarn db-migrate // migrate database
NODE_ENV=test yarn db-seed    // seed database
```

```
yarn test // will run unit test and integration test
```

## Start the server

```
yarn start
```

[http://localhost:3000/](http://localhost:3000/)

## Overview

`create-react-app` configures a Webpack development server to run on `localhost:3000`. This development server will bundle all static assets located under `client/src/`. All requests to `localhost:3000` will serve `client/index.html` which will include Webpack's `bundle.js`.

To prevent any issues with CORS, the user's browser will communicate exclusively with the Webpack development server.

Inside `Client.js`, we use Fetch to make a request to the API:

```js
// Inside Client.js
return fetch(`/api/food?q=${query}`, {
  // ...
})
```

This request is made to `localhost:3000`, the Webpack dev server. Webpack will infer that this request is actually intended for our API server. We specify in `package.json` that we would like Webpack to proxy API requests to `localhost:3001`:

```js
// Inside client/package.json
"proxy": "http://localhost:3001/",
```

This handy features is provided for us by `create-react-app`.

Therefore, the user's browser makes a request to Webpack at `localhost:3000` which then proxies the request to our API server at `localhost:3001`:

![](./flow-diagram.png)

This setup provides two advantages:

1. If the user's browser tried to request `localhost:3001` directly, we'd run into issues with CORS.
2. The API URL in development matches that in production. You don't have to do something like this:

```js
// Example API base URL determination in Client.js
const apiBaseUrl = process.env.NODE_ENV === 'development' ? 'localhost:3001' : '/'
```

This setup uses [concurrently](https://github.com/kimmobrunfeldt/concurrently) for process management. Executing `npm start` instructs `concurrently` to boot both the Webpack dev server and the API server.

## Deploy

Deploy to QA server hostname: http://demo-roster.efcsydney.org

```
yarn deploy:qa
```


Deploy to Production server (Todo) http://roster.efcsydney.org

```
yarn deploy:prod
```
