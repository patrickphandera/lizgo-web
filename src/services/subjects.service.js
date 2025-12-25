import BaseDbService from './base.db.service.js'

class SubjectsService extends BaseDbService {
  constructor() {
    super('/subjects')
  }

  async list(params = {}) {
    return this.getAll(params)
  }

  async get(id) {
    return this.getById(id)
  }

  // Get subject by ID with full details
  async getSubjectDetails(id) {
    try {
      const response = await this.rest.get(`${this.endpoint}/${id}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to fetch subject ${id}:`, error)
      throw error
    }
  }

  async createSubject(data) {
    return this.create(data)
  }

  async updateSubject(id, data) {
    return this.patch(id, data)
  }

  async deleteSubject(id) {
    return this.delete(id)
  }

  // Get subjects by curriculum
  async getSubjectsByCurriculum(curriculumId, params = {}) {
    try {
      return await this.find({ curriculumId }, params)
    } catch (error) {
      console.error(`Failed to fetch subjects for curriculum ${curriculumId}:`, error)
      throw error
    }
  }

  // Get subjects by level
  async getSubjectsByLevel(levelId, params = {}) {
    try {
      return await this.find({ levelId }, params)
    } catch (error) {
      console.error(`Failed to fetch subjects for level ${levelId}:`, error)
      throw error
    }
  }

  // Publish subject
  async publishSubject(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { published: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to publish subject ${id}:`, error)
      throw error
    }
  }

  // Archive subject
  async archiveSubject(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { archived: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to archive subject ${id}:`, error)
      throw error
    }
  }
}

export default new SubjectsService()
