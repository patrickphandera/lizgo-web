<template>
  <q-dialog
    v-model="dialogVisible"
    persistent
    @before-hide="onCancel"
    transition-show="slide-up"
    transition-hide="slide-down"
    maximized
  >
    <q-card style="width: 100%; max-width: 600px; height: auto">
      <q-card-section class="row items-center q-pb-md">
        <div class="text-h6">
          {{ channelId ? 'Create Group Chat for Channel' : 'Create New Group' }}
        </div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="onCancel"
          :disable="loading"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="onSubmit" ref="formRef" class="q-gutter-md">
          <q-input
            v-model="formData.title"
            label="Group Title *"
            dense
            outlined
            :rules="[val => !!val?.trim() || 'Group title is required']"
            :disable="loading"
          />
          <q-input
            v-model="formData.description"
            label="Description *"
            dense
            outlined
            type="textarea"
            :rules="[val => !!val?.trim() || 'Group title is required']"
            :disable="loading"
          />
          <!-- Member IDs (comma-separated or array-based input) -->
          <q-input
            v-model="memberInput"
            label="Member User IDs (comma-separated)"
            dense
            outlined
            hint="Enter user IDs separated by commas (e.g., id1,id2,id3)"
            :disable="loading"
            @update:model-value="onMemberInputChange"
          />

          <!-- Optional: Show parsed member count -->
          <div v-if="formData.memberIds.length > 0" class="text-caption text-grey">
            {{ formData.memberIds.length }} member(s) added
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pr-md q-pb-md">
        <q-btn
          label="Cancel"
          color="grey"
          flat
          @click="onCancel"
          :disable="loading"
        />
        <q-btn
          label="Create Group"
          color="primary"
          @click="onSubmit"
          :loading="loading"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import ConversationsService from '../services/conversations.service.js'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  channelId: { type: String, default: null } // Optional: if creating within a channel
})

const emit = defineEmits(['update:modelValue', 'success'])

const $q = useQuasar()
const dialogVisible = ref(false)
const loading = ref(false)
const memberInput = ref('')
const formData = ref({
  type: 'group',
  title: '',
  description: '',
  memberIds: [],
  channelId: props.channelId || undefined
})
const formRef = ref('')

// Sync v-model
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val
    if (val) {
      // Reset form
      formData.value = {
        type: 'group',
        title: '',
        description: '',
        memberIds: [],
        channelId: props.channelId || undefined
      }
      memberInput.value = ''
      loading.value = false
    }
  },
  { immediate: true }
)

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

// Parse member input on change
function onMemberInputChange(value) {
  if (!value) {
    formData.value.memberIds = []
    return
  }
  const ids = value
    .split(',')
    .map(id => id.trim())
    .filter(id => id && /^[a-fA-F0-9]{24}$/.test(id)) // Basic ObjectId validation
  formData.value.memberIds = [...new Set(ids)] // Remove duplicates
}

async function onSubmit() {
  const isValid = await formRef.value?.validate()
  if (!isValid) return

  if (!formData.value.title.trim()) {
    $q.notify({ color: 'negative', message: 'Title is required' })
    return
  }

  // Ensure at least one member (excluding creator — backend adds creator automatically)
  // But frontend can allow empty; backend will add creator anyway
  loading.value = true

  try {
    const payload = {
      type: 'group',
      title: formData.value.title.trim(),
      description: formData.value.description.trim()
    }

    if (formData.value.memberIds.length > 0) {
      payload.memberIds = formData.value.memberIds
    }

    if (props.channelId) {
      payload.channelId = props.channelId
    }

    const conversation = await ConversationsService.createConversation(payload)

    $q.notify({
      color: 'positive',
      icon: 'check',
      message: 'Group conversation created!'
    })

    emit('success', conversation)
    dialogVisible.value = false
  } catch (error) {
    console.error('Create conversation failed:', error)
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to create group conversation. Please try again.'
    $q.notify({ color: 'negative', icon: 'error', message: msg })
  } finally {
    loading.value = false
  }
}

function onCancel() {
  dialogVisible.value = false
}
</script>
