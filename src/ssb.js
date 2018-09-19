const Path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const Config = require('ssb-config/inject')
const ssbKeys = require('ssb-keys')

const startSsbServer = (plugins, opts, ssbPath) => new Promise((resolve, reject) => {
  const appName = 'ssb'
  let config = Config(appName, opts)
  config.path = ssbPath
  config.keys = ssbKeys.loadOrCreateSync(Path.join(config.path, 'secret'))
  console.log('Starting SSB SERVER')
  const sbot = require('scuttlebot/index')
    .use(require('scuttlebot/plugins/plugins'))
    .use(require('scuttlebot/plugins/master'))
    .use(require('scuttlebot/plugins/gossip'))
    .use(require('scuttlebot/plugins/replicate'))
    .use(require('ssb-friends'))
    .use(require('ssb-blobs'))
    .use(require('ssb-serve-blobs'))
    .use(require('ssb-backlinks'))
    .use(require('ssb-private'))
    .use(require('ssb-about'))
    .use(require('community-apps-ssb-plugin'))
    .use(require('ssb-contacts'))
    .use(require('ssb-query'))
    .use(require('ssb-threads'))
    .use(require('scuttlebot/plugins/invite'))
    .use(require('scuttlebot/plugins/local'))
    .use(require('scuttlebot/plugins/logging'))
    .call(null, config)
  const manifest = sbot.getManifest()
  fs.writeFileSync(Path.join(config.path, 'manifest.json'), JSON.stringify(manifest))
  resolve(sbot)
})
  
module.exports = (plugins, opts, paths) => {
  const { ssbPath } = paths
  return startSsbServer(plugins, opts, ssbPath)
    .then((sbot) => sbot)
}