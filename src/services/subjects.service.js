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

  async createSubject(data) {
    return this.create(data)
  }

  async updateSubject(id, data) {
    return this.patch(id, data)
  }

  async deleteSubject(id) {
    return this.delete(id)
  }
}

export default new SubjectsService()
