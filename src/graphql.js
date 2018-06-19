const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const cors = require('cors')
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')
const dat = require('dat-node')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const server = express()
const PORT = 4000

module.exports = (sbot, paths, plugins, opts) => {
  let schemas = []

  plugins.map((pl, index) => schemas.push(makeExecutableSchema(pl)))

  const schema = mergeSchemas({
    schemas,
  })

  server.use('*', cors({ origin: `http://localhost:${PORT}` }))
  server.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => {  
      return {
        schema,
        context: {
          pubsub,
          sbot,
          dat,
          paths,
        },
      }
    }),
  )

  server.use('/playground', graphiqlExpress({
    endpointURL: `/graphql`,
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  }))

  const ws = createServer(server);
  ws.listen(PORT, () => {
    console.log(`Apollo Server is now running on http://localhost:${PORT}`);
    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
      onConnect: (connectionParams, webSocket) => ({ pubsub, sbot, dat, paths }),
    }, {
      server: ws,
      path: '/subscriptions',
    })
  })
}