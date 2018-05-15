const fs = require('fs')
const path = require('path')
const Client = require('ssb-client')
const ssbKeys = require('ssb-keys')
const mkdirp = require('mkdirp')
const manifest = require('./manifest')

const  writablePath = path.join(__dirname, '..')
const ssbPath = path.resolve(writablePath, '.ssb')

if (!fs.existsSync(ssbPath)) {
  mkdirp.sync(ssbPath)
}
const keys = ssbKeys.loadOrCreateSync(path.join(ssbPath, '/secret'))

const config = require('ssb-config/inject')()
config.path = ssbPath
config.keys = keys
config.manifest = manifest

const startSsbServer = (plugins) => new Promise((resolve, reject) => {
  console.log('Starting SSB SERVER')
  resolve(
    require('scuttlebot/index')
      .use(require('scuttlebot/plugins/plugins'))
      .use(require('scuttlebot/plugins/master'))
      .use(require('scuttlebot/plugins/replicate'))
      .use(require('scuttlebot/plugins/invite'))
      .use(require('scuttlebot/plugins/block'))
      .use(require('scuttlebot/plugins/local'))
      .use(require('scuttlebot/plugins/logging'))
      .use(require('ssb-friends'))
      .use(require('ssb-blobs'))
      .use(require('ssb-serve-blobs'))
      .use(require('ssb-backlinks'))
      .use(require('ssb-private'))
      .use(require('ssb-about'))
      .use(require('ssb-contacts'))
      .use(require('ssb-query'))
      .call(null, config)
    )
})


const runSsbClient = (plugins, opts) => new Promise((resolve, reject) => {
  Client(config.keys, config, (err, sbot) => {
    if (err) console.log('SSB CLIENT ERROR', err)
    console.log('Starting SSB CLIENT: ')
    resolve(sbot)
  })
})

  
  module.exports = (plugins, opts) => new Promise((resolve, reject) => {
    startSsbServer(plugins, opts)
      .then(() => runSsbClient(plugins, opts).then(res => resolve(res)))
  })