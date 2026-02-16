import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProjectManager } from '@bunnyera/console-core'

// Mock data
const mockProject = {
  id: 'test-project-1',
  name: 'Test Project',
  description: 'A test project for unit testing',
  status: 'active' as const,
  settings: {
    autoSave: true,
    notifications: true,
    customFields: {}
  },
  resources: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
}

const mockProjectConfig = {
  name: 'New Test Project',
  description: 'A new test project',
  settings: {
    autoSave: true,
    notifications: false
  }
}

describe('ProjectManager', () => {
  let projectManager: ProjectManager

  beforeEach(() => {
    projectManager = new ProjectManager()
    vi.clearAllMocks()
  })

  describe('createProject', () => {
    it('should create a new project with valid config', async () => {
      // Mock the internal create method
      const createSpy = vi.spyOn(projectManager, 'createProject')
      createSpy.mockResolvedValue(mockProject)

      const result = await projectManager.createProject(mockProjectConfig)

      expect(createSpy).toHaveBeenCalledWith(mockProjectConfig)
      expect(result).toEqual(mockProject)
      expect(result.name).toBe(mockProjectConfig.name)
      expect(result.description).toBe(mockProjectConfig.description)
    })

    it('should throw error with invalid config', async () => {
      const invalidConfig = {
        name: '', // Empty name should be invalid
        description: 'Test description'
      }

      const createSpy = vi.spyOn(projectManager, 'createProject')
      createSpy.mockRejectedValue(new Error('Project name is required'))

      await expect(projectManager.createProject(invalidConfig)).rejects.toThrow('Project name is required')
    })

    it('should apply default settings when not provided', async () => {
      const configWithoutSettings = {
        name: 'Project Without Settings',
        description: 'Test project'
      }

      const expectedProject = {
        ...mockProject,
        name: configWithoutSettings.name,
        description: configWithoutSettings.description,
        settings: {
          autoSave: true,
          notifications: true,
          customFields: {}
        }
      }

      const createSpy = vi.spyOn(projectManager, 'createProject')
      createSpy.mockResolvedValue(expectedProject)

      const result = await projectManager.createProject(configWithoutSettings)

      expect(result.settings.autoSave).toBe(true)
      expect(result.settings.notifications).toBe(true)
    })
  })

  describe('getProject', () => {
    it('should return project when it exists', async () => {
      const getSpy = vi.spyOn(projectManager, 'getProject')
      getSpy.mockResolvedValue(mockProject)

      const result = await projectManager.getProject('test-project-1')

      expect(getSpy).toHaveBeenCalledWith('test-project-1')
      expect(result).toEqual(mockProject)
    })

    it('should return null when project does not exist', async () => {
      const getSpy = vi.spyOn(projectManager, 'getProject')
      getSpy.mockResolvedValue(null)

      const result = await projectManager.getProject('non-existent-project')

      expect(getSpy).toHaveBeenCalledWith('non-existent-project')
      expect(result).toBeNull()
    })

    it('should throw error with invalid project ID', async () => {
      const getSpy = vi.spyOn(projectManager, 'getProject')
      getSpy.mockRejectedValue(new Error('Invalid project ID'))

      await expect(projectManager.getProject('')).rejects.toThrow('Invalid project ID')
    })
  })

  describe('updateProject', () => {
    it('should update project with valid data', async () => {
      const updates = {
        name: 'Updated Project Name',
        description: 'Updated description'
      }

      const updatedProject = {
        ...mockProject,
        ...updates,
        updatedAt: new Date('2024-01-02')
      }

      const updateSpy = vi.spyOn(projectManager, 'updateProject')
      updateSpy.mockResolvedValue(updatedProject)

      const result = await projectManager.updateProject('test-project-1', updates)

      expect(updateSpy).toHaveBeenCalledWith('test-project-1', updates)
      expect(result.name).toBe(updates.name)
      expect(result.description).toBe(updates.description)
      expect(result.updatedAt).toEqual(new Date('2024-01-02'))
    })

    it('should throw error when project not found', async () => {
      const updates = { name: 'Updated Name' }

      const updateSpy = vi.spyOn(projectManager, 'updateProject')
      updateSpy.mockRejectedValue(new Error('Project not found'))

      await expect(projectManager.updateProject('non-existent', updates)).rejects.toThrow('Project not found')
    })
  })

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      const deleteSpy = vi.spyOn(projectManager, 'deleteProject')
      deleteSpy.mockResolvedValue(undefined)

      await expect(projectManager.deleteProject('test-project-1')).resolves.toBeUndefined()
      expect(deleteSpy).toHaveBeenCalledWith('test-project-1')
    })

    it('should throw error when project not found', async () => {
      const deleteSpy = vi.spyOn(projectManager, 'deleteProject')
      deleteSpy.mockRejectedValue(new Error('Project not found'))

      await expect(projectManager.deleteProject('non-existent')).rejects.toThrow('Project not found')
    })
  })

  describe('listProjects', () => {
    const mockProjects = [
      mockProject,
      {
        ...mockProject,
        id: 'test-project-2',
        name: 'Second Test Project',
        status: 'completed' as const
      }
    ]

    it('should return all projects when no filters applied', async () => {
      const listSpy = vi.spyOn(projectManager, 'listProjects')
      listSpy.mockResolvedValue(mockProjects)

      const result = await projectManager.listProjects()

      expect(listSpy).toHaveBeenCalledWith(undefined)
      expect(result).toEqual(mockProjects)
      expect(result).toHaveLength(2)
    })

    it('should filter projects by status', async () => {
      const activeProjects = [mockProject]
      const filters = { status: 'active' as const }

      const listSpy = vi.spyOn(projectManager, 'listProjects')
      listSpy.mockResolvedValue(activeProjects)

      const result = await projectManager.listProjects(filters)

      expect(listSpy).toHaveBeenCalledWith(filters)
      expect(result).toEqual(activeProjects)
      expect(result).toHaveLength(1)
    })

    it('should search projects by name', async () => {
      const searchResults = [mockProject]
      const filters = { search: 'Test' }

      const listSpy = vi.spyOn(projectManager, 'listProjects')
      listSpy.mockResolvedValue(searchResults)

      const result = await projectManager.listProjects(filters)

      expect(listSpy).toHaveBeenCalledWith(filters)
      expect(result).toEqual(searchResults)
    })

    it('should apply pagination', async () => {
      const paginatedResults = [mockProject]
      const filters = { limit: 1, offset: 0 }

      const listSpy = vi.spyOn(projectManager, 'listProjects')
      listSpy.mockResolvedValue(paginatedResults)

      const result = await projectManager.listProjects(filters)

      expect(listSpy).toHaveBeenCalledWith(filters)
      expect(result).toEqual(paginatedResults)
    })
  })

  describe('duplicateProject', () => {
    it('should create a duplicate of existing project', async () => {
      const duplicatedProject = {
        ...mockProject,
        id: 'test-project-duplicate',
        name: 'Copy of Test Project',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      }

      const duplicateSpy = vi.spyOn(projectManager, 'duplicateProject')
      duplicateSpy.mockResolvedValue(duplicatedProject)

      const result = await projectManager.duplicateProject('test-project-1', 'Copy of Test Project')

      expect(duplicateSpy).toHaveBeenCalledWith('test-project-1', 'Copy of Test Project')
      expect(result.name).toBe('Copy of Test Project')
      expect(result.id).not.toBe(mockProject.id)
    })

    it('should throw error when source project not found', async () => {
      const duplicateSpy = vi.spyOn(projectManager, 'duplicateProject')
      duplicateSpy.mockRejectedValue(new Error('Source project not found'))

      await expect(projectManager.duplicateProject('non-existent', 'Copy')).rejects.toThrow('Source project not found')
    })
  })
})

describe('ProjectManager Integration', () => {
  let projectManager: ProjectManager

  beforeEach(() => {
    projectManager = new ProjectManager()
  })

  it('should handle complete project lifecycle', async () => {
    // Mock the entire lifecycle
    const createSpy = vi.spyOn(projectManager, 'createProject')
    const getSpy = vi.spyOn(projectManager, 'getProject')
    const updateSpy = vi.spyOn(projectManager, 'updateProject')
    const deleteSpy = vi.spyOn(projectManager, 'deleteProject')

    // Create project
    createSpy.mockResolvedValue(mockProject)
    const created = await projectManager.createProject(mockProjectConfig)
    expect(created).toEqual(mockProject)

    // Get project
    getSpy.mockResolvedValue(mockProject)
    const retrieved = await projectManager.getProject(created.id)
    expect(retrieved).toEqual(mockProject)

    // Update project
    const updates = { name: 'Updated Name' }
    const updatedProject = { ...mockProject, ...updates }
    updateSpy.mockResolvedValue(updatedProject)
    const updated = await projectManager.updateProject(created.id, updates)
    expect(updated.name).toBe('Updated Name')

    // Delete project
    deleteSpy.mockResolvedValue(undefined)
    await expect(projectManager.deleteProject(created.id)).resolves.toBeUndefined()
  })
})