const { ApolloServer } = require('apollo-server-express')
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const dat = require('dat-node')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

let schemas = []
let schema = (plugins) => {
  plugins.map((pl, index) => schemas.push(makeExecutableSchema(pl)))
  return mergeSchemas({
    schemas,
  }) 
}

const server = (sbot, paths, opts, schema, ports) => new ApolloServer({
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

const subscriptionServer = (sbot, paths, plugins, opts, websocketServer, schema) => new SubscriptionServer(
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
  schema,
}