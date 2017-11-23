const fs = require('fs-extra')
const ini = require('ini')
const path = require('path')
const os = require('os')

function disableHook (homeDir) {
  let npmrc = path.join(homeDir, '.npmrc')
  const config = ini.parse(fs.readFileSync(npmrc).toString())
  config['onload-script'] = ''
  fs.writeFileSync(npmrc, ini.stringify(config))
}

function uninstall () {
  try {
    const homeDir = os.homedir()
    disableHook(homeDir)
  } catch (err) {}
}

uninstall()

module.exports = {
  uninstall
}
