import RestService from './rest.service.js'

class QuizzesService {
  async list(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/quizzes?${queryString}` : '/quizzes'
    return RestService.get(url)
  }

  async get(id) {
    return RestService.get(`/quizzes/${id}`)
  }

  async create(data) {
    return RestService.post('/quizzes', data)
  }

  async update(id, data) {
    return RestService.patch(`/quizzes/${id}`, data)
  }

  async delete(id) {
    return RestService.delete(`/quizzes/${id}`)
  }
}

export default new QuizzesService()