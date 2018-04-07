const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { altairExpress } = require('altair-express-middleware');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

// const myGraphQLSchema = // ... define or import your schema here!
const PORT = 4000;

module.exports = (sbot, plugins, opts) => {
  const app = express();
  // bodyParser is needed just for POST.
  const { typeDefs, resolvers } = plugins
  app.use('/graphql', bodyParser.json(), graphqlExpress({ typeDefs, resolvers, context: { pubsub, sbot }}));
  app.use('/playground', altairExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  }));

  app.listen(PORT, () => {
    console.log('Started GraphQL server at', PORT)
  });
}