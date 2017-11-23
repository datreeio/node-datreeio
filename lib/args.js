'use strict'

function extractPackagesArgv (argv) {
  let packages = []
  for (const pack of argv) if (!pack.startsWith('-')) packages.push(pack)

  return packages
}

function extractActionArgs (argv) {
  let args = []
  for (const arg of argv) if (arg.startsWith('-')) args.push(arg)

  return args
}

module.exports = {
  extractPackagesArgv,
  extractActionArgs
}
