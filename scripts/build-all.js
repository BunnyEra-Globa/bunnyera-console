#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

/**
 * Build all packages in the correct order with dependency resolution
 */

const ROOT_DIR = path.resolve(__dirname, '..')
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages')

// Build order based on dependencies
const BUILD_ORDER = [
  'bunnyera-console-core',    // No dependencies
  'bunnyera-console-ui',      // Depends on core
  'bunnyera-console-apps',    // Depends on core and ui
  'bunnyera-console-electron' // Depends on all others
]

function getPackageInfo(packageName) {
  const packagePath = path.join(PACKAGES_DIR, packageName)
  const packageJsonPath = path.join(packagePath, 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    return null
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    return {
      name: packageJson.name,
      version: packageJson.version,
      path: packagePath,
      scripts: packageJson.scripts || {},
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {}
    }
  } catch (error) {
    console.error(`❌ Failed to read package.json for ${packageName}:`, error.message)
    return null
  }
}

function hasScript(packageInfo, scriptName) {
  return packageInfo && packageInfo.scripts && packageInfo.scripts[scriptName]
}

function runCommand(command, cwd, options = {}) {
  const { verbose = false, dryRun = false } = options
  
  if (dryRun) {
    console.log(`[DRY RUN] Would run: ${command}`)
    console.log(`[DRY RUN] In directory: ${cwd}`)
    return true
  }
  
  try {
    const stdio = verbose ? 'inherit' : 'pipe'
    const result = execSync(command, { 
      cwd, 
      stdio,
      encoding: 'utf8'
    })
    
    if (!verbose && result) {
      console.log(result.toString().trim())
    }
    
    return true
  } catch (error) {
    console.error(`❌ Command failed: ${command}`)
    console.error(`   Directory: ${cwd}`)
    console.error(`   Error: ${error.message}`)
    
    if (error.stdout) {
      console.error('   Stdout:', error.stdout.toString())
    }
    if (error.stderr) {
      console.error('   Stderr:', error.stderr.toString())
    }
    
    return false
  }
}

function buildPackage(packageName, options = {}) {
  const { verbose = false, dryRun = false, skipTests = false } = options
  
  console.log(`📦 Building ${packageName}...`)
  
  const packageInfo = getPackageInfo(packageName)
  if (!packageInfo) {
    console.error(`❌ Package ${packageName} not found or invalid`)
    return false
  }
  
  const packagePath = packageInfo.path
  
  // Check if package has build script
  if (!hasScript(packageInfo, 'build')) {
    console.log(`⚠️  No build script found for ${packageName}, skipping...`)
    return true
  }
  
  // Run type checking if available
  if (hasScript(packageInfo, 'type-check')) {
    console.log(`  🔍 Type checking...`)
    if (!runCommand('pnpm type-check', packagePath, { verbose, dryRun })) {
      return false
    }
  }
  
  // Run linting if available
  if (hasScript(packageInfo, 'lint')) {
    console.log(`  🔍 Linting...`)
    if (!runCommand('pnpm lint', packagePath, { verbose, dryRun })) {
      return false
    }
  }
  
  // Run tests if available and not skipped
  if (!skipTests && hasScript(packageInfo, 'test')) {
    console.log(`  🧪 Testing...`)
    if (!runCommand('pnpm test', packagePath, { verbose, dryRun })) {
      return false
    }
  }
  
  // Run build
  console.log(`  🔨 Building...`)
  if (!runCommand('pnpm build', packagePath, { verbose, dryRun })) {
    return false
  }
  
  console.log(`✅ ${packageName} built successfully`)
  return true
}

function buildElectronDistributables(options = {}) {
  const { verbose = false, dryRun = false, platform = 'all' } = options
  
  console.log('📱 Building Electron distributables...')
  
  const electronPackage = 'bunnyera-console-electron'
  const packageInfo = getPackageInfo(electronPackage)
  
  if (!packageInfo) {
    console.error(`❌ Electron package not found`)
    return false
  }
  
  const packagePath = packageInfo.path
  
  // Determine build command based on platform
  let buildCommand = 'pnpm dist'
  
  if (platform !== 'all') {
    switch (platform.toLowerCase()) {
      case 'windows':
      case 'win':
        buildCommand = 'pnpm dist --win'
        break
      case 'macos':
      case 'mac':
        buildCommand = 'pnpm dist --mac'
        break
      case 'linux':
        buildCommand = 'pnpm dist --linux'
        break
      default:
        console.warn(`⚠️  Unknown platform: ${platform}, building for all platforms`)
    }
  }
  
  console.log(`  🔨 Building distributables for ${platform}...`)
  if (!runCommand(buildCommand, packagePath, { verbose, dryRun })) {
    return false
  }
  
  console.log(`✅ Electron distributables built successfully`)
  return true
}

function checkDependencies() {
  console.log('🔍 Checking dependencies...')
  
  // Check if pnpm is available
  try {
    execSync('pnpm --version', { stdio: 'ignore' })
  } catch (error) {
    console.error('❌ pnpm is not installed or not in PATH')
    console.error('   Please install pnpm: npm install -g pnpm')
    return false
  }
  
  // Check if dependencies are installed
  const nodeModulesPath = path.join(ROOT_DIR, 'node_modules')
  if (!fs.existsSync(nodeModulesPath)) {
    console.error('❌ Dependencies not installed')
    console.error('   Please run: pnpm install')
    return false
  }
  
  console.log('✅ Dependencies check passed')
  return true
}

function generateBuildReport(results, startTime) {
  const endTime = Date.now()
  const totalTime = endTime - startTime
  
  console.log('')
  console.log('📊 Build Report')
  console.log('================')
  console.log(`Total time: ${(totalTime / 1000).toFixed(2)}s`)
  console.log('')
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  console.log('')
  
  if (failed > 0) {
    console.log('Failed packages:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.package}`)
    })
    console.log('')
  }
  
  // Show build artifacts
  console.log('📁 Build Artifacts:')
  BUILD_ORDER.forEach(packageName => {
    const packagePath = path.join(PACKAGES_DIR, packageName)
    const distPath = path.join(packagePath, 'dist')
    
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath)
      console.log(`  ${packageName}/dist/ (${files.length} files)`)
    }
  })
}

function main() {
  const args = process.argv.slice(2)
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    dryRun: args.includes('--dry-run') || args.includes('-n'),
    skipTests: args.includes('--skip-tests'),
    skipLint: args.includes('--skip-lint'),
    dist: args.includes('--dist'),
    platform: args.find(arg => arg.startsWith('--platform='))?.split('=')[1] || 'all',
    parallel: args.includes('--parallel')
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('🔨 BunnyEra Console Build Script')
    console.log('')
    console.log('Usage: node build-all.js [options]')
    console.log('')
    console.log('Options:')
    console.log('  --verbose, -v         Show detailed build output')
    console.log('  --dry-run, -n         Show what would be built without building')
    console.log('  --skip-tests          Skip running tests during build')
    console.log('  --skip-lint           Skip linting during build')
    console.log('  --dist                Also build Electron distributables')
    console.log('  --platform=<name>     Build distributables for specific platform (windows|macos|linux|all)')
    console.log('  --parallel            Build packages in parallel (experimental)')
    console.log('  --help, -h            Show this help message')
    console.log('')
    console.log('Examples:')
    console.log('  node build-all.js                    # Build all packages')
    console.log('  node build-all.js --verbose          # Build with detailed output')
    console.log('  node build-all.js --skip-tests       # Build without running tests')
    console.log('  node build-all.js --dist             # Build packages and distributables')
    console.log('  node build-all.js --platform=windows # Build Windows distributables only')
    console.log('')
    process.exit(0)
  }
  
  console.log(`🔨 BunnyEra Console Build${options.dryRun ? ' (DRY RUN)' : ''}`)
  console.log('')
  
  const startTime = Date.now()
  
  // Check dependencies
  if (!options.dryRun && !checkDependencies()) {
    process.exit(1)
  }
  
  // Build packages
  const results = []
  
  if (options.parallel && !options.dryRun) {
    console.log('⚡ Building packages in parallel...')
    // TODO: Implement parallel building with proper dependency resolution
    console.warn('⚠️  Parallel building not yet implemented, falling back to sequential')
  }
  
  // Sequential build
  for (const packageName of BUILD_ORDER) {
    const success = buildPackage(packageName, options)
    results.push({ package: packageName, success })
    
    if (!success && !options.dryRun) {
      console.error(`❌ Build failed for ${packageName}`)
      process.exit(1)
    }
  }
  
  // Build distributables if requested
  if (options.dist) {
    const success = buildElectronDistributables(options)
    results.push({ package: 'electron-dist', success })
    
    if (!success && !options.dryRun) {
      console.error(`❌ Failed to build Electron distributables`)
      process.exit(1)
    }
  }
  
  // Generate report
  generateBuildReport(results, startTime)
  
  const allSuccessful = results.every(r => r.success)
  
  if (allSuccessful) {
    console.log('🎉 All builds completed successfully!')
    
    if (!options.dryRun) {
      console.log('')
      console.log('Next steps:')
      console.log('1. Test the built packages')
      console.log('2. Run E2E tests: pnpm test:e2e')
      if (options.dist) {
        console.log('3. Test the distributables on target platforms')
      }
    }
    
    process.exit(0)
  } else {
    console.log('❌ Some builds failed. Check the errors above.')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  buildPackage,
  buildElectronDistributables,
  checkDependencies,
  BUILD_ORDER
}