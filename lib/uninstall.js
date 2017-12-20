const fs = require('fs')
const childProcess = require('child_process')
const ini = require('./ini')
const path = require('path')
const os = require('os')
const utils = require('../lib/utils')
const loggerFactory = require('./loggerFactory')
const logger = loggerFactory.get('uninstall')

function disableHook(homeDir) {
  let npmrc = path.join(homeDir, '.npmrc')
  const config = ini.parse(fs.readFileSync(npmrc).toString())
  config['onload-script'] = ''
  fs.writeFileSync(npmrc, ini.stringify(config))
}

function uninstall() {
  try {
    const homeDir = os.homedir()
    disableHook(homeDir)
    const data = {
      systeminfo: utils.getSystemInfo(),
      installDate: utils.getInstallDate()
    }
    const insightsProcess = childProcess.spawnSync(`node`, [
      `${__dirname}/insight.js`,
      '-e',
      'uninstall',
      '-d',
      `${JSON.stringify(data)}`
    ])
    console.log(insightsProcess.stdout.toString('utf8'))
  } catch (err) {
    logger.error(err)
  }
}

uninstall()

module.exports = {
  uninstall
}
