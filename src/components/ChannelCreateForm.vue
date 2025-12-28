<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="formData.title"
      label="Channel Title *"
      dense
      outlined
      :rules="[val => !!val || 'Title is required']"
    />

    <q-input
      v-model="formData.description"
      label="Description"
      dense
      outlined
      type="textarea"
    />
  <!-- <q-input
      v-model="formData.description"
      label="Search Members (comma-separated User IDs)"
      dense
      outlined
    /> -->

<!-- <q-chip>Patrick Phandera</q-chip> -->
    <q-select
      v-model="formData.subjects"
      label="Subjects"
      multiple
      dense
      outlined
      :options="subjectOptions"
    />

    <div class="flex justify-end q-gutter-sm">
      <q-btn
        label="Cancel"
        color="grey"
        flat
        class="text-capitalize"
        @click="$emit('cancel')"
      />
      <q-btn
        label="Create Channel"
        type="submit"
        class="text-capitalize"
        color="primary"
        :loading="loading"
        :disable="loading"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import ChannelsService from '../services/channels.service.js'

// const props = defineProps({
//   // Optional: prefill data (e.g., for editing)
//   // Not used here since it's create-only
// })

const emit = defineEmits(['success', 'cancel'])

const $q = useQuasar()
const formData = ref({
  title: '',
  description: '',
  // subjects: [] // Uncomment if you add subject selection
})
const loading = ref(false)

async function onSubmit() {
  loading.value = true

  try {
    const newChannel = await ChannelsService.create(formData.value)
    $q.notify({
      color: 'positive',
      message: 'Channel created successfully!',
      icon: 'check'
    })
    emit('success', newChannel)
  } catch (error) {
    console.log('Failed to create channel:', error.message)
    const message = error?.message || 'Failed to create channel. Please try again.'
    $q.notify({
      color: 'negative',
      message,
      icon: 'warning'
    })
  } finally {
    loading.value = false
  }
}
</script>
