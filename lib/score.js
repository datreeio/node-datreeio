function calculatePackageScore(pkg, weights, includeUsage) {
  let score = 0
  // base assumption is that we have 3 weights
  let weightPercentage = 0.33
  const popularityWeight = weights['Popularity']['popularity']
  const maintenanceWeight = weights['Maintenance']['maintenance']
  const qualityWeight = weights['Quality']['quality']
  const usageWeight = weights['Internal usage']['internalUsage']
  let weightSums = popularityWeight + maintenanceWeight + qualityWeight
  if (includeUsage) {
    weightSums += usageWeight
    weightPercentage = 0.25
  }
  if (weightSums === 0) {
    if (includeUsage) {
      score += weightPercentage * pkg.usage
    }
    score += weightPercentage * pkg.score.detail.popularity
    score += weightPercentage * pkg.score.detail.maintenance
    score += weightPercentage * pkg.score.detail.quality
  } else {
    if (includeUsage && pkg.internalUsage) {
      score += usageWeight / weightSums * pkg.internalUsage.usage
    }
    score += popularityWeight / weightSums * pkg.score.detail.popularity
    score += maintenanceWeight / weightSums * pkg.score.detail.maintenance
    score += qualityWeight / weightSums * pkg.score.detail.quality
  }
  return score
}

module.exports = {
  calculatePackageScore
}
