class ArgumentsExtractor {
  constructor (argv) {
    this.argv = argv
  }

  extractPackagesArgv () {
    return this.argv.filter(arg => !arg.startsWith('-'))
  }

  extractActionArgs (argv) {
    return this.argv.filter(arg => arg.startsWith('-'))
  }
}

module.exports = { ArgumentsExtractor }
