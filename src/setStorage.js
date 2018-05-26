const fs = require('fs')
const path = require('path')
const os = require('os')
const mkdirp = require('mkdirp')

module.exports = (plugins, opts) => new Promise((resolve, reject) => {
  const isMobile = () => os.arch() === ('arm' || 'arm64') 
  console.log('isMobile', isMobile())
  let writablePath = os.homedir()
  let ssbPath = path.resolve(writablePath, '.ssb')
  let datPath = path.resolve(writablePath, 'dat')
  if (opts) {
    if (opts.writablePath) {
      writablePath = opts.writablePath
      ssbPath = path.resolve(writablePath, '.ssb')
      datPath = path.resolve(writablePath, 'dat')
    }
    if (opts.ssbPath) ssbPath = opts.ssbPath
    if (opts.datPath) datPath = opts.datPath
  }
  console.log('writablePath', writablePath)
  console.log('ssbPath', ssbPath)
  console.log('datPath', datPath)


  if (!fs.existsSync(ssbPath)) {
    mkdirp.sync(ssbPath)
  }
  if (!fs.existsSync(datPath)) {
    mkdirp.sync(datPath)
  }
  resolve({
    writablePath,
    ssbPath,
    datPath
  })
})