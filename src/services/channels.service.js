// ../services/channels.service.js
import BaseDbService from './base.db.service.js'

class ChannelsService extends BaseDbService {
  constructor() {
    super('/channels')
  }

  async create(data) {
    return this.create(data)
  }

  async list(params = {}) {
    return this.getAll(params)
  }

  // Add other methods as needed...
}

export default new ChannelsService()
