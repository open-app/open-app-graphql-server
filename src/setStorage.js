const fs = require('fs')
const path = require('path')
const os = require('os')
const mkdirp = require('mkdirp')

module.exports = (plugins, opts) => new Promise((resolve, reject) => {
  const isMobile = () => os.arch() === ('arm' || 'arm64') 
  console.log('isMobile', isMobile())
  let writablePath = os.homedir()
  if (isMobile()) {
    writablePath = path.join(__dirname, '..')
  }
  console.log('writablePath', writablePath)

  const ssbPath = path.resolve(writablePath, '.ssb')
  const datPath = path.resolve(writablePath, 'dat')

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