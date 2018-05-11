const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress } = require('apollo-server-express')
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const { altairExpress } = require('altair-express-middleware')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

// const myGraphQLSchema = // ... define or import your schema here!
const PORT = 4000

module.exports = (sbot, plugins, opts) => {
  const app = express()
  let schemas = []
  plugins.map((pl, index) => schemas.push(makeExecutableSchema(pl)))
  const schema = mergeSchemas({
    schemas,
  })
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context: { pubsub, sbot }}))
  app.use('/playground', altairExpress({
    endpointURL: `/graphql`,
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  }))

  app.listen(PORT, () => {
    console.log('Started GraphQL server at', PORT)
  })
}