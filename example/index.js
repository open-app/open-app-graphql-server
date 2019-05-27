const server = require('../')
const patchql = require('patchql-graphql')
const gossip = require('ssb-gossip-graphql')
const replication = require('../../ssb-replication-graphql')
const datSharedFiles = require('dat-shared-files-graphql')
const dat = require('dat-graphql')

server([
  patchql,
  gossip,
  replication,
  datSharedFiles,
  dat,
], {
  scope: 'ssb-01Sk9Yyu',
  // auth: 'secret-key', // uncomment to use authentication
  // cors: 'https://mycoolservice.net', // uncomment to use cors
})