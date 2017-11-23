const fs = require('fs-extra')
const path = require('path')

const NODEJS_PACKAGE_FILENAME = 'package.json'

/**
 * Extracts packages from the Node.js package.json file
 * @param {String} packageJson - The Node.js repo location
 */
function getPackages (packageJson) {
  let packages = {}
  let depTypes = ['dependencies', 'devDependencies', 'bundledDependencies', 'peerDependencies', 'optionalDependencies']

  for (const deps of Object.keys(packageJson)) {
    if (depTypes.includes(deps)) {
      packages[deps] = packageJson[deps]
    }
  }
  return packages
}

function packageJsonExists (repoDir) {
  if (!fs.pathExistsSync(`${repoDir}/${NODEJS_PACKAGE_FILENAME}`)) {
    throw new Error(`Package file: ${NODEJS_PACKAGE_FILENAME} not found in: ${repoDir}`)
  }
}

function readPackageJson (repoDir) {
  return fs.readJSONSync(`${repoDir}/${NODEJS_PACKAGE_FILENAME}`)
}

function extractPackageInfo (repoDir) {
  let packageData = {}
  try {
    packageJsonExists(repoDir)
  } catch (err) {
    return packageData
  }

  const packageJson = readPackageJson(repoDir)
  const packages = getPackages(packageJson)
  const repositoryName = extractRepositoryName(packageJson.repository)

  packageData = {
    project_name: extractProjectName(packageJson.name, repoDir),
    node_package_index: packageJson,
    repo_name: repositoryName,
    package_index_path: path.join(repoDir, NODEJS_PACKAGE_FILENAME),
    packages

  }
  return packageData
}

function extractProjectName (packageJsonName, repoDir) {
  return packageJsonName || path.basename(repoDir)
}

function extractRepositoryName (repository) {
  let repositoryName = ''
  if (typeof repository === 'string') {
    const repositoryMatch = repository.match(/(?:\/)+(\w*)[^#]*/)
    if (repositoryMatch) repositoryName = repositoryMatch[1]
    else repositoryName = repository
  } else if (typeof repository === 'object') {
    let repositoryUrlParts

    switch (repository.type) {
      case 'git':
        repositoryUrlParts = repository.url.split('/')
        repositoryUrlParts = repositoryUrlParts[repositoryUrlParts.length - 1]
        repositoryName = repositoryUrlParts.split('.')[0]
        break
      case 'svn':
        repositoryUrlParts = repository.url.split('/')
        repositoryName = repositoryUrlParts[repositoryUrlParts.length - 1]
        break
      default:
        repositoryName = ''
    }
  }
  return repositoryName
}

module.exports = {
  getPackages,
  packageJsonExists,
  readPackageJson,
  extractPackageInfo,
  NODEJS_PACKAGE_FILENAME
}
