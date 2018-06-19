'use strict';

var fs = require('fs');
var path = require('path');
var os = require('os');
var mkdirp = require('mkdirp');

module.exports = function (plugins, opts) {
  return new Promise(function (resolve, reject) {
    var isMobile = function isMobile() {
      return os.arch() === ('arm' || 'arm64');
    };
    console.log('isMobile', isMobile());
    var writablePath = os.homedir();
    var ssbPath = path.resolve(writablePath, '.ssb');
    var datPath = path.resolve(writablePath, 'dat');
    if (opts) {
      if (opts.writablePath) {
        writablePath = opts.writablePath;
        ssbPath = path.resolve(writablePath, '.ssb');
        datPath = path.resolve(writablePath, 'dat');
      }
      if (opts.ssbPath) ssbPath = opts.ssbPath;
      if (opts.datPath) datPath = opts.datPath;
    }
    console.log('writablePath', writablePath);
    console.log('ssbPath', ssbPath);
    console.log('datPath', datPath);

    if (!fs.existsSync(ssbPath)) {
      mkdirp.sync(ssbPath);
    }
    if (!fs.existsSync(datPath)) {
      mkdirp.sync(datPath);
    }
    resolve({
      writablePath: writablePath,
      ssbPath: ssbPath,
      datPath: datPath
    });
  });
};