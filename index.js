module.exports = (plugins, opts) => {
  require('./src/setStorage')(plugins, opts)
    .then(paths => {
      require('./src/ssb')(plugins, opts, paths)
        .then(sbot => require('./src/express')(sbot, paths, plugins, opts))
    })  
}