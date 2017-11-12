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

```
yarn db-create  // create database
yarn db-migrate // migrate database
```
You can use other sequelize utilities eg. `node_modules/.bin/sequelize db:migrate:undo` to revert migrations

To use different environment, please add environmental variable NODE_ENV=xxx, ie. `NODE_ENV=test npm run db-create`.

## Run test

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

## Deploying

### Background

The app is ready to be deployed to Heroku.

In production, Heroku will use `Procfile` which boots just the server:

```
web: npm run server
```

Inside `server.js`, we tell Node/Express we'd like it to serve static assets in production:

```
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
```

You just need to have Webpack produce a static bundle of the React app (below).

### Steps

We assume basic knowledge of Heroku.

**0. Setup your Heroku account and Heroku CLI**

For installing the CLI tool, see [this article](https://devcenter.heroku.com/articles/heroku-command-line).

**1. Build the React app**

Running `npm run build` creates the static bundle which we can then use any HTTP server to serve:

```
cd client/
npm run build
```

**2. Commit the `client/build` folder to source control**

From the root of the project:

```
git add client/build
git commit -m 'Adding `build` to source control'
```

# AWS

Deploy to AWS EC2 host

** Get SSH key from admin Kai/Liam **

**dploy to qa environment**

```
yarn deploy:qa
```

**dploy to production environment**

```
yarn deploy:prod
```

# Heroku

**1. Create the Heroku app**

```
heroku apps:create food-lookup-demo
```

**2. Push to Heroku**

```
git push heroku master
```

Heroku will give you a link at which to view your live app.
