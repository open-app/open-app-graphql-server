const { ApolloServer } = require('apollo-server-express')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const schemaStitch = require('./schemaStitch')

const dat = require('dat-node')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const server = async (sbot, paths, opts, schema, ports) => new ApolloServer({
  schema,
  context: {
    pubsub,
    sbot,
    dat,
    paths,
    opts,
  },
  playground: {
    subscriptionEndpoint: `ws://localhost:${ports.WS_PORT}/graphql`,
    settings: {
      'editor.theme': 'light',
      'editor.cursorShape': 'block',
    },
    tabs: [
      {
        endpoint: `http://localhost:${ports.PORT}/graphql`,
        // query: defaultQuery,
      },
    ],
  },
})

const subscriptionServer = async (sbot, paths, plugins, opts, websocketServer, schema) => new SubscriptionServer(
  {
    schema,
    execute,
    subscribe,
    onConnect: (connectionParams, webSocket) => ({ pubsub, sbot, dat, paths }),
  },
  {
    server: websocketServer,
    path: '/graphql',
  }
)

module.exports = {
  server,
  subscriptionServer,
}