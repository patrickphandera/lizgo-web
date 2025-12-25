import RestService from './rest.service.js'

class UsersService {
  async list(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/users?${queryString}` : '/users'
    return RestService.get(url)
  }

  async get(id) {
    return RestService.get(`/users/${id}`)
  }

  async create(data) {
    return RestService.post('/users', data)
  }

  async update(id, data) {
    return RestService.patch(`/users/${id}`, data)
  }

  async delete(id) {
    return RestService.delete(`/users/${id}`)
  }
}

export default new UsersService()