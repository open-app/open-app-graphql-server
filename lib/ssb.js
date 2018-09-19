'use strict';

var Path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var Config = require('ssb-config/inject');
var ssbKeys = require('ssb-keys');

var startSsbServer = function startSsbServer(plugins, opts, ssbPath) {
  return new Promise(function (resolve, reject) {
    var appName = 'ssb';
    var config = Config(appName, opts);
    config.path = ssbPath;
    config.keys = ssbKeys.loadOrCreateSync(Path.join(config.path, 'secret'));
    console.log('Starting SSB SERVER');
    var sbot = require('scuttlebot/index').use(require('scuttlebot/plugins/plugins')).use(require('scuttlebot/plugins/master')).use(require('scuttlebot/plugins/gossip')).use(require('scuttlebot/plugins/replicate')).use(require('ssb-friends')).use(require('ssb-blobs')).use(require('ssb-serve-blobs')).use(require('ssb-backlinks')).use(require('ssb-private')).use(require('ssb-about')).use(require('community-apps-ssb-plugin')).use(require('ssb-contacts')).use(require('ssb-query')).use(require('ssb-threads')).use(require('scuttlebot/plugins/invite')).use(require('scuttlebot/plugins/local')).use(require('scuttlebot/plugins/logging')).call(null, config);
    var manifest = sbot.getManifest();
    fs.writeFileSync(Path.join(config.path, 'manifest.json'), JSON.stringify(manifest));
    resolve(sbot);
  });
};

module.exports = function (plugins, opts, paths) {
  var ssbPath = paths.ssbPath;

  return startSsbServer(plugins, opts, ssbPath).then(function (sbot) {
    return sbot;
  });
};