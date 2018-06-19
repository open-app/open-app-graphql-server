'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var _require = require('apollo-server-express'),
    graphqlExpress = _require.graphqlExpress,
    graphiqlExpress = _require.graphiqlExpress;

var cors = require('cors');

var _require2 = require('graphql-tools'),
    mergeSchemas = _require2.mergeSchemas,
    makeExecutableSchema = _require2.makeExecutableSchema;

var _require3 = require('subscriptions-transport-ws'),
    SubscriptionServer = _require3.SubscriptionServer;

var _require4 = require('graphql'),
    execute = _require4.execute,
    subscribe = _require4.subscribe;

var _require5 = require('http'),
    createServer = _require5.createServer;

var dat = require('dat-node');

var _require6 = require('graphql-subscriptions'),
    PubSub = _require6.PubSub;

var pubsub = new PubSub();
var server = express();
var PORT = 4000;

module.exports = function (sbot, paths, plugins, opts) {
  var schemas = [];

  plugins.map(function (pl, index) {
    return schemas.push(makeExecutableSchema(pl));
  });

  var schema = mergeSchemas({
    schemas: schemas
  });

  server.use('*', cors({ origin: 'http://localhost:' + PORT }));
  server.use('/graphql', bodyParser.json(), graphqlExpress(function (req) {
    return {
      schema: schema,
      context: {
        pubsub: pubsub,
        sbot: sbot,
        dat: dat,
        paths: paths
      }
    };
  }));

  server.use('/playground', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:' + PORT + '/subscriptions'
  }));

  var ws = createServer(server);
  ws.listen(PORT, function () {
    console.log('Apollo Server is now running on http://localhost:' + PORT);
    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer({
      execute: execute,
      subscribe: subscribe,
      schema: schema,
      onConnect: function onConnect(connectionParams, webSocket) {
        return { pubsub: pubsub, sbot: sbot, dat: dat, paths: paths };
      }
    }, {
      server: ws,
      path: '/subscriptions'
    });
  });
};