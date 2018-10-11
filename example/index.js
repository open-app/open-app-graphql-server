require("@babel/polyfill") // required by ssb-graphql-defaults

const server = require('../')
const ssbDefaults = require('ssb-graphql-defaults')
const dat = require('dat-graphql')
const apphub = require('apphub-graphql')
const economic = require('economic-sentences-graphql')

server([
  dat,
  ssbDefaults,
  apphub,
  economic,
])