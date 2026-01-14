import RestService from './rest.service.js'

class UserLessonsService {
  async list() {
    const url = '/user-lessons'
    return RestService.get(url)
  }

  async get(id) {
    return RestService.get(`/user-lessons/${id}`)
  }

  async create(data) {
    return RestService.post('/user-lessons', data)
  }

  async update(id, data) {
    return RestService.patch(`/user-lessons/${id}`, data)
  }

  async delete(id) {
    return RestService.delete(`/user-lessons/${id}`)
  }
}

export default new UserLessonsService()
