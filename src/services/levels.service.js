import BaseDbService from './base.db.service.js'

class LevelsService extends BaseDbService {
  constructor() {
    super('/levels')
  }

  async list(params = {}) {
    return this.getAll(params)
  }

  async get(id) {
    return this.getById(id)
  }

  // Get level by ID with full details
  async getLevelDetails(id) {
    try {
      const response = await this.rest.get(`${this.endpoint}/${id}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to fetch level ${id}:`, error)
      throw error
    }
  }

  async createLevel(data) {
    return this.create(data)
  }

  async updateLevel(id, data) {
    return this.patch(id, data)
  }

  async deleteLevel(id) {
    return this.delete(id)
  }

  // Get levels by curriculum
  async getLevelsByCurriculum(curriculumId, params = {}) {
    try {
      return await this.find({ curriculumId }, params)
    } catch (error) {
      console.error(`Failed to fetch levels for curriculum ${curriculumId}:`, error)
      throw error
    }
  }

  // Publish level
  async publishLevel(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { published: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to publish level ${id}:`, error)
      throw error
    }
  }

  // Archive level
  async archiveLevel(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { archived: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to archive level ${id}:`, error)
      throw error
    }
  }
}

export default new LevelsService()
