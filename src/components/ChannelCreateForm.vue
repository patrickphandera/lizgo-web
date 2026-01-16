<template>
  <q-form @submit="onSubmit" class="q-gutter-md">

    <q-input
      v-model="formData.title"
      label="Channel Title *"
      dense
      outlined
      :rules="[val => !!val || 'Title is required']"
    />

    <!-- Curriculum Select -->
    <q-select
      v-model="formData.curriculumId"
      :options="curriculums"
      option-value="_id"
      option-label="title"
      label="Curriculum *"
      dense
      outlined
      emit-value
      map-options
      :rules="[val => !!val || 'Curriculum is required']"
      @update:model-value="onCurriculumChange"
    />

    <!-- Level Select (depends on curriculum) -->
    <q-select
      v-model="formData.levelId"
      :options="filteredLevels"
      option-value="_id"
      option-label="title"
      label="Level *"
      dense
      outlined
      emit-value
      map-options
      :loading="loadingLevels"
      :disable="!formData.curriculumId"
      :rules="[val => !!val || 'Level is required']"
    />

    <q-input
      v-model="formData.description"
      label="Description *"
      dense
      outlined
      type="textarea"
      :rules="[val => !!val || 'Description is required']"
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
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ChannelsService from '../services/channels.service.js'
import CurriculumsService from '../services/curriculums.service.js'
import LevelsService from '../services/levels.service.js'

const emit = defineEmits(['success', 'cancel'])
const $q = useQuasar()

const formData = ref({
  title: '',
  curriculumId: null,
  levelId: null,
  description: ''
})

const curriculums = ref([])
const allLevels = ref([]) // store all levels once fetched
const loadingLevels = ref(false)
const loading = ref(false)

// Computed: filter levels by selected curriculum
const filteredLevels = ref([])

function onCurriculumChange(curriculumId) {
  formData.value.levelId = null // reset level when curriculum changes
  if (!curriculumId) {
    filteredLevels.value = []
    return
  }

  loadingLevels.value = true
  // Filter client-side if you already have all levels
  // Or fetch from API: /levels?curriculumId=...
  // Here we assume you fetched all levels upfront (efficient if dataset is small)
  filteredLevels.value = allLevels.value.filter(

    level => {
      console.log(level.curriculumId )
      return level.curriculumId == curriculumId.id
    }

  )
  loadingLevels.value = false
}

async function loadCurriculums() {
  try {
    const res = await CurriculumsService.getAll()
    curriculums.value = res.data || res
  } catch (err) {
    console.error('Failed to load curriculums:', err)
    $q.notify({ color: 'negative', message: 'Could not load curriculums.', icon: 'warning' })
  }
}

async function loadLevels() {
  try {
    const levelsArray = await LevelsService.getAll() // returns array directly
    allLevels.value = Array.isArray(levelsArray) ? levelsArray : []
    console.log('Loaded levels:', allLevels.value) // optional debug
  } catch (err) {
    console.error('Failed to load levels:', err)
    $q.notify({ color: 'negative', message: 'Could not load levels.' })
  }
}

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
    console.error('Failed to create channel:', error)
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to create channel. Please try again.'
    $q.notify({ color: 'negative', message, icon: 'warning' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  Promise.all([
    loadCurriculums(),
    loadLevels()
  ])
})
</script>
