import BaseDbService from './base.db.service.js'

class CurriculumsService extends BaseDbService {
  constructor() {
    super('/curriculums')
  }

  async list(params = {}) {
    return this.getAll(params)
  }

  async get(id) {
    return this.getById(id)
  }

  // Get curriculum by ID with full details
  async getCurriculumDetails(id) {
    try {
      const response = await this.rest.get(`${this.endpoint}/${id}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to fetch curriculum ${id}:`, error)
      throw error
    }
  }

  async createCurriculum(data) {
    console.log('Creating curriculum with data:', data)
    return this.create(data)
  }

  async updateCurriculum(id, data) {
    return this.patch(id, data)
  }

  async deleteCurriculum(id) {
    return this.delete(id)
  }

  // Publish curriculum
  async publishCurriculum(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { published: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to publish curriculum ${id}:`, error)
      throw error
    }
  }

  // Archive curriculum
  async archiveCurriculum(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { archived: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to archive curriculum ${id}:`, error)
      throw error
    }
  }
}

export default new CurriculumsService()
