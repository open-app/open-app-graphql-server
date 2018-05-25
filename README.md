# Proof-of-Concept

## Usage

```
const server = require('open-app-graphql-server')
const ssbDefaults = require('ssb-graphql-defaults')

server([
  ssbDefaults
])
// Starts a Secure Scuttlebot server and a client that feeds a GraphQL layer
// Use http://localhost:4000/graphql for queries, /subscriptions for subscriptions and /playground for interactive GraphQL IDE
// The defaults plugin takes care of bringing the right SSB plugins as well as GraphQL types and resolvers to be stitched together
```

### Todo

- Move `fs` stuff to client, start server with query containing paths
