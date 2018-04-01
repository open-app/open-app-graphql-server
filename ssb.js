const fs = require('fs')
const os = require('os')
const path = require('path')
const Client = require('ssb-client')
const ssbKeys = require('ssb-keys')
const mkdirp = require('mkdirp')
const manifest = require('./manifest')

const ssbPath = path.resolve(os.homedir(), '.ssb')
if (!fs.existsSync(ssbPath)) {
  mkdirp.sync(ssbPath)
}
const keys = ssbKeys.loadOrCreateSync(path.join(ssbPath, '/secret'))

const config = require('ssb-config/inject')()
config.path = ssbPath
config.keys = keys
config.manifest = manifest

const startSsbServer = () => new Promise((resolve, reject) => {
  console.log('Starting SSB SERVER')
  resolve(
    require('scuttlebot/index')
      .use(require('scuttlebot/plugins/master'))
      .use(require('community-apps-ssb-plugin'))
      .use(require('scuttlebot/plugins/gossip'))
      .call(null, config)
    )
})
//   .use(require('scuttlebot/plugins/plugins'))
//   .use(require('scuttlebot/plugins/master'))
//   .use(require('scuttlebot/plugins/replicate'))
//   .use(require('ssb-friends'))
//   .use(require('ssb-blobs'))
//   .use(require('ssb-serve-blobs'))
//   .use(require('ssb-backlinks'))
//   .use(require('ssb-private'))
//   .use(require('ssb-about'))
//   .use(require('ssb-contacts'))
//   .use(require('ssb-query'))
//   .use(require('scuttlebot/plugins/invite'))
//   .use(require('scuttlebot/plugins/block'))
//   .use(require('scuttlebot/plugins/local'))
//   .use(require('scuttlebot/plugins/logging'))
//   .call(null, config))
// })

const runSsbClient = () => new Promise((resolve, reject) => {
  Client(config.keys, config, (err, sbot) => {
    if (err) console.log('SSB CLIENT ERROR', err)
    console.log('Starting SSB CLIENT: ')
    resolve(sbot)
  })
})

  
  module.exports = () => new Promise((resolve, reject) => {
    startSsbServer()
      .then(() => runSsbClient().then(res => resolve(res)))
  })