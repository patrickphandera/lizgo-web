import BaseDbService from './base.db.service.js'

class ConversationsService extends BaseDbService {
  constructor() {
    super('/conversations')
  }

  async list(params = {}) {
    return this.getAll(params)
  }

  async get(id) {
    return this.getById(id)
  }

  // Get conversation by ID with full details
  async getConversationDetails(id) {
    try {
      const response = await this.rest.get(`${this.endpoint}/${id}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to fetch conversation ${id}:`, error)
      throw error
    }
  }

  async createConversation(data) {
    return this.create(data)
  }

  async updateConversation(id, data) {
    return this.patch(id, data)
  }

  async deleteConversation(id) {
    return this.delete(id)
  }

  // Get conversations by curriculum
  async getConversationsByCurriculum(curriculumId, params = {}) {
    try {
      return await this.find({ curriculumId }, params)
    } catch (error) {
      console.error(`Failed to fetch conversations for curriculum ${curriculumId}:`, error)
      throw error
    }
  }

  // Publish conversation
  async publishConversation(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { published: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to publish conversation ${id}:`, error)
      throw error
    }
  }

  // Archive conversation
  async archiveConversation(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { archived: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to archive conversation ${id}:`, error)
      throw error
    }
  }
}

export default new ConversationsService()
