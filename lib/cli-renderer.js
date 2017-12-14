const Table = require('cli-table')
const chalk = require('chalk')
const score = require('./score')

const SOURCE_PACKAGE_TYPE = 'sourcePackage'
const ALTERNATIVE_PACKAGE_TYPE = 'alternativePackage'
const PACKAGE_DISPLAY_HEADERS = [
  'Package Name',
  'Smart Version',
  'License',
  'Description',
  'Deprecated',
  'My Usage',
  'Score'
]
const VERSION_DISPLAY_HEADERS = [
  'Package Name',
  'package.json Version',
  'Smart Version',
  'Latest Version',
  'Description'
]

class Renderer {
  constructor({ logger }) {
    this.queue = []
    this.logger = logger
    this.shouldRender = true
    // Print out table queue on process exit
    process.on('exit', () => this.render())
  }

  render() {
    this.logger.info(this.queue.length)
    if (this.shouldRender) for (const item of this.queue) console.log(item)
  }

  trimStringToLength(str, len) {
    if (str) {
      if (str.length <= len) return str
      return `${str.substring(0, len)}...`
    }
  }

  boolToString(bool) {
    if (bool) return 'Yes'
    else return 'No'
  }

  fractionToPercentageString(fraction) {
    const val = Math.round(fraction * 100)
    if (!isNaN(val)) return `${val.toFixed()} %`
    return ''
  }

  createSeparatorRow(len) {
    return Array(len).fill('')
  }

  createTableWithHeders(head) {
    return new Table({
      head,
      chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
      style: { head: ['blue', 'bold', 'underline'] }
    })
  }

  createPackageRow(data, type, hasHigherScore) {
    let style = chalk
    if (type === SOURCE_PACKAGE_TYPE) style = style.bold
    if (data.deprecated) style = style.red
    const dataSet = [
      `${style(data.name || '')}`,
      `${style(data.recommendedVersion || 'No Insight')}`,
      `${style(this.trimStringToLength(data.license, 4) || '')}`,
      `${style(this.trimStringToLength(data.description, 20) || '')}`,
      `${style(this.boolToString(data.deprecated) || '')}`,
      `${style(this.fractionToPercentageString(data.usage) || 'No Insight')}`
    ]
    if (hasHigherScore) style = style.bold.green
    dataSet.push(`${style(Number(data.calculatedScore) || '')}`)
    return dataSet
  }
  createVersionRow(data) {
    let style = chalk.bold
    if (data.deprecated) style = style.red

    return [
      `${style(data.name || '')}`,
      `${style(data.pkgJsonVersion || '')}`,
      `${style(data.recommendedVersion || 'No Insight')}`,
      `${style(data.version)}`,
      `${style(this.trimStringToLength(data.description, 20) || '')}`
    ]
  }

  getScore(pkgData, weights) {
    let calculatedScore
    if (Object.keys(weights).length > 0)
      calculatedScore = score.calculatePackageScore(pkgData, weights, true)
    else calculatedScore = pkgSet.source.score.final
    return (Number(calculatedScore) * 100).toFixed()
  }

  renderPackagesTable({ title, data, weights }) {
    if (!data.some(pkgSet => pkgSet.alternatives)) {
      this.shouldRender = false
      return
    }
    try {
      this.queue.push(chalk`{bold ${title} }`)
      const table = this.createTableWithHeders(PACKAGE_DISPLAY_HEADERS)

      for (const [idx, pkgSet] of data.entries()) {
        if (idx < data.length)
          table.push(this.createSeparatorRow(PACKAGE_DISPLAY_HEADERS.length))
        pkgSet.source.calculatedScore = this.getScore(pkgSet.source, weights)
        table.push(this.createPackageRow(pkgSet.source, SOURCE_PACKAGE_TYPE))

        if ('alternatives' in pkgSet) {
          for (const alternative of pkgSet.alternatives) {
            alternative.calculatedScore = this.getScore(alternative, weights)
            table.push(
              this.createPackageRow(
                alternative,
                ALTERNATIVE_PACKAGE_TYPE,
                alternative.calculatedScore > pkgSet.source.calculatedScore
              )
            )
          }
        }
      }
      this.logger.info({ table })
      this.queue.push(table.toString())
    } catch (err) {
      this.logger.error(err)
    }
  }
  renderVersionsTable({ title, data }) {
    try {
      const table = this.createTableWithHeders(VERSION_DISPLAY_HEADERS)
      for (const pkgSet of data) {
        table.push(this.createVersionRow(pkgSet.source))
      }

      this.logger.info({ table })
      this.queue.push(table.toString())
    } catch (err) {
      this.logger.error(err)
    }
  }

  renderLogo() {
    this.queue.push(chalk`{bold datree.io insights engine}`)
  }

  renderSeparator() {
    this.queue.push('')
  }

  renderLegend(packageList) {
    if (packageList.some(pkg => pkg.source.deprecated))
      this.queue.push(
        `${chalk.bgRed.bold('  ')} - ${chalk('Package is deprecated')}`
      )
  }

  renderLinks(linkType, data) {
    let links
    if (linkType === 'single') links = this._renderSinglePackageLinks(data)
    else if (linkType === 'alternative')
      links = this._renderAlternativesLinks(data)
    if (links.length > 0) {
      this.queue.push(chalk.cyan('For more info:'))
      this.queue = this.queue.concat(links)
    }
  }

  _renderAlternativesLinks(alternativeList) {
    const links = []
    for (const pkgSet of alternativeList) {
      const packages = [pkgSet.source.name]
      if (pkgSet.alternatives && pkgSet.alternatives.length > 0) {
        packages = packages.concat(pkgSet.alternatives.map(alt => alt.name))
        links.push(
          chalk`{blue.bold https://platform.datree.io/pkg/alternative-packages/${packages.join(
            ','
          )}}`
        )
      }
    }
    return links
  }

  _renderSinglePackageLinks(packageList) {
    const links = []
    for (const pkg of packageList)
      if (pkg.source.deprecated)
        links.push(
          chalk`{blue.bold https://platform.datree.io/pkg/single-package/${
            pkg.source.name
          }}`
        )
    return links
  }
}

module.exports = Renderer
