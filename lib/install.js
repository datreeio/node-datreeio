const fs = require('fs-extra')
const path = require('path')
const os = require('os')
const ini = require('ini')
const utils = require('../lib/utils')

function enableHook(hookFullPath, homeDir) {
  let npmrc = path.join(homeDir, '.npmrc')
  if (!fs.pathExistsSync()) fs.createFileSync(npmrc)
  const config = ini.parse(fs.readFileSync(npmrc).toString())
  config['onload-script'] = `${hookFullPath}`
  fs.writeFileSync(npmrc, ini.stringify(config))
}

function hookSetup() {
  const homeDir = os.homedir()
  const datreeioDir = utils.getDatreeioDir()
  try {
    const hookFullPath = `${datreeioDir}/hook.js`
    try {
      fs.mkdirSync(datreeioDir)
    } catch (err) {}

    fs.copySync(path.join(__dirname, 'hook.js'), hookFullPath)
    enableHook(hookFullPath, homeDir)
  } catch (err) {}
}

hookSetup()

module.exports = {
  hookSetup
}
