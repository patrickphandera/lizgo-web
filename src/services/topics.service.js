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

  async createTopic(data) {
    return this.create(data)
  }

  async updateTopic(id, data) {
    return this.patch(id, data)
  }

  async deleteTopic(id) {
    return this.delete(id)
  }
}

export default new TopicsService()
