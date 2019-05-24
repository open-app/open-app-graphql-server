const server = require('../')
const dat = require('dat-graphql')

server([
  dat,
], {
  scope: 'ssb-01Sk9Yyu',
  // auth: 'secret-key', // uncomment to use authentication
  // cors: 'https://mycoolservice.net', // uncomment to use cors
})