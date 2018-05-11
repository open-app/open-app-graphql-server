module.exports = (plugins, opts) => {
  require('./ssb')(opts).then(sbot => require('./graphql')(sbot, plugins, opts))
}