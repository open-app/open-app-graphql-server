'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var _require = require('apollo-server-express'),
    ApolloServer = _require.ApolloServer,
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
var PORT = 4000;

module.exports = function (sbot, paths, plugins, opts) {
  var schemas = [];

  plugins.map(function (pl, index) {
    return schemas.push(makeExecutableSchema(pl));
  });

  var schema = mergeSchemas({
    schemas: schemas
  });

  var server = new ApolloServer({
    schema: schema,
    context: {
      pubsub: pubsub,
      sbot: sbot,
      dat: dat,
      paths: paths
    },
    playground: {
      settings: {
        'editor.theme': 'light'
      },
      tabs: [{
        endpoint: 'http://localhost:' + PORT + '/playground'
        // query: defaultQuery,
      }]
    }
  });
  var app = express();
  app.use('*', cors({ origin: 'http://localhost:' + PORT }));
  // app.use('/playground', graphiqlExpress({
  //   endpointURL: `/graphql`,
  //   subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  // }))
  server.applyMiddleware({ app: app });

  app.listen({ port: 4000 }, function () {
    return console.log('\uD83D\uDE80 Server ready at http://localhost:' + PORT + server.graphqlPath);
  });

  var ws = createServer(server);
  // Create WebSocket listener server
  // const websocketServer = createServer((request, response) => {
  //   response.writeHead(404)
  //   response.end()
  // })
  // websocketServer.listen(PORT, () => console.log(
  //   `Websocket Server is now running on http://localhost:${PORT}`
  // ));

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