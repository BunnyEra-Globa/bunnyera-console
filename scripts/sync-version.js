#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Sync version across all package.json files in the monorepo
 */

const ROOT_DIR = path.resolve(__dirname, '..')
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages')

function getPackageDirectories() {
  return fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(PACKAGES_DIR, dirent.name))
}

function updatePackageVersion(packagePath, version) {
  const packageJsonPath = path.join(packagePath, 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`⚠️  No package.json found in ${packagePath}`)
    return false
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const oldVersion = packageJson.version
    
    packageJson.version = version
    
    // Update internal dependencies
    const packageName = packageJson.name
    const internalPackages = [
      '@bunnyera/console-core',
      '@bunnyera/console-ui', 
      '@bunnyera/console-apps',
      '@bunnyera/console-electron'
    ]
    
    // Update dependencies
    if (packageJson.dependencies) {
      internalPackages.forEach(pkg => {
        if (packageJson.dependencies[pkg]) {
          packageJson.dependencies[pkg] = `^${version}`
        }
      })
    }
    
    // Update devDependencies
    if (packageJson.devDependencies) {
      internalPackages.forEach(pkg => {
        if (packageJson.devDependencies[pkg]) {
          packageJson.devDependencies[pkg] = `^${version}`
        }
      })
    }
    
    // Update peerDependencies
    if (packageJson.peerDependencies) {
      internalPackages.forEach(pkg => {
        if (packageJson.peerDependencies[pkg]) {
          packageJson.peerDependencies[pkg] = `^${version}`
        }
      })
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
    
    console.log(`✅ Updated ${packageName || path.basename(packagePath)}: ${oldVersion} → ${version}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to update ${packagePath}:`, error.message)
    return false
  }
}

function updateRootPackageVersion(version) {
  const rootPackageJsonPath = path.join(ROOT_DIR, 'package.json')
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'))
    const oldVersion = packageJson.version
    
    packageJson.version = version
    
    fs.writeFileSync(rootPackageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
    
    console.log(`✅ Updated root package: ${oldVersion} → ${version}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to update root package.json:`, error.message)
    return false
  }
}

function validateVersion(version) {
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/
  return semverRegex.test(version)
}

function getCurrentVersion() {
  try {
    const rootPackageJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'))
    return rootPackageJson.version
  } catch (error) {
    console.error('❌ Failed to read current version:', error.message)
    return null
  }
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('📦 BunnyEra Console Version Sync')
    console.log('')
    console.log('Usage: node sync-version.js <version>')
    console.log('       node sync-version.js --current')
    console.log('')
    console.log('Examples:')
    console.log('  node sync-version.js 2.1.0')
    console.log('  node sync-version.js 2.1.0-beta.1')
    console.log('  node sync-version.js --current')
    console.log('')
    process.exit(1)
  }
  
  if (args[0] === '--current') {
    const currentVersion = getCurrentVersion()
    if (currentVersion) {
      console.log(`📦 Current version: ${currentVersion}`)
    }
    process.exit(0)
  }
  
  const newVersion = args[0]
  
  if (!validateVersion(newVersion)) {
    console.error('❌ Invalid version format. Please use semantic versioning (e.g., 2.1.0, 2.1.0-beta.1)')
    process.exit(1)
  }
  
  console.log(`🚀 Syncing version to ${newVersion}...`)
  console.log('')
  
  let successCount = 0
  let totalCount = 0
  
  // Update root package.json
  totalCount++
  if (updateRootPackageVersion(newVersion)) {
    successCount++
  }
  
  // Update all package directories
  const packageDirs = getPackageDirectories()
  
  packageDirs.forEach(packageDir => {
    totalCount++
    if (updatePackageVersion(packageDir, newVersion)) {
      successCount++
    }
  })
  
  console.log('')
  console.log(`📊 Summary: ${successCount}/${totalCount} packages updated successfully`)
  
  if (successCount === totalCount) {
    console.log('🎉 All packages updated successfully!')
    
    // Update CHANGELOG.md if it exists
    const changelogPath = path.join(ROOT_DIR, 'CHANGELOG.md')
    if (fs.existsSync(changelogPath)) {
      try {
        const changelog = fs.readFileSync(changelogPath, 'utf8')
        const today = new Date().toISOString().split('T')[0]
        const newEntry = `\n## [${newVersion}] - ${today}\n\n### Added\n- \n\n### Changed\n- \n\n### Fixed\n- \n\n`
        
        // Insert new entry after the first line (usually the title)
        const lines = changelog.split('\n')
        lines.splice(2, 0, newEntry)
        
        fs.writeFileSync(changelogPath, lines.join('\n'))
        console.log('📝 Updated CHANGELOG.md with new version entry')
      } catch (error) {
        console.warn('⚠️  Failed to update CHANGELOG.md:', error.message)
      }
    }
    
    console.log('')
    console.log('Next steps:')
    console.log('1. Review and update CHANGELOG.md')
    console.log('2. Commit changes: git add . && git commit -m "chore: bump version to ' + newVersion + '"')
    console.log('3. Create tag: git tag -a v' + newVersion + ' -m "Release version ' + newVersion + '"')
    console.log('4. Push changes: git push origin main --tags')
    
    process.exit(0)
  } else {
    console.log('❌ Some packages failed to update. Please check the errors above.')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  updatePackageVersion,
  updateRootPackageVersion,
  validateVersion,
  getCurrentVersion
}