import BaseDbService from './base.db.service.js'

class UserPersonalizationsService extends BaseDbService {
  constructor() {
    super('/user-personalizations')
  }

  async list(params = {}) {
    return this.getAll(params)
  }

  async get(id) {
    return this.getById(id)
  }

  // Get userPersolization by ID with full details
  async getUserPersonalizationDetails(id) {
    try {
      const response = await this.rest.get(`${this.endpoint}/${id}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to fetch user-persolization ${id}:`, error)
      throw error
    }
  }

  async createUserPersonalization(data) {
    return this.create(data)
  }

  async updateUserPersonalization(id, data) {
    return this.patch(id, data)
  }

  async deleteUserPersonalization(id) {
    return this.delete(id)
  }

  // Get userPersolizations by curriculum
  async getUserPersonalizationsByCurriculum(curriculumId, params = {}) {
    try {
      return await this.find({ curriculumId }, params)
    } catch (error) {
      console.error(`Failed to fetch user persolizations for curriculum ${curriculumId}:`, error)
      throw error
    }
  }

  // Publish userPersolization
  async publishUserPersonalization(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { published: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to publish user persolization ${id}:`, error)
      throw error
    }
  }

  // Archive userPersolization
  async archiveUserPersonalization(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { archived: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to archive user persolization ${id}:`, error)
      throw error
    }
  }
}

export default new UserPersonalizationsService()
