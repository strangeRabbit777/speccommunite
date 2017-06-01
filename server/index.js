// @flow
/**
 * The entry point for the server, this is where everything starts
 */
const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = 3001;

const path = require('path');
const fs = require('fs');
const url = require('url');
const { createServer } = require('http');
//$FlowFixMe
const express = require('express');
//$FlowFixMe
const passport = require('passport');
//$FlowFixMe
const session = require('express-session');
//$FlowFixMe
const SessionStore = require('session-rethinkdb')(session);
//$FlowFixMe
const bodyParser = require('body-parser');
//$FlowFixMe
const cookieParser = require('cookie-parser');
//$FlowFixMe
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
//$FlowFixMe
const { SubscriptionServer } = require('subscriptions-transport-ws');
//$FlowFixMe
const { apolloUploadExpress } = require('apollo-upload-server');
//$FlowFixMe
const cors = require('cors');
//$FlowFixMe
const OpticsAgent = require('optics-agent');
//$FlowFixMe
const { maskErrors } = require('graphql-errors');

const { db } = require('./models/db');
const listeners = require('./subscriptions/listeners');
const subscriptionManager = require('./subscriptions/manager');

const schema = require('./schema');
const { init: initPassport } = require('./authentication.js');
import createLoaders from './loaders';
import getMeta from './utils/get-page-meta';

OpticsAgent.instrumentSchema(schema);

console.log('Server starting...');

// Initialize authentication
initPassport();
// API server
const app = express();

app.use(OpticsAgent.middleware());
maskErrors(schema);

app.use(
  cors({
    origin: IS_PROD
      ? ['https://spectrum.chat', /spectrum-(\w|-)+\.now\.sh/]
      : 'http://localhost:3000',
    credentials: true,
  })
);
if (!IS_PROD) {
  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/api',
      subscriptionsEndpoint: `ws://localhost:3001/websocket`,
      query: `{\n  user(id: "58a023a4-912d-48fe-a61c-eec7274f7699") {\n    name\n    username\n    communities {\n      name\n      frequencies {\n        name\n        stories {\n          content {\n            title\n          }\n          messages {\n            message {\n              content\n            }\n          }\n        }\n      }\n    }\n  }\n}`,
    })
  );
}
app.use(cookieParser());
app.use(bodyParser.json());
app.use(apolloUploadExpress());
app.use(
  session({
    store: new SessionStore(db, {
      db: 'spectrum',
      table: 'sessions',
    }),
    // NOTE(@mxstbr): 1Password generated this, LGTM!
    secret: 't3BUqGYFHLNjb7V8xjY6QLECgWy7ByWTYjKkPtuP%R.uLfjNBQKr9pHuKuQJXNqo',
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: IS_PROD ? '/' : 'http://localhost:3000/',
    successRedirect: IS_PROD ? '/home' : 'http://localhost:3000/home',
  })
);
app.use(
  '/api',
  graphqlExpress(req => ({
    schema,
    context: {
      user: req.user,
      loaders: createLoaders(),
      opticsContext: OpticsAgent.context(req),
    },
  }))
);
// In production use express to serve the React app
// In development this is done by react-scripts, which starts its own server
if (IS_PROD) {
  const { graphql } = require('graphql');
  // Load index.html into memory
  var index = fs
    .readFileSync(path.resolve(__dirname, '..', 'build', 'index.html'))
    .toString();
  app.use(
    express.static(path.resolve(__dirname, '..', 'build'), { index: false })
  );
  app.get('*', function(req, res) {
    getMeta(req.url, (query: string): Promise =>
      graphql(schema, query, undefined, {
        loaders: createLoaders(),
        user: req.user,
      })
    ).then(({ title, description }) => {
      // In production inject the meta title and description
      res.send(
        index
          .replace(/%OG_TITLE%/g, title)
          .replace(/%OG_DESCRIPTION%/g, description)
      );
    });
  });
}

import type { Loader } from './loaders/types';
export type GraphQLContext = {
  user: Object,
  loaders: {
    [key: string]: Loader,
  },
};

const server = createServer(app);

// Start subscriptions server
const subscriptionsServer = new SubscriptionServer(
  {
    subscriptionManager,
    onConnect: connectionParams => {
      return {
        loaders: createLoaders(),
      };
    },
  },
  {
    server,
    path: '/websocket',
  }
);

// Start webserver
server.listen(PORT);

// Start database listeners
listeners.start();
console.log('GraphQL server running!');
