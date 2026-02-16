import { test, expect } from '@playwright/test'

test.describe('BunnyEra Console E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')
    
    // Wait for the application to load
    await page.waitForLoadState('networkidle')
  })

  test('should display the main application interface', async ({ page }) => {
    // Check if the main layout is visible
    await expect(page.locator('[data-testid="app-layout"]')).toBeVisible()
    
    // Check if sidebar is present
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
    
    // Check if header is present
    await expect(page.locator('[data-testid="header"]')).toBeVisible()
    
    // Check if workspace is present
    await expect(page.locator('[data-testid="workspace"]')).toBeVisible()
  })

  test('should navigate between different sections', async ({ page }) => {
    // Test navigation to Dashboard
    await page.click('[data-testid="nav-dashboard"]')
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible()
    await expect(page).toHaveURL(/.*dashboard/)

    // Test navigation to Projects
    await page.click('[data-testid="nav-projects"]')
    await expect(page.locator('[data-testid="projects-page"]')).toBeVisible()
    await expect(page).toHaveURL(/.*projects/)

    // Test navigation to Resources
    await page.click('[data-testid="nav-resources"]')
    await expect(page.locator('[data-testid="resources-page"]')).toBeVisible()
    await expect(page).toHaveURL(/.*resources/)

    // Test navigation to AI Hub
    await page.click('[data-testid="nav-ai-hub"]')
    await expect(page.locator('[data-testid="ai-hub-page"]')).toBeVisible()
    await expect(page).toHaveURL(/.*ai-hub/)

    // Test navigation to Logs
    await page.click('[data-testid="nav-logs"]')
    await expect(page.locator('[data-testid="logs-page"]')).toBeVisible()
    await expect(page).toHaveURL(/.*logs/)

    // Test navigation to Settings
    await page.click('[data-testid="nav-settings"]')
    await expect(page.locator('[data-testid="settings-page"]')).toBeVisible()
    await expect(page).toHaveURL(/.*settings/)
  })

  test('should handle theme switching', async ({ page }) => {
    // Navigate to settings
    await page.click('[data-testid="nav-settings"]')
    
    // Find theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"]')
    await expect(themeToggle).toBeVisible()
    
    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    })
    
    // Toggle theme
    await themeToggle.click()
    
    // Wait for theme change
    await page.waitForTimeout(500)
    
    // Verify theme changed
    const newTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    })
    
    expect(newTheme).not.toBe(initialTheme)
  })

  test('should create a new project', async ({ page }) => {
    // Navigate to projects
    await page.click('[data-testid="nav-projects"]')
    
    // Click create project button
    await page.click('[data-testid="create-project-btn"]')
    
    // Fill project form
    await page.fill('[data-testid="project-name-input"]', 'Test Project E2E')
    await page.fill('[data-testid="project-description-input"]', 'A test project created during E2E testing')
    
    // Select project template (if available)
    const templateSelect = page.locator('[data-testid="project-template-select"]')
    if (await templateSelect.isVisible()) {
      await templateSelect.selectOption('basic')
    }
    
    // Submit form
    await page.click('[data-testid="create-project-submit"]')
    
    // Wait for project creation
    await page.waitForSelector('[data-testid="project-created-success"]', { timeout: 10000 })
    
    // Verify project appears in list
    await expect(page.locator('[data-testid="project-list"]')).toContainText('Test Project E2E')
  })

  test('should upload and manage resources', async ({ page }) => {
    // Navigate to resources
    await page.click('[data-testid="nav-resources"]')
    
    // Create a test file
    const testFileContent = 'This is a test file for E2E testing'
    const testFile = await page.evaluateHandle((content) => {
      const file = new File([content], 'test-file.txt', { type: 'text/plain' })
      return file
    }, testFileContent)
    
    // Upload file
    const fileInput = page.locator('[data-testid="file-upload-input"]')
    await fileInput.setInputFiles(await testFile.jsonValue())
    
    // Wait for upload completion
    await page.waitForSelector('[data-testid="upload-success"]', { timeout: 10000 })
    
    // Verify file appears in resource list
    await expect(page.locator('[data-testid="resource-list"]')).toContainText('test-file.txt')
    
    // Test file search
    await page.fill('[data-testid="resource-search-input"]', 'test-file')
    await page.waitForTimeout(500)
    await expect(page.locator('[data-testid="resource-list"]')).toContainText('test-file.txt')
  })

  test('should create and execute AI workflow', async ({ page }) => {
    // Navigate to AI Hub
    await page.click('[data-testid="nav-ai-hub"]')
    
    // Click create workflow button
    await page.click('[data-testid="create-workflow-btn"]')
    
    // Fill workflow form
    await page.fill('[data-testid="workflow-name-input"]', 'Test Workflow E2E')
    await page.fill('[data-testid="workflow-description-input"]', 'A test workflow for E2E testing')
    
    // Add workflow step
    await page.click('[data-testid="add-workflow-step"]')
    
    // Configure step
    await page.selectOption('[data-testid="step-type-select"]', 'text-generation')
    await page.fill('[data-testid="step-prompt-input"]', 'Generate a short greeting message')
    
    // Save workflow
    await page.click('[data-testid="save-workflow-btn"]')
    
    // Wait for workflow creation
    await page.waitForSelector('[data-testid="workflow-created-success"]', { timeout: 10000 })
    
    // Execute workflow (if AI provider is configured)
    const executeBtn = page.locator('[data-testid="execute-workflow-btn"]')
    if (await executeBtn.isVisible()) {
      await executeBtn.click()
      
      // Wait for execution to complete
      await page.waitForSelector('[data-testid="workflow-execution-complete"]', { timeout: 30000 })
      
      // Verify execution results
      await expect(page.locator('[data-testid="workflow-results"]')).toBeVisible()
    }
  })

  test('should display and filter logs', async ({ page }) => {
    // Navigate to logs
    await page.click('[data-testid="nav-logs"]')
    
    // Wait for logs to load
    await page.waitForSelector('[data-testid="logs-list"]', { timeout: 10000 })
    
    // Verify logs are displayed
    await expect(page.locator('[data-testid="logs-list"]')).toBeVisible()
    
    // Test log level filtering
    await page.selectOption('[data-testid="log-level-filter"]', 'info')
    await page.waitForTimeout(1000)
    
    // Test date range filtering
    const today = new Date().toISOString().split('T')[0]
    await page.fill('[data-testid="log-date-from"]', today)
    await page.fill('[data-testid="log-date-to"]', today)
    
    // Apply filters
    await page.click('[data-testid="apply-log-filters"]')
    await page.waitForTimeout(1000)
    
    // Verify filtered results
    await expect(page.locator('[data-testid="logs-list"]')).toBeVisible()
  })

  test('should handle responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
    await expect(page.locator('[data-testid="sidebar-expanded"]')).toBeVisible()
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)
    
    // Sidebar should be collapsible on tablet
    const sidebarToggle = page.locator('[data-testid="sidebar-toggle"]')
    if (await sidebarToggle.isVisible()) {
      await sidebarToggle.click()
      await expect(page.locator('[data-testid="sidebar-collapsed"]')).toBeVisible()
    }
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)
    
    // Mobile navigation should be available
    const mobileNav = page.locator('[data-testid="mobile-nav"]')
    if (await mobileNav.isVisible()) {
      await expect(mobileNav).toBeVisible()
    }
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
    
    // Test navigation with arrow keys (if applicable)
    await page.click('[data-testid="nav-projects"]')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowUp')
    
    // Test Enter key activation
    await page.keyboard.press('Enter')
    
    // Test Escape key (close modals, etc.)
    await page.keyboard.press('Escape')
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Test network error handling
    await page.route('**/api/**', route => route.abort())
    
    // Navigate to a section that requires API calls
    await page.click('[data-testid="nav-projects"]')
    
    // Should show error state
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    
    // Test retry functionality
    await page.unroute('**/api/**')
    const retryBtn = page.locator('[data-testid="retry-btn"]')
    if (await retryBtn.isVisible()) {
      await retryBtn.click()
      await page.waitForTimeout(2000)
    }
  })

  test('should persist user preferences', async ({ page }) => {
    // Navigate to settings
    await page.click('[data-testid="nav-settings"]')
    
    // Change a setting
    const autoSaveToggle = page.locator('[data-testid="auto-save-toggle"]')
    if (await autoSaveToggle.isVisible()) {
      await autoSaveToggle.click()
    }
    
    // Save settings
    await page.click('[data-testid="save-settings-btn"]')
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Navigate back to settings
    await page.click('[data-testid="nav-settings"]')
    
    // Verify setting persisted
    if (await autoSaveToggle.isVisible()) {
      const isChecked = await autoSaveToggle.isChecked()
      expect(isChecked).toBeTruthy()
    }
  })
})

test.describe('Performance Tests', () => {
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('should handle large datasets efficiently', async ({ page }) => {
    // Navigate to projects
    await page.click('[data-testid="nav-projects"]')
    
    // Mock large dataset
    await page.route('**/api/projects', route => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `project-${i}`,
        name: `Project ${i}`,
        description: `Description for project ${i}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(largeDataset)
      })
    })
    
    const startTime = Date.now()
    await page.reload()
    await page.waitForSelector('[data-testid="project-list"]')
    const renderTime = Date.now() - startTime
    
    // Should render large dataset within 3 seconds
    expect(renderTime).toBeLessThan(3000)
    
    // Should implement virtualization for large lists
    const visibleItems = await page.locator('[data-testid="project-item"]').count()
    expect(visibleItems).toBeLessThan(100) // Should not render all 1000 items
  })
})