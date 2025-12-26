import { io } from 'socket.io-client'

class SocketService {
  socket = null

  connect(token) {
    if (this.socket) return this.socket

    this.socket = io(process.env.API_URL, {
      auth: { token }
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinConversation(conversationId) {
    this.socket.emit('joinConversation', { conversationId })
  }

  sendMessage(conversationId, content) {
    this.socket.emit('sendMessage', {
      conversationId,
      content
    })
  }

  onNewMessage(callback) {
    this.socket.on('newMessage', callback)
  }
}

export default new SocketService()
