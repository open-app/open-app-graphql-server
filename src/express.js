const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { createServer } = require('http')
let { server, subscriptionServer } = require('./graphql')
const schemaStitch = require('./schemaStitch')
const auth = require('./auth')

module.exports = async (sbot, paths, plugins, opts) => {
  const PORT = opts.port || 4000
  const ALLOWED_ORIGIN = opts.cors || `http://localhost:${PORT}`
  const WS_PORT = opts.socketPort || 5000
  schema = await schemaStitch(plugins)

  const app = express()
  app.use(bodyParser.json())
  if (opts.cors) {
    app.use('*', cors({ origin: ALLOWED_ORIGIN }))
  } else {
    app.use(cors())
  }
  app.use('*', auth({ key: opts.auth }))
  server = await server(sbot, paths, opts, schema, { PORT, WS_PORT })
  server.applyMiddleware({
    app,
    cors: true,
  })

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`),
  )

  const websocketServer = createServer(app)

  websocketServer.listen(WS_PORT, () => {
    console.log(`Websocket Server is now running on ws://localhost:${WS_PORT}/graphql`)
    subscriptionServer(sbot, paths, plugins, opts, websocketServer, schema)
  })
}