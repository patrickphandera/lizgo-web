<template>
  <q-page class="q-px-sm">
    <!-- Header & Controls -->
    <div class="row justify-between q-px-lg q-mt-sm items-center">
      <div class="column">
        <div class="text-weight-bold text-h6">Levels</div>
        <div>Manage educational levels (e.g., Grade 10, Form 3) within curriculums.</div>
      </div>
      <div class="row q-gutter-md items-center">
        <!-- Curriculum Filter -->
        <q-select
          dense
          outlined
          style="width: 200px"
          v-model="selectedCurriculumId"
          label="Curriculum"
          class="text-capitalize"
          color="primary"
          :options="curriculumOptions"
          option-value="id"
          option-label="title"
          emit-value
          map-options
          clearable
        />

      </div>
    </div>

    <!-- Search -->
    <div class="q-px-lg q-mt-md">
      <q-input
        class="thick-border"
        dense
        color="primary"
        outlined
        v-model="searchText"
        label="Search Levels"
        style="width: 100%"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="row q-col-gutter-md q-mx-md q-mt-lg">
      <div v-for="i in 6" :key="'skeleton-' + i" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="q-pa-md">
          <q-skeleton type="rect" height="160px" />
        </q-card>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="filteredLevels.length === 0" class="text-center q-mt-xl text-grey-7 q-px-lg">
      No levels match your filters.
    </div>

    <!-- Level Cards -->
    <div v-else class="row q-col-gutter-md q-mx-sm q-mt-xs">
      <div
        v-for="level in filteredLevels"
        :key="level.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="level-card">
          <q-card-section>
            <div class="text-h6 q-mb-xs">{{ level.title }}</div>
            <div class="text-body2 q-mb-sm">
              {{ level.description || '—' }}
            </div>
            <div class="text-caption">
              <q-chip square class="text-caption">{{
                curriculumMap[level.curriculumId] || '—'
              }}</q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Create Level Modal -->
    <q-dialog v-model="showCreateModal" persistent>
      <q-card style="min-width: 400px; width: 500px">
        <q-card-section>
          <div class="text-h6">Create New Level</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="createLevel" ref="createFormRef">
            <q-input
              dense
              outlined
              v-model="newLevel.title"
              label="Title *"
              lazy-rules
              :rules="[(val) => !!val || 'Title is required']"
            />

            <q-input
              dense
              outlined
              v-model="newLevel.description"
              label="Description"
              class="q-mt-sm"
              type="textarea"
              rows="2"
            />

            <!-- Curriculum (required for level) -->
            <q-select
              dense
              outlined
              v-model="newLevel.curriculumId"
              :options="allCurriculums"
              option-value="id"
              option-label="title"
              label="Curriculum *"
              lazy-rules
              :rules="[(val) => !!val || 'Curriculum is required']"
              class="q-mt-sm"
              emit-value
              map-options
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pr-md">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Create"
            color="primary"
            @click="createLevel"
            :loading="creating"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import LevelsService from 'src/services/levels.service.js'
import CurriculumsService from 'src/services/curriculums.service.js'

// === FILTERS ===
const selectedCurriculumId = ref(null)
const searchText = ref('')

// === DATA ===
const levels = ref([])
const allCurriculums = ref([])
const loading = ref(true)

// === MODAL ===
const showCreateModal = ref(false)
const newLevel = ref({
  title: '',
  description: '',
  curriculumId: null,
})
const creating = ref(false)
const createFormRef = ref(null)

// === COMPUTED: Curriculum options for filter ===
const curriculumOptions = computed(() => {
  return [{ id: null, title: 'All' }, ...allCurriculums.value]
})

// === COMPUTED: Curriculum lookup map ===
const curriculumMap = computed(() => {
  const map = {}
  allCurriculums.value.forEach((c) => {
    map[c.id] = c.title
  })
  return map
})

// === COMPUTED: Filtered levels ===
const filteredLevels = computed(() => {
  let list = levels.value

  // Filter by curriculum
  if (selectedCurriculumId.value) {
    list = list.filter((l) => l.curriculumId === selectedCurriculumId.value)
  }

  // Search
  if (searchText.value.trim()) {
    const term = searchText.value.toLowerCase().trim()
    list = list.filter(
      (l) =>
        l.title.toLowerCase().includes(term) ||
        (l.description && l.description.toLowerCase().includes(term)),
    )
  }

  return list
})

// === WATCHERS ===
watch(showCreateModal, (isOpen) => {
  if (!isOpen) {
    newLevel.value = { title: '', description: '', curriculumId: null }
    creating.value = false
    createFormRef.value?.resetValidation()
  }
})

// === METHODS ===


async function createLevel() {
  const $q = useQuasar()
  const valid = await createFormRef.value?.validate()
  if (!valid) return

  creating.value = true
  try {
    const payload = {
      title: newLevel.value.title.trim(),
      description: newLevel.value.description?.trim() || '',
      curriculumId: newLevel.value.curriculumId,
    }

    const created = await LevelsService.createLevel(payload)
    levels.value.push(created)

    $q.notify({ color: 'positive', message: 'Level created successfully!' })
    showCreateModal.value = false
  } catch (error) {
    console.error('Create level error:', error)
    $q.notify({ color: 'negative', message: 'Failed to create level. Please try again.' })
  } finally {
    creating.value = false
  }
}

// === INIT ===
onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const [levelsData, curriculumsData] = await Promise.all([
      LevelsService.list(),
      CurriculumsService.list(),
    ])

    levels.value = levelsData.map((item) => ({
      ...item,
      id: item.id || item._id,
    }))

    allCurriculums.value = curriculumsData.map((item) => ({
      ...item,
      id: item.id || item._id,
    }))
  } catch (error) {
    console.error('Failed to load data:', error)
    useQuasar().notify({ color: 'negative', message: 'Failed to load data.' })
  } finally {
    loading.value = false
  }
}
</script>
