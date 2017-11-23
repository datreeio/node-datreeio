const Table = require('cli-table')
const chalk = require('chalk')
const score = require('./score')
const DISPLAY_HEADERS = ['Package Name', 'Smart Version', 'License', 'Description', 'Deprecated', 'My Usage', 'Score']

class Renderer {
  constructor () {
    this.queue = []
    // Print out table queue on process exit
    process.on('exit', () => this.render())
  }

  render () {
    for (const item of this.queue) console.log(item)
  }

  trimStringToLength (str, len) {
    if (str) {
      if (str.length <= len) return str
      return `${str.substring(0, len)}...`
    }
  }

  boolToString (bool) {
    if (bool) return 'Yes'
    else return 'No'
  }

  fractionToPercentageString (fraction) {
    return `${Math.round(fraction * 100).toFixed(2)}%`
  }

  renderTable ({ title, data, weights }) {
    try {
      this.queue.push(chalk`{bold ${title} }`)

      const table = new Table({
        head: DISPLAY_HEADERS,
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
        style: {head: ['blue', 'bold', 'underline']}
      })
      for (const [idx, pkgSet] of data.entries()) {
        if (idx < data.length) table.push(['', '', '', '', '', '', ''])
        const calculatedScore = score.calculatePackageScore(pkgSet.source, weights, true)
        table.push([
          chalk`{cyanBright.bold ${pkgSet.source.name || ''}}`,
          chalk`{cyanBright.bold ${pkgSet.source.recommendedVersion || 'No Insight'}}`,
          chalk`{cyanBright.bold ${this.trimStringToLength(pkgSet.source.license, 4) || ''}}`,
          chalk`{cyanBright.bold ${this.trimStringToLength(pkgSet.source.description, 20) || ''}}`,
          chalk`{cyanBright.bold ${this.boolToString(pkgSet.source.deprecated) || ''}}`,
          chalk`{cyanBright.bold ${this.fractionToPercentageString(pkgSet.source.usage) || ''}}`,
          chalk`{cyanBright.bold ${this.fractionToPercentageString(calculatedScore) || ''}}`
        ])

        if ('alternatives' in pkgSet) {
          for (const alternative of pkgSet.alternatives) {
            const calculatedScore = score.calculatePackageScore(alternative, weights, true)
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
    } catch (err) {
    }
  }

  renderLogo () {
    this.queue.push(chalk`{bold datree.io insights engine}`)
  }
  renderSeparator () {
    this.queue.push('')
  }
}

module.exports = Renderer
