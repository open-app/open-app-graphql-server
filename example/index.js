const server = require('../')
const ssbDefaults = require('ssb-graphql-defaults')
const datTypes = require('dat-graphql')

server([
  ssbDefaults,
  datTypes
])