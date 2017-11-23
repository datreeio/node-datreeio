const Renderer = require('./cli-renderer')
const args = require('./args')
const node = require('./node')
const utils = require('./utils')
const childProcess = require('child_process')

async function main () {
  try {
    // Parse argv
    let argv = process.argv.slice(2)
    // Fetch package.json info (if exists)
    let info = node.extractPackageInfo(process.env.PWD)
    // Fetch system information
    info.systeminfo = utils.getSystemInfo()
    // Assign npm action
    info.action = argv[0]
    // Assign argv
    info.argv = process.argv
    // Get full action
    info.full_action = [info.action].concat(args.extractActionArgs(argv.slice(1)))

    // If in npm install - parse installed packages
    if (info.action === 'install' || info.action === 'i') {
      info.installaction = args.extractPackagesArgv(argv.slice(1))
    }

    // fetch insights
    const insightsProcess = childProcess.spawnSync(`node`, [`${__dirname}/insightCompiled.js`, `${JSON.stringify(info)}`])
    const insightsResponse = JSON.parse(insightsProcess.stdout.toString('utf8'))

    const renderer = new Renderer()
    renderer.renderSeparator()
    renderer.renderLogo()
    if (insightsResponse.insight.length > 0) renderer.renderTable({ title: 'Alternative Packages', data: insightsResponse.insight, weights: insightsResponse.userWeights })
  } catch (err) {
  }
}

module.exports = {
  main
}
