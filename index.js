module.exports = (plugins, opts) => {
  require('./ssb')(plugins, opts).then(sbot => require('./graphql')(sbot, plugins, opts))
}