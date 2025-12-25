import RestService from './rest.service.js'

class DiscussionsService {
  async list(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/discussions?${queryString}` : '/discussions'
    return RestService.get(url)
  }

  async get(id) {
    return RestService.get(`/discussions/${id}`)
  }

  async create(data) {
    return RestService.post('/discussions', data)
  }

  async update(id, data) {
    return RestService.patch(`/discussions/${id}`, data)
  }

  async delete(id) {
    return RestService.delete(`/discussions/${id}`)
  }
}

export default new DiscussionsService()