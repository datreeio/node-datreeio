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

    // fetch insights
    const insightsProcess = childProcess.spawnSync(`node`, [
      `${__dirname}/insight.js`,
      `${JSON.stringify(info)}`
    ])
    const insightsResponse = JSON.parse(insightsProcess.stdout.toString('utf8'))
    logger.info(insightsResponse)
    const renderer = new Renderer({ logger })
    renderer.renderSeparator()
    renderer.renderLogo()
    if (insightsResponse.insight && insightsResponse.insight.length > 0) {
      if (info.installaction.length > 0)
        renderer.renderPackagesTable({
          title: 'Alternative Packages',
          data: insightsResponse.insight,
          weights: insightsResponse.userWeights
        })
      else {
        insightsResponse.insight.forEach(pkgSet => {
          const pkgJsonVersion = node.getVersionFromDependencies(
            info.packages,
            pkgSet.source.name
          )
          pkgSet.source.pkgJsonVersion = pkgJsonVersion
        })
        renderer.renderVersionsTable({
          title: 'Version Summary',
          data: insightsResponse.insight
        })
      }
      if (utils.isDebug())
        utils.writeToFile('debug.log', insightsResponse.insight)

      renderer.renderFooter(
        insightsResponse.insight.map(pkgSet => pkgSet.source.name)
      )
    }
  } catch (err) {
    logger.error(err)
  }
}

module.exports = {
  main
}
