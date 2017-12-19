const fs = require('fs')
const path = require('path')

const NODEJS_PACKAGE_FILENAME = 'package.json'
const DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'bundledDependencies',
  'peerDependencies',
  'optionalDependencies'
]
function getVersionFromDependencies(packages, packageName) {
  for (const depType of DEP_TYPES) {
    if (packages[depType]) {
      const pkg = Object.keys(packages[depType]).find(
        pkg => pkg === packageName
      )
      if (pkg) return packages[depType][pkg]
    }
  }
}
/**
 * Extracts packages from the Node.js package.json file
 * @param {String} packageJson - The Node.js repo location
 */
function getPackages(packageJson) {
  let packages = {}

  for (const deps of Object.keys(packageJson)) {
    if (DEP_TYPES.includes(deps)) {
      packages[deps] = packageJson[deps]
    }
  }
  return packages
}

function packageJsonExists(repoDir) {
  if (!fs.existsSync(`${repoDir}/${NODEJS_PACKAGE_FILENAME}`)) {
    throw new Error(
      `Package file: ${NODEJS_PACKAGE_FILENAME} not found in: ${repoDir}`
    )
  }
}

function readPackageJson(repoDir) {
  return JSON.parse(
    fs.readFileSync(`${repoDir}/${NODEJS_PACKAGE_FILENAME}`).toString('utf8')
  )
}

function extractPackageInfo(repoDir) {
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

function extractProjectName(packageJsonName, repoDir) {
  return packageJsonName || path.basename(repoDir)
}

function extractRepositoryName(repository) {
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
  getVersionFromDependencies,
  NODEJS_PACKAGE_FILENAME
}
