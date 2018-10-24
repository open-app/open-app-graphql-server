const server = require('../')
const ssb = require('ssb-graphql-defaults')
const dat = require('dat-graphql')
const apphub = require('apphub-graphql')
const economic = require('economic-sentences-graphql')

server([
  ssb,
  dat,
  apphub,
  economic
])