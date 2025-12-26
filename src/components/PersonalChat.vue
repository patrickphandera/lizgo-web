<template>
  <q-card class="column full-height">
    <!-- Messages -->
    <q-card-section class="col scroll">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="msg.senderId === userId ? 'text-right' : 'text-left'"
        class="q-mb-sm"
      >
        <q-chip
          :color="msg.senderId === userId ? 'primary' : 'grey-4'"
          text-color="black"
        >
          {{ msg.content }}
        </q-chip>
      </div>
    </q-card-section>

    <!-- Input -->
    <q-separator />
    <q-card-actions>
      <q-input
        v-model="newMessage"
        placeholder="Type a message..."
        class="col"
        dense
        outlined
        @keyup.enter="send"
      />
      <q-btn
        icon="send"
        color="primary"
        flat
        @click="send"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MessagesService from 'src/services/messages.service'
import SocketService from 'src/services/socket.service'
import { useAuthStore } from 'src/stores/auth'

const props = defineProps({
  conversationId: {
    type: String,
    required: true
  }
})

const authStore = useAuthStore()
const userId = authStore.user.id

const messages = ref([])
const newMessage = ref('')

// let socket

// Load history
const loadMessages = async () => {
  const res = await MessagesService.loadMessages(props.conversationId, {
    limit: 50
  })
  messages.value = res.messages || []
}

// Send message
const send = () => {
  if (!newMessage.value.trim()) return
  SocketService.sendMessage(props.conversationId, newMessage.value)
  newMessage.value = ''
}

onMounted(async () => {
  await loadMessages()

  SocketService.connect(authStore.token)
  SocketService.joinConversation(props.conversationId)

  SocketService.onNewMessage((message) => {
    if (message.conversationId === props.conversationId) {
      messages.value.push(message)
    }
  })
})

onBeforeUnmount(() => {
  SocketService.disconnect()
})
</script>

<style scoped>
.scroll {
  overflow-y: auto;
}
</style>
