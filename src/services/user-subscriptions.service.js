import BaseDbService from './base.db.service.js'

class UserSubscriptionsService extends BaseDbService {
  constructor() {
    super('/user-subscriptions')
  }

  async list(params = {}) {
    return this.getAll(params)
  }

  async get(id) {
    return this.getById(id)
  }

  // Get UserSubscription by ID with full details
  async getUserSubscriptionDetails(id) {
    try {
      const response = await this.rest.get(`${this.endpoint}/${id}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to fetch UserSubscription ${id}:`, error)
      throw error
    }
  }

  async createUserSubscription(data) {
    return this.create(data)
  }

  async updateUserSubscription(id, data) {
    return this.patch(id, data)
  }

  async deleteUserSubscription(id) {
    return this.delete(id)
  }

  // Get UserSubscriptions by subject
  async getUserSubscriptionsBySubject(subjectId, params = {}) {
    try {
      return await this.find({ subjectId }, params)
    } catch (error) {
      console.error(`Failed to fetch UserSubscriptions for subject ${subjectId}:`, error)
      throw error
    }
  }

  // Get UserSubscriptions by curriculum
  async getUserSubscriptionsByCurriculum(curriculumId, params = {}) {
    try {
      return await this.find({ curriculumId }, params)
    } catch (error) {
      console.error(`Failed to fetch UserSubscriptions for curriculum ${curriculumId}:`, error)
      throw error
    }
  }

  // Publish UserSubscription
  async publishUserSubscription(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { published: true })
      return response.data || response
    } catch (error) {
      console.error(`Failed to publish UserSubscription ${id}:`, error)
      throw error
    }
  }

  // Archive UserSubscription
  async archiveUserSubscription(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { archived: true })
      return response.data || response
    } catch (error) {
      console.error(`Failed to archive UserSubscription ${id}:`, error)
      throw error
    }
  }
}

export default new UserSubscriptionsService()
