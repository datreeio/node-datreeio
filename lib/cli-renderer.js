const Table = require('cli-table')
const chalk = require('chalk')
const score = require('./score')
const fs = require('fs')
const path = require('path')
const os = require('os')

const DISPLAY_HEADERS = [
  'Package Name',
  'Smart Version',
  'License',
  'Description',
  'Deprecated',
  'My Usage',
  'Score'
]

class Renderer {
  constructor() {
    this.queue = []
    // Print out table queue on process exit
    process.on('exit', () => this.render())
  }

  writeResult(data) {
    let fileLocation = path.join(os.homedir(), '.datreeio', 'debug.log')
    fs.writeFileSync(fileLocation, JSON.stringify(data))
  }

  render() {
    for (const item of this.queue) console.log(item)
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
    if (!isNaN(val)) return `${val.toFixed(2)}%`
    return ''
  }

  renderTable({ title, data, weights }) {
    try {
      if (process.env.DATREE_ENV) this.writeResult(data)

      this.queue.push(chalk`{bold ${title} }`)
      const table = new Table({
        head: DISPLAY_HEADERS,
        chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
        style: { head: ['blue', 'bold', 'underline'] }
      })
      for (const [idx, pkgSet] of data.entries()) {
        if (idx < data.length) table.push(['', '', '', '', '', '', ''])
        let calculatedScore
        if (Object.keys(weights).length > 0)
          calculatedScore = score.calculatePackageScore(
            pkgSet.source,
            weights,
            true
          )
        else calculatedScore = pkgSet.source.score.final
        table.push([
          chalk`{cyanBright.bold ${pkgSet.source.name || ''}}`,
          chalk`{cyanBright.bold ${pkgSet.source.recommendedVersion ||
            'No Insight'}}`,
          chalk`{cyanBright.bold ${this.trimStringToLength(
            pkgSet.source.license,
            4
          ) || ''}}`,
          chalk`{cyanBright.bold ${this.trimStringToLength(
            pkgSet.source.description,
            20
          ) || ''}}`,
          chalk`{cyanBright.bold ${this.boolToString(
            pkgSet.source.deprecated
          ) || ''}}`,
          chalk`{cyanBright.bold ${this.fractionToPercentageString(
            pkgSet.source.usage
          ) || 'No Insight'}}`,
          chalk`{cyanBright.bold ${this.fractionToPercentageString(
            calculatedScore
          ) || ''}}`
        ])

        if ('alternatives' in pkgSet) {
          for (const alternative of pkgSet.alternatives) {
            let calculatedScore
            if (Object.keys(weights).length > 0)
              calculatedScore = score.calculatePackageScore(
                alternative,
                weights,
                true
              )
            else calculatedScore = alternative.score.final
            table.push([
              alternative.name || '',
              alternative.recommendedVersion || 'No Insight',
              this.trimStringToLength(alternative.license, 4) || '',
              this.trimStringToLength(alternative.description, 20) || '',
              this.boolToString(alternative.deprecated) || '',
              this.fractionToPercentageString(alternative.usage) || '',
              this.fractionToPercentageString(calculatedScore) || ''
            ])
          }
        }
      }
      this.queue.push(table.toString())
    } catch (err) {}
  }

  renderLogo() {
    this.queue.push(chalk`{bold datree.io insights engine}`)
  }

  renderSeparator() {
    this.queue.push('')
  }

  renderFooter(compareList) {
    for (const pkg of compareList)
      this.queue.push(
        chalk`{blue.bold https://platform.datree.io/pkg/single-package/${pkg}}`
      )
  }
}

module.exports = Renderer
