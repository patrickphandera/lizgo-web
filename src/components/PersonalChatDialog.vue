<template>
  <q-dialog v-model="isOpen" persistent  full-height>
    <q-card class="column full-height" style="width: 600px;" >
      <q-bar>
        <div class="text-h6">Chat</div>
        <q-space />
        <q-btn
          dense
          flat
          icon="close"
          v-close-popup
        />
      </q-bar>

      <personal-chat
        :conversation-id="conversationId"
        class="col"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import PersonalChat from './PersonalChat.vue'

export default {
  name: 'PersonalChatDialog',

  components: {
    PersonalChat
  },

  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    conversationId: {
      type: String,
      required: true
    }
  },

  computed: {
    isOpen: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>
