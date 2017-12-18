const Renderer = require('./cli-renderer')
const args = require('./argumentsExtractor')
const node = require('./node')
const utils = require('./utils')
const childProcess = require('child_process')

const loggerFactory = require('./loggerFactory')
const logger = loggerFactory.get('main')

async function main() {
  try {
    logger.info('# datree.io initializing cli integration...')
    // Parse argv
    let argv = process.argv.slice(2)
    const argumentsExtractor = new args.ArgumentsExtractor(argv.slice(1))
    // Fetch package.json info (if exists)
    let info = node.extractPackageInfo(process.env.PWD)
    // Fetch system information
    info.systeminfo = utils.getSystemInfo()
    // Assign npm action
    info.action = argv[0]
    // Assign argv
    info.argv = process.argv
    // Get full action
    info.full_action = [info.action].concat(
      argumentsExtractor.extractActionArgs()
    )

    // If in npm install - parse installed packages
    if (info.action === 'install' || info.action === 'i') {
      info.installaction = argumentsExtractor.extractPackagesArgv()
    }
    logger.info(info)
    // fetch insights
    const data = JSON.stringify(info)
    const insightsProcess = childProcess.spawnSync(`node`, [
      `${__dirname}/insight.js`,
      '-e',
      'insight',
      '-d',
      `${data}`
    ])
    logger.info(insightsProcess.stdout.toString('utf8'))
    const insightsResponse = JSON.parse(insightsProcess.stdout.toString('utf8'))
    const insight = insightsResponse.insight
    logger.info(insightsResponse)

    if (insight && insight.length > 0) {
      const renderer = new Renderer({ logger })
      renderer.renderSeparator()
      renderer.renderLogo()
      renderer.renderLegend(insight)
      renderer.renderSeparator()
      let installType
      if (info.installaction.length > 0) {
        installType = 'alternative'
        renderer.renderPackagesTable({
          data: insight,
          weights: insightsResponse.userWeights
        })
      } else {
        installType = 'single'
        insight.forEach(pkgSet => {
          const pkgJsonVersion = node.getVersionFromDependencies(
            info.packages,
            pkgSet.source.name
          )
          pkgSet.source.pkgJsonVersion = pkgJsonVersion
        })
        renderer.renderVersionsTable({
          data: insight
        })
      }
      if (utils.isCI()) utils.writeToFile('test.log', insight)
    }
  } catch (err) {
    logger.error(err)
  }
}

module.exports = {
  main
}
