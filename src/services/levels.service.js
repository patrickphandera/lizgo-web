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

  async createLevel(data) {
    return this.create(data)
  }

  async updateLevel(id, data) {
    return this.patch(id, data)
  }

  async deleteLevel(id) {
    return this.delete(id)
  }
}

export default new LevelsService()
