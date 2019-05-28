const Path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const Config = require('ssb-config/inject')
const ssbKeys = require('ssb-keys')

const startSsbServer = (plugins, opts, ssbPath) => new Promise(async (resolve, reject) => {
  const appName = 'ssb'
  let config = Config(appName, opts)
  config.path = ssbPath
  config.keys = ssbKeys.loadOrCreateSync(Path.join(config.path, 'secret'))
  console.log('Starting SSB SERVER')
  let createSsbServer = require('ssb-server')
    .use(require('ssb-onion'))
    .use(require('ssb-unix-socket'))
    .use(require('ssb-no-auth'))
    .use(require('ssb-plugins'))
    .use(require('ssb-master'))
    .use(require('ssb-gossip'))
    .use(require('ssb-replicate'))
    .use(require('ssb-friends'))
    .use(require('ssb-blobs'))
    .use(require('ssb-invite'))
    .use(require('ssb-local'))
    .use(require('ssb-logging'))
    .use(require('ssb-query'))
    .use(require('ssb-links'))
    .use(require('ssb-ws'))
    .use(require('ssb-ebt'))
    .use(require('ssb-ooo'))
    .use(require('ssb-serve-blobs'))
    .use(require('ssb-private'))
    // // add third-party plugins
    // .use(require('ssb-backlinks'))
    // .use(require('ssb-about'))
    // .use(require('ssb-contacts'))
    // .use(require('ssb-threads'))
  
  require('ssb-plugins').loadUserPlugins(createSsbServer, config)

  plugins.map(pl => {
    if (pl.ssb && pl.ssb.length > 0) {
      pl.ssb.map(ssbPlugin => {
        // Need better path
        const pluginPath = `${Path.dirname(require.main.filename)}/node_modules/${ssbPlugin}`
        return createSsbServer = createSsbServer
          .use(require(pluginPath))
      })
    }
  })
  const sbot = createSsbServer(config)
  const manifest = sbot.getManifest()
  fs.writeFileSync(Path.join(config.path, 'manifest.json'), JSON.stringify(manifest))
  if (sbot.jsbotPatchql) {
    await sbot.jsbotPatchql.start()
  }
  resolve(sbot)
})
  
module.exports = (plugins, opts, paths) => {
  const { ssbPath } = paths
  return startSsbServer(plugins, opts, ssbPath)
    .then((sbot) => sbot)
}