const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { createServer } = require('http')
let { server, subscriptionServer, schema } = require('./graphql')
const auth = require('./auth')

module.exports = (sbot, paths, plugins, opts) => {
  const PORT = opts.port || 4000
  const ALLOWED_ORIGIN = opts.cors || `http://localhost:${PORT}`
  const WS_PORT = opts.socketPort || 5000
  schema = schema(plugins)

  const app = express()
  app.use(bodyParser.json())
  if (opts.cors) {
    app.use('*', cors({ origin: ALLOWED_ORIGIN }))
  }
  app.use('*', auth({ key: opts.auth }))
  server = server(sbot, paths, opts, schema, { PORT, WS_PORT })
  server.applyMiddleware({
    app,
    cors: opts.cors ? true : false,
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