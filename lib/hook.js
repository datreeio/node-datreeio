const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')

const LOCK_FILE = path.join(__dirname, 'datreeio.lock')

try {
  let globalNodeModulesPath
  try {
    globalNodeModulesPath = process.env._.replace(/bin\/.*$/, '')
  } catch (err) {
    globalNodeModulesPath = process.execPath.replace(/bin\/node$/, '')
  }

  require(path.join(`${globalNodeModulesPath}`, `/lib/node_modules/datreeio`))
} catch (err) {
  try {
    fs.accessSync(LOCK_FILE)
  } catch (err) {
    fs.writeFileSync(LOCK_FILE, '')
    childProcess.execSync('npm install -g datreeio')
    fs.unlinkSync(LOCK_FILE)
  }
}
