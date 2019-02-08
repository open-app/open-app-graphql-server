const express = require('express')
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')
const dat = require('dat-node')
const { PubSub } = require('graphql-subscriptions')
const auth = require('./auth')
const pubsub = new PubSub()

module.exports = (sbot, paths, plugins, opts) => {
  const PORT = opts.port || 4000
  const ALLOWED_ORIGIN = opts.allowed_origin || `http://localhost:${PORT}`
  const WS_PORT = 5000

  let schemas = []

  plugins.map((pl, index) => schemas.push(makeExecutableSchema(pl)))

  const schema = mergeSchemas({
    schemas,
  })

  const server = new ApolloServer({
    schema,
    context: {
      pubsub,
      sbot,
      dat,
      paths,
      opts,
    },
    playground: {
      subscriptionEndpoint: `ws://localhost:${WS_PORT}/graphql`,
      settings: {
        'editor.theme': 'light',
        'editor.cursorShape': 'block',
      },
      tabs: [
        {
          endpoint: `http://localhost:${PORT}/graphql`,
          // query: defaultQuery,
        },
      ],
    },
  })

  const app = express()
  app.use(bodyParser.json())
  app.use('*', cors({ origin: ALLOWED_ORIGIN }))
  app.use('*', auth({ key: opts.key }))
  server.applyMiddleware({ app })

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`),
  )

  const websocketServer = createServer(app)

  websocketServer.listen(WS_PORT, () => {
    console.log(`Websocket Server is now running on ws://localhost:${WS_PORT}/graphql`)
    new SubscriptionServer(
      {
        schema,
        execute,
        subscribe,
        onConnect: (connectionParams, webSocket) => ({ pubsub, sbot, dat, paths }),
      },
      {
        server: websocketServer,
        path: '/graphql',
      },
    )
  })
}