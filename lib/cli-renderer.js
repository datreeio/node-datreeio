const Table = require('cli-table')
const chalk = require('chalk')
const score = require('./score')

const SOURCE_PACKAGE_TYPE = 'sourcePackage'
const ALTERNATIVE_PACKAGE_TYPE = 'alternativePackage'
const PACKAGE_DISPLAY_HEADERS = ['Package Name', 'Smart Version', 'License', 'Description', 'My Usage', 'Score']
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
      style: { head: ['bold', 'underline'] }
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
      `${style(this.trimStringToLength(data.description, 20) || '')}`
    ]

    if (data.internalUsage)
      dataSet.push(`${style(this.fractionToPercentageString(data.internalUsage.usage) || 'No Insight')}`)
    if (hasHigherScore) style = style.bold.green
    dataSet.push(`${style(Number(data.calculatedScore) || '')}`)
    return dataSet
  }
  createVersionRow(data) {
    let style = chalk
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
    if (Object.keys(weights).length > 0) calculatedScore = score.calculatePackageScore(pkgData, weights, true)
    else calculatedScore = pkgData.score.final
    return (Number(calculatedScore) * 100).toFixed()
  }

  renderPackagesTable({ data, weights }) {
    if (!data.some(pkgSet => pkgSet.alternatives)) {
      this.shouldRender = false
      return
    }

    try {
      for (const [idx, pkgSet] of data.entries()) {
        if (!('alternatives' in pkgSet)) continue
        const scores = {}
        scores[pkgSet.source.name] = this.getScore(pkgSet.source, weights)
        pkgSet.source.calculatedScore = scores[pkgSet.source.name]

        for (const alternative of pkgSet.alternatives) {
          scores[alternative.name] = this.getScore(alternative, weights)
          alternative.calculatedScore = scores[alternative.name]
        }

        const highestScorePackageName = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0]
        this.logger.info(highestScorePackageName)
        this.queue.push(`Alternative Packages for ${chalk.bold.cyan(pkgSet.source.name)}`)
        const table = this.createTableWithHeders(PACKAGE_DISPLAY_HEADERS)

        if (idx < data.length) table.push(this.createSeparatorRow(PACKAGE_DISPLAY_HEADERS.length))
        table.push(
          this.createPackageRow(pkgSet.source, SOURCE_PACKAGE_TYPE, pkgSet.source.name === highestScorePackageName)
        )
        pkgSet.alternatives = pkgSet.alternatives.sort((a, b) => b.calculatedScore - a.calculatedScore)

        for (const alternative of pkgSet.alternatives) {
          table.push(
            this.createPackageRow(alternative, ALTERNATIVE_PACKAGE_TYPE, alternative.name === highestScorePackageName)
          )
        }

        this.logger.info({ table })
        this.queue.push(table.toString())
        this.renderLink('alternative', pkgSet)
        this.renderSeparator()
      }
    } catch (err) {
      this.logger.error(err)
      throw err
    }
  }
  renderVersionsTable({ data }) {
    try {
      this.queue.push('Version Summary')
      const table = this.createTableWithHeders(VERSION_DISPLAY_HEADERS)
      for (const pkgSet of data) {
        table.push(this.createVersionRow(pkgSet.source))
      }

      this.logger.info({ table })
      this.queue.push(table.toString())
      this.renderLink('single', data)
    } catch (err) {
      this.logger.error(err)
      throw err
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
      this.queue.push(`${chalk.bgRed.bold('  ')} - ${chalk('Package is deprecated')}`)
  }

  renderLink(linkType, data) {
    let link
    if (linkType === 'single') link = this._renderSinglePackageLinks(data)
    else if (linkType === 'alternative') this._renderAlternativesLinks(data)
  }

  _renderAlternativesLinks(pkgSet) {
    let packages = [pkgSet.source.name]
    if (pkgSet.alternatives && pkgSet.alternatives.length > 0) {
      packages = packages.concat(pkgSet.alternatives.map(alt => alt.name))
      this.queue.push(chalk`{blue.bold https://platform.datree.io/pkg/alternative-packages/${packages.join(',')}}`)
    }
  }

  _renderSinglePackageLinks(packageList) {
    for (const pkg of packageList)
      if (pkg.source.deprecated)
        this.queue.push(chalk`{blue.bold https://platform.datree.io/pkg/single-package/${pkg.source.name}}`)
  }
}

module.exports = Renderer
