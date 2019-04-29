const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const Config = require('ssb-config/inject')
const ssbKeys = require('ssb-keys')
// const scuttleshell = require('scuttle-shell')

const startSsbServer = (plugins, opts, ssbPath) => new Promise((resolve, reject) => {
  let ssbAppName = process.env.ssb_appname || 'ssb'
  const config = require('ssb-config/inject')(ssbAppName, opts)
  // let config = Config(appName, opts)

  // config.path = ssbPath
  // config.keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))
  const keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))
  if (keys.curve === 'k256') {
    // i think this is _really_ old and could be removed
    throw new Error('k256 curves are no longer supported,' +
      'please delete' + path.join(config.path, 'secret'))
  }
  config.keys = keys
  ssbConfig = config

  const manifestFile = path.join(config.path, 'manifest.json')
  console.log('Starting SSB SERVER')
  console.log('open http://localhost:8989/get-address')
  const ssbPlugins = plugins.filter(p => p.ssb)


  // const sbot = require('ssb-server')
  //   .use(require('ssb-server/plugins/master'))
  //   .use(require('ssb-gossip'))
  //   .use(require('ssb-replicate'))
  //   .use(require('ssb-friends'))
  //   .use(require('ssb-blobs'))
  //   .use(require('ssb-serve-blobs'))
  //   .use(require('ssb-backlinks'))
  //   .use(require('ssb-private'))
  //   .use(require('ssb-about'))
  //   .use(require('community-apps-ssb-plugin'))
  //   .use(require('ssb-contacts'))
  //   .use(require('ssb-query'))
  //   .use(require('ssb-threads'))
  //   .use(require('ssb-invite'))
  //   .use(require('ssb-server/plugins/local'))
  //   .use(require('ssb-server/plugins/logging'))
  //   .call(null, config)
  // const manifest = sbot.getManifest()
  const createSbot = require('ssb-server')
  // meta extensions stuff
  .use(require('ssb-server/plugins/plugins'))

  // secret-stack connect-ish stuff
  .use(require('ssb-server/plugins/onion'))
  .use(require('ssb-server/plugins/unix-socket'))
  .use(require('ssb-server/plugins/no-auth'))
  .use(require('ssb-server/plugins/local'))

  // controll stuff
  .use(require('ssb-server/plugins/master'))
  .use(require('ssb-server/plugins/logging'))

  // who and how to peer
  .use(require('ssb-gossip'))
  .use(require('ssb-replicate'))
  .use(require('ssb-friends'))

  // old invites
  .use(require('ssb-invite'))

  // needed by device device-addrs
  .use(require('ssb-query'))

  // user invites
  .use(require('ssb-identities'))
  .use(require('ssb-device-address'))
  .use(require('ssb-peer-invites'))

  // view index stuff
  .use(require('ssb-about'))
  .use(require('ssb-backlinks'))
  .use(require('ssb-blobs'))
  .use(require('ssb-chess-db'))
  .use(require('ssb-ebt'))
  .use(require('ssb-links')) // needed by patchfoo
  .use(require('ssb-names'))
  .use(require('ssb-meme'))
  .use(require('ssb-ooo'))
  .use(require('ssb-private'))
  .use(require('ssb-search'))
  .use(require('ssb-suggest'))
  .use(require('ssb-tags'))
  .use(require('ssb-talequery')) // only tale:net - close to obsolete %qJqQbvb8vLh5SUcSIlMeM2u0vt0M1RRaczb5NqH4tB8=.sha256
  .use(require('ssb-threads'))
  .use(require('ssb-unread'))
  .use(require('ssb-ws'))

  // load user plugins (from $HOME/.ssb/node_modules using $HOME/.ssb/config plugins {name:true})
  require('ssb-server/plugins/plugins').loadUserPlugins(createSbot, config)

  // from customConfig.plugins
  if (Array.isArray(ssbPlugins)) {
    console.log('loading custom plugins: ', ssbPlugins.join(', '))
    ssbPlugins.forEach(plugin => createSbot.use(require(plugin)))
  }
  // start server
  const server = createSbot(config)
  sbotClose = server.close

  // write RPC manifest to ~/.ssb/manifest.json
  fs.writeFileSync(manifestFile, JSON.stringify(server.getManifest(), null, 2))
  resolve(server)

})
  
module.exports = (plugins, opts, paths) => {
  const { ssbPath } = paths
  return startSsbServer(plugins, opts, ssbPath)
    .then((sbot) => sbot)
}