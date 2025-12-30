// src/services/socketService.js
import { io } from 'socket.io-client'

class SocketService {
  socket = null
  listeners = new Map()

  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket already connected')
      return this.socket
    }

    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.disconnect()
    }

    this.socket = io(`${process.env.VITE_API_URL}/messaging`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    this.setupEventHandlers()
    return this.socket
  }

  setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.listeners.clear()
    }
  }

  isConnected() {
    return this.socket?.connected || false
  }

  joinConversation(conversationId, callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.emit('joinConversation', { conversationId }, (response) => {
      if (response?.success) {
        console.log(`Joined conversation: ${conversationId}`)
      } else {
        console.error('Failed to join conversation:', response?.error)
      }
      callback?.(response)
    })
  }

  leaveConversation(conversationId, callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.emit('leaveConversation', { conversationId }, (response) => {
      if (response?.success) {
        console.log(`Left conversation: ${conversationId}`)
      }
      callback?.(response)
    })
  }

  sendMessage(conversationId, content, callback) {
    if (!this.socket?.connected) {
      console.error('Socket not connected')
      callback?.({ success: false, error: 'Socket not connected' })
      return
    }

    this.socket.emit(
      'sendMessage',
      { conversationId, content },
      (response) => {
        if (response?.success) {
          console.log('Message sent successfully')
        } else {
          console.error('Failed to send message:', response?.error)
        }
        callback?.(response)
      }
    )
  }

  markAsRead(conversationId, messageId, callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.emit(
      'markAsRead',
      { conversationId, messageId },
      (response) => {
        callback?.(response)
      }
    )
  }

  onNewMessage(callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.on('newMessage', callback)
    this.listeners.set('newMessage', callback)
  }

  offNewMessage() {
    if (this.socket && this.listeners.has('newMessage')) {
      const callback = this.listeners.get('newMessage')
      this.socket.off('newMessage', callback)
      this.listeners.delete('newMessage')
    }
  }

  // Clean up all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
      this.listeners.clear()
    }
  }
}

export default new SocketService()
