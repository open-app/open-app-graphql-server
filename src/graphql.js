const express = require('express')
const bodyParser = require('body-parser')
const { ApolloServer, graphiqlExpress } = require('apollo-server-express')
const cors = require('cors')
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')
const dat = require('dat-node')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const PORT = 4000

module.exports = (sbot, paths, plugins, opts) => {
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
    },
    playground: {
      settings: {
        'editor.theme': 'light',
      },
      tabs: [
        {
          endpoint: `http://localhost:${PORT}/playground`,
          // query: defaultQuery,
        },
      ],
    },
  })
  const app = express()
  app.use('*', cors({ origin: `http://localhost:${PORT}` }))
  // app.use('/playground', graphiqlExpress({
  //   endpointURL: `/graphql`,
  //   subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  // }))
  server.applyMiddleware({ app })

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`),
  )


  const ws = createServer(server)
  // Create WebSocket listener server
  // const websocketServer = createServer((request, response) => {
  //   response.writeHead(404)
  //   response.end()
  // })
  // websocketServer.listen(PORT, () => console.log(
  //   `Websocket Server is now running on http://localhost:${PORT}`
  // ));
  
  ws.listen(PORT, () => {
    console.log(`Apollo Server is now running on http://localhost:${PORT}`)
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