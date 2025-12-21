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

  async createCurriculum(data) {
    return this.create(data)
  }

  async updateCurriculum(id, data) {
    return this.patch(id, data)
  }

  async deleteCurriculum(id) {
    return this.delete(id)
  }
}

export default new CurriculumsService()
