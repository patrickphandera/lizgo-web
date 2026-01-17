// ../services/channels.service.js
import BaseDbService from './base.db.service.js'

class ChannelsService extends BaseDbService {
  constructor() {
    super('/channels')
  }

  // Create a new channel
  async create(data) {
    try {
      const response = await this.rest.post(this.endpoint, data)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error('Failed to create channel:', error)
      throw error
    }
  }

  // List all channels
  async list(params = {}) {
    return this.getAll(params)
  }

  // Get a single channel by ID
  async get(id) {
    return this.getById(id)
  }

  // Update a channel (partial update)
  async update(id, data) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, data)
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to update channel ${id}:`, error)
      throw error
    }
  }

  // Delete a channel
  async delete(id) {
    try {
      const response = await this.rest.delete(`${this.endpoint}/${id}`)
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to delete channel ${id}:`, error)
      throw error
    }
  }
}

export default new ChannelsService()
