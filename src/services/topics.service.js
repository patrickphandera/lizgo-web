import BaseDbService from './base.db.service.js'

class TopicsService extends BaseDbService {
  constructor() {
    super('/topics')
  }

  async list(params = {}) {
    return this.getAll(params)
  }

  async get(id) {
    return this.getById(id)
  }

  // Get topic by ID with full details
  async getTopicDetails(id) {
    try {
      const response = await this.rest.get(`${this.endpoint}/${id}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to fetch topic ${id}:`, error)
      throw error
    }
  }

  async createTopic(data) {
    return this.create(data)
  }

  async updateTopic(id, data) {
    return this.patch(id, data)
  }

  async deleteTopic(id) {
    return this.delete(id)
  }

  // Get topics by subject
  async getTopicsBySubject(subjectId, params = {}) {
    try {
      return await this.find({ subjectId }, params)
    } catch (error) {
      console.error(`Failed to fetch topics for subject ${subjectId}:`, error)
      throw error
    }
  }

  // Get topics by curriculum
  async getTopicsByCurriculum(curriculumId, params = {}) {
    try {
      return await this.find({ curriculumId }, params)
    } catch (error) {
      console.error(`Failed to fetch topics for curriculum ${curriculumId}:`, error)
      throw error
    }
  }

  // Publish topic
  async publishTopic(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { published: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to publish topic ${id}:`, error)
      throw error
    }
  }

  // Archive topic
  async archiveTopic(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { archived: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to archive topic ${id}:`, error)
      throw error
    }
  }
}

export default new TopicsService()
