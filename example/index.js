const server = require('../')
// const ssb = require('ssb-graphql-defaults')
// const dat = require('dat-graphql')
// const apphub = require('apphub-graphql')
// const economic = require('economic-sentences-graphql')
const bazaar = require('../../../community-apps-ecosystem/bazaar-graphql')

server([
  // ssb,
  // dat,
  // apphub,
  // economic,
  bazaar,
], {
  scope: 'ssb-01Sk9Yyu',
  // key: 'secret-key', // uncomment to use authentication
})