const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')
const os = require('os')
const ini = require('ini')
const utils = require('../lib/utils')
const loggerFactory = require('./loggerFactory')
const logger = loggerFactory.get('install')

function enableHook(hookFullPath, homeDir) {
  let npmrc = path.join(homeDir, '.npmrc')
  let config = {}
  if (fs.existsSync(npmrc))
    config = ini.parse(fs.readFileSync(npmrc).toString())

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

    fs.copyFileSync(path.join(__dirname, 'hook.js'), hookFullPath)
    enableHook(hookFullPath, homeDir)
    const data = {
      systeminfo: utils.getSystemInfo()
    }

    const insightsProcess = childProcess.spawnSync(`node`, [
      `${__dirname}/insight.js`,
      '-e',
      'install',
      '-d',
      `${JSON.stringify(data)}`
    ])
  } catch (err) {
    logger.error(err)
  }
}

hookSetup()

module.exports = {
  hookSetup
}
