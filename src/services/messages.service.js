import BaseDbService from './base.db.service.js'

class MessagesService extends BaseDbService {
  constructor() {
    super('/conversations')
  }

  // Load messages for a conversation
  async loadMessages(conversationId, params = {}) {
    try {
      const response = await this.rest.get(
        `${this.endpoint}/${conversationId}/messages`,
        { params }
      )
      return response.data || response
    } catch (error) {
      console.error('Failed to load messages:', error)
      throw error
    }
  }
}

export default new MessagesService()
