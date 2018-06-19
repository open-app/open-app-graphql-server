module.exports = function (plugins, opts) {
  require('./lib/setStorage')(plugins, opts)
    .then(paths => {
      require('./lib/ssb')(plugins, opts, paths)
        .then(sbot => require('./lib/graphql')(sbot, paths, plugins, opts))
    })  
}