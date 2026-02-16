#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

/**
 * Clean build artifacts and dependencies across the monorepo
 */

const ROOT_DIR = path.resolve(__dirname, '..')
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages')

// Directories and files to clean
const CLEAN_PATTERNS = [
  'dist',
  'build', 
  'coverage',
  'test-results',
  'playwright-report',
  '.next',
  '.nuxt',
  '.output',
  '.cache',
  '.temp',
  '.tmp',
  'node_modules',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  '*.tsbuildinfo',
  '*.log',
  '.DS_Store',
  'Thumbs.db'
]

function getPackageDirectories() {
  return fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(PACKAGES_DIR, dirent.name))
}

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true })
      return true
    } catch (error) {
      console.error(`❌ Failed to remove ${dirPath}:`, error.message)
      return false
    }
  }
  return false
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
      return true
    } catch (error) {
      console.error(`❌ Failed to remove ${filePath}:`, error.message)
      return false
    }
  }
  return false
}

function cleanDirectory(dirPath, patterns, options = {}) {
  const { dryRun = false, verbose = false } = options
  let removedCount = 0
  let totalSize = 0

  if (!fs.existsSync(dirPath)) {
    return { removedCount, totalSize }
  }

  patterns.forEach(pattern => {
    const targetPath = path.join(dirPath, pattern)
    
    // Handle glob patterns
    if (pattern.includes('*')) {
      try {
        const glob = require('glob')
        const matches = glob.sync(pattern, { cwd: dirPath, absolute: true })
        
        matches.forEach(match => {
          if (fs.existsSync(match)) {
            const stats = fs.statSync(match)
            totalSize += stats.size
            
            if (verbose) {
              console.log(`  ${dryRun ? '[DRY RUN] ' : ''}🗑️  ${path.relative(ROOT_DIR, match)}`)
            }
            
            if (!dryRun) {
              if (stats.isDirectory()) {
                if (removeDirectory(match)) removedCount++
              } else {
                if (removeFile(match)) removedCount++
              }
            } else {
              removedCount++
            }
          }
        })
      } catch (error) {
        // Fallback if glob is not available
        if (fs.existsSync(targetPath)) {
          const stats = fs.statSync(targetPath)
          totalSize += stats.size
          
          if (verbose) {
            console.log(`  ${dryRun ? '[DRY RUN] ' : ''}🗑️  ${path.relative(ROOT_DIR, targetPath)}`)
          }
          
          if (!dryRun) {
            if (stats.isDirectory()) {
              if (removeDirectory(targetPath)) removedCount++
            } else {
              if (removeFile(targetPath)) removedCount++
            }
          } else {
            removedCount++
          }
        }
      }
    } else {
      // Handle exact matches
      if (fs.existsSync(targetPath)) {
        const stats = fs.statSync(targetPath)
        totalSize += stats.size
        
        if (verbose) {
          console.log(`  ${dryRun ? '[DRY RUN] ' : ''}🗑️  ${path.relative(ROOT_DIR, targetPath)}`)
        }
        
        if (!dryRun) {
          if (stats.isDirectory()) {
            if (removeDirectory(targetPath)) removedCount++
          } else {
            if (removeFile(targetPath)) removedCount++
          }
        } else {
          removedCount++
        }
      }
    }
  })

  return { removedCount, totalSize }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function clearPnpmCache(options = {}) {
  const { dryRun = false, verbose = false } = options
  
  if (dryRun) {
    console.log('[DRY RUN] 🧹 Would clear pnpm cache')
    return
  }
  
  try {
    if (verbose) {
      console.log('🧹 Clearing pnpm cache...')
    }
    execSync('pnpm store prune', { stdio: verbose ? 'inherit' : 'ignore' })
    console.log('✅ pnpm cache cleared')
  } catch (error) {
    console.warn('⚠️  Failed to clear pnpm cache:', error.message)
  }
}

function clearNpmCache(options = {}) {
  const { dryRun = false, verbose = false } = options
  
  if (dryRun) {
    console.log('[DRY RUN] 🧹 Would clear npm cache')
    return
  }
  
  try {
    if (verbose) {
      console.log('🧹 Clearing npm cache...')
    }
    execSync('npm cache clean --force', { stdio: verbose ? 'inherit' : 'ignore' })
    console.log('✅ npm cache cleared')
  } catch (error) {
    console.warn('⚠️  Failed to clear npm cache:', error.message)
  }
}

function main() {
  const args = process.argv.slice(2)
  const options = {
    dryRun: args.includes('--dry-run') || args.includes('-n'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    deps: args.includes('--deps') || args.includes('--dependencies'),
    cache: args.includes('--cache'),
    all: args.includes('--all')
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log('🧹 BunnyEra Console Clean Script')
    console.log('')
    console.log('Usage: node clean.js [options]')
    console.log('')
    console.log('Options:')
    console.log('  --dry-run, -n     Show what would be deleted without actually deleting')
    console.log('  --verbose, -v     Show detailed output')
    console.log('  --deps            Also remove node_modules and lock files')
    console.log('  --cache           Also clear package manager caches')
    console.log('  --all             Clean everything (equivalent to --deps --cache)')
    console.log('  --help, -h        Show this help message')
    console.log('')
    console.log('Examples:')
    console.log('  node clean.js                    # Clean build artifacts only')
    console.log('  node clean.js --dry-run          # Preview what would be cleaned')
    console.log('  node clean.js --deps             # Clean build artifacts and dependencies')
    console.log('  node clean.js --all --verbose    # Clean everything with detailed output')
    console.log('')
    process.exit(0)
  }

  // Determine what to clean
  let patternsToClean = [
    'dist',
    'build',
    'coverage',
    'test-results',
    'playwright-report',
    '.next',
    '.nuxt',
    '.output',
    '.cache',
    '.temp',
    '.tmp',
    '*.tsbuildinfo',
    '*.log',
    '.DS_Store',
    'Thumbs.db'
  ]

  if (options.deps || options.all) {
    patternsToClean.push('node_modules', 'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock')
  }

  console.log(`🧹 BunnyEra Console Clean${options.dryRun ? ' (DRY RUN)' : ''}`)
  console.log('')

  let totalRemoved = 0
  let totalSize = 0

  // Clean root directory
  console.log('📁 Cleaning root directory...')
  const rootResult = cleanDirectory(ROOT_DIR, patternsToClean, options)
  totalRemoved += rootResult.removedCount
  totalSize += rootResult.totalSize

  if (options.verbose || rootResult.removedCount > 0) {
    console.log(`   Removed ${rootResult.removedCount} items (${formatBytes(rootResult.totalSize)})`)
  }

  // Clean package directories
  const packageDirs = getPackageDirectories()
  
  packageDirs.forEach(packageDir => {
    const packageName = path.basename(packageDir)
    console.log(`📦 Cleaning ${packageName}...`)
    
    const packageResult = cleanDirectory(packageDir, patternsToClean, options)
    totalRemoved += packageResult.removedCount
    totalSize += packageResult.totalSize

    if (options.verbose || packageResult.removedCount > 0) {
      console.log(`   Removed ${packageResult.removedCount} items (${formatBytes(packageResult.totalSize)})`)
    }
  })

  // Clear package manager caches
  if (options.cache || options.all) {
    console.log('')
    console.log('🧹 Clearing package manager caches...')
    clearPnpmCache(options)
    clearNpmCache(options)
  }

  console.log('')
  console.log(`📊 Summary: ${totalRemoved} items removed, ${formatBytes(totalSize)} freed`)

  if (options.dryRun) {
    console.log('')
    console.log('💡 This was a dry run. Run without --dry-run to actually clean files.')
  } else {
    console.log('🎉 Cleanup completed!')
    
    if (options.deps || options.all) {
      console.log('')
      console.log('💡 Dependencies were removed. Run "pnpm install" to reinstall them.')
    }
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  cleanDirectory,
  removeDirectory,
  removeFile,
  formatBytes
}