<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn @click="openModal()" outline class="text-capitalize">
      <q-icon name="mdi-message-badge-outline" size="24px"></q-icon>
      {{ messages.length }} Comments
    </q-btn>

    <q-dialog persistent full-height full-width v-model="fixed">
      <q-card class="column no-wrap" style="height: 100%">
        <!-- Header -->
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Messages</div>
          <q-btn flat dense icon="close" @click="closeModal" />
        </q-card-section>

        <q-separator />

        <!-- Scrollable Content Area -->
        <q-card-section class="col scroll" ref="messageContainer">
          <q-item
            v-for="message in messages"
            :key="message._id"
            class="bg-grey-2 q-mt-sm row justify-between"
            style="border-radius: 10px"
          >
            <div class="row">
              <q-item-section avatar>
                <q-avatar size="40px">
                  <img :src="message.sender?.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-caption text-grey-9"
                  >@{{ message.sender || 'Unknown' }}</q-item-label
                >
                <q-item-label class="text-caption">
                  {{ message.content }}
                </q-item-label>
              </q-item-section>
            </div>
            <div>
              <q-item-label caption class="text-caption text-grey-9">
                {{ formatDate(message.createdAt) }}
              </q-item-label>
            </div>
          </q-item>

          <!-- Loading indicator -->
          <div v-if="loading" class="text-center q-pa-md">
            <q-spinner color="primary" size="3em" />
          </div>

          <!-- Empty state -->
          <div v-if="!loading && messages.length === 0" class="text-center q-pa-md text-grey">
            No messages yet. Be the first to comment!
          </div>
        </q-card-section>

        <q-separator />

        <!-- Fixed Bottom Input -->
        <q-card-actions class="q-pa-md">
          <q-input
            label="Write Message.."
            outlined
            class="full-width"
            v-model="newMessage"
            @keyup.enter="sendMessage"
            :loading="sending"
            :disable="!socketConnected"
          >
            <template v-slot:append>
              <q-btn
                color="primary"
                icon="mdi-send"
                flat
                @click="sendMessage"
                :loading="sending"
                :disable="!newMessage.trim() || !socketConnected"
              />
            </template>
          </q-input>
        </q-card-actions>

        <!-- Connection status -->
        <div v-if="!socketConnected" class="bg-negative text-white q-pa-sm text-center">
          <q-icon name="warning" /> Disconnected - Trying to reconnect...
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
// import {Notify} from 'quasar'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import socketService from '../services/socket.service'
// import conversationsService from 'src/services/conversations.service'
import { useAuthStore } from '../stores/auth' // Adjust to your auth store
import { date } from 'quasar'

const props = defineProps({
  conversationId: {
    type: String,
    required: true,
  },
})

const authStore = useAuthStore()

const fixed = ref(false)
const messages = ref([])
const newMessage = ref('')
const loading = ref(false)
const sending = ref(false)
const socketConnected = ref(false)
const messageContainer = ref(null)

// Format date helper
const formatDate = (dateStr) => {
  return date.formatDate(dateStr, 'MMM DD, YYYY HH:mm')
}

// Scroll to bottom of messages
const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    const container = messageContainer.value.$el
    container.scrollTop = container.scrollHeight
  }
}

// Load initial messages
const loadMessages = async () => {
  loading.value = true
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/conversations/${props.conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    const data = await response.json()
    messages.value = data.messages || []
    await scrollToBottom()
  } catch (error) {
    console.error('Failed to load messages:', error)
  } finally {
    loading.value = false
  }
}

// Send message via socket
const sendMessage = () => {
  if (!newMessage.value.trim() || sending.value) return

  sending.value = true
  socketService.sendMessage(props.conversationId, newMessage.value.trim(), (response) => {
    sending.value = false
    if (response?.success) {
      newMessage.value = ''
      // Message will be added via socket event
    } else {
      console.error('Failed to send message:', response?.error)
      // Show error notification
    }
  })
}

// const joinConversation = () => {
//   try{
//   conversationsService.joinConversation(props.conversationId)
//   openModal()
//   }catch(err){
//     Notify.create(err)
//   }
// }
// Handle incoming messages
const handleNewMessage = (data) => {
  if (data.conversationId === props.conversationId) {
    // Check if message already exists (to avoid duplicates)
    const exists = messages.value.find((m) => m._id === data.message._id)
    if (!exists) {
      messages.value.push(data.message)
      scrollToBottom()
    }
  }
}

// Open modal
const openModal = () => {
  fixed.value = true
  loadMessages()
}

// Close modal
const closeModal = () => {
  fixed.value = false
  socketService.leaveConversation(props.conversationId)
}

onMounted(() => {
  // Connect socket
  const token = authStore.token
  if (token) {
    socketService.connect(token)
    socketConnected.value = socketService.isConnected()

    // Listen for new messages
    socketService.onNewMessage(handleNewMessage)

    // Join conversation
    socketService.joinConversation(props.conversationId, (response) => {
      if (response?.success) {
        console.log('Successfully joined conversation')
      }
    })

    // Monitor connection status
    if (socketService.socket) {
      socketService.socket.on('connect', () => {
        socketConnected.value = true
      })
      socketService.socket.on('disconnect', () => {
        socketConnected.value = false
      })
    }
  }
})

onUnmounted(() => {
  // Clean up
  socketService.offNewMessage()
  socketService.leaveConversation(props.conversationId)
})
</script>
