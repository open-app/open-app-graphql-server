module.exports = {
  // Secure Scuttlebutt
  auth: 'async',
  address: 'sync',
  manifest: 'sync',
  get: 'async',
  createFeedStream: 'source',
  createLogStream: 'source',
  messagesByType: 'source',
  createHistoryStream: 'source',
  createUserStream: 'source',
  links: 'source',
  relatedMessages: 'async',
  add: 'async',
  publish: 'async',
  getAddress: 'sync',
  getLatest: 'async',
  latest: 'source',
  latestSequence: 'async',
  whoami: 'sync',
  usage: 'sync',

  // Scuttlebot
  plugins: {
    install: 'source',
    uninstall: 'source',
    enable: 'async',
    disable: 'async',
  },
  gossip: {
    peers: 'sync',
    add: 'sync',
    remove: 'sync',
    ping: 'duplex',
    connect: 'async',
    changes: 'source',
    reconnect: 'sync',
  },
  replicate: {
    changes: 'source',
    upto: 'source',
  },
  invite: {
    create: 'async',
    accept: 'async',
    use: 'async',
  },
  block: {
    isBlocked: 'sync',
  },

  // Third-party
  friends: {
    get: 'async',
    createFriendStream: 'source',
    hops: 'async',
    stream: 'source',
  },
  blobs: {
    get: 'source',
    getSlice: 'source',
    add: 'sink',
    rm: 'async',
    ls: 'source',
    has: 'async',
    size: 'async',
    meta: 'async',
    want: 'async',
    push: 'async',
    changes: 'source',
    createWants: 'source',
  },
  backlinks: {
    read: 'source',
  },
  private: {
    publish: 'async',
    unbox: 'sync',
    read: 'source',
  },
  about: {
    stream: 'source',
    get: 'async',
  },
  contacts: {
    stream: 'source',
    get: 'async',
  },
  query: {
    read: 'source',
  },
  roots: {
    read: 'source',
  },
};
