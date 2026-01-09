<template>
  <q-page class="q-px-sm">
    <!-- Header & Controls -->
    <div class="row justify-between q-px-lg q-mt-sm items-center">
      <div class="column">
        <div class="text-weight-bold text-h6">Subjects</div>
        <div>We have a variety of subjects tailored to your curriculum and levels of study.</div>
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
        />

        <!-- Level Filter -->
        <q-select
          dense
          outlined
          style="width: 150px"
          v-model="selectedLevelId"
          label="Level"
          class="text-capitalize"
          color="primary"
          :options="levelOptions"
          option-value="id"
          option-label="title"
          emit-value
          map-options
        />

        <!-- New Subject Button -->

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
        label="Search Subjects"
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
          <q-skeleton type="rect" height="180px" />
        </q-card>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="filteredSubjects.length === 0" class="text-center q-mt-xl text-grey-7 q-px-lg">
      No subjects match your filters.
    </div>

    <!-- Subject Cards -->
    <div v-else class="row q-col-gutter-md q-mx-sm q-mt-xs">
      <div
        v-for="subject in filteredSubjects"
        :key="subject.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="subject-card">
          <q-card-section>
            <div class="text-h6 q-mb-xs">{{ subject.title }}</div>
            <div class="text-body2 text-grey-8 q-mb-md">
              {{ subject.description || '—' }}
            </div>

            <div class="row q-col-gutter-sm">
              <div>
                <q-chip square class="text-caption">{{ subject.curriculumTitle || '—' }}</q-chip>
              </div>
              <div>
                <q-chip square class="text-caption">{{ subject.levelTitle || '—' }}</q-chip>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Create Subject Modal -->
    <q-dialog v-model="showCreateModal" persistent>
      <q-card style="min-width: 400px; width: 500px">
        <q-card-section>
          <div class="text-h6">Create New Subject</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="createSubject" ref="createFormRef">
            <!-- Title -->
            <q-input
              dense
              outlined
              v-model="newSubject.title"
              label="Title *"
              lazy-rules
              :rules="[(val) => !!val || 'Title is required']"
            />

            <!-- Description -->
            <q-input
              dense
              outlined
              v-model="newSubject.description"
              label="Description"
              class="q-mt-sm"
              type="textarea"
              rows="3"
            />

            <!-- Curriculum -->
            <q-select
              dense
              outlined
              v-model="newSubject.curriculumId"
              :options="allCurriculums"
              option-value="id"
              option-label="title"
              label="Curriculum *"
              lazy-rules
              :rules="[(val) => !!val || 'Curriculum is required']"
              class="q-mt-sm"
              @update:model-value="onCurriculumChange"
              emit-value
              map-optionsad
            />

            <!-- Level -->
            <q-select
              dense
              outlined
              v-model="newSubject.levelId"
              :options="modalLevelOptions"
              option-value="id"
              option-label="title"
              label="Level *"
              lazy-rules
              :disable="!newSubject.curriculumId"
              :hint="!newSubject.curriculumId ? 'Select a curriculum first' : ''"
              :rules="[(val) => !!val || 'Level is required']"
              class="q-mt-sm"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pr-md">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Create"
            color="primary"
            @click="createSubject"
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
import SubjectsService from 'src/services/subjects.service.js'
import CurriculumsService from 'src/services/curriculums.service.js'
import LevelsService from 'src/services/levels.service.js'

// === FILTERS ===
const selectedCurriculumId = ref(null)
const selectedLevelId = ref(null)
const searchText = ref('')

// === DATA ===
const subjects = ref([])
const allCurriculums = ref([])
const allLevels = ref([])
const loading = ref(true)

// === MODAL ===
const showCreateModal = ref(false)
const newSubject = ref({
  title: '',
  description: '',
  curriculumId: null,
  levelId: null,
})
const creating = ref(false)
const createFormRef = ref(null)

// === COMPUTED: Filters ===
const curriculumOptions = computed(() => {
  return [{ id: null, title: 'All' }, ...allCurriculums.value]
})

const levelOptions = computed(() => {
  if (!selectedCurriculumId.value) {
    return [{ id: null, title: 'All' }, ...allLevels.value]
  }
  const filtered = allLevels.value.filter(
    (level) => level.curriculumId === selectedCurriculumId.value,
  )
  return [{ id: null, title: 'All' }, ...filtered]
})

// === COMPUTED: Modal Levels ===
const modalLevelOptions = computed(() => {
  console.log('🔍 modal: selected curriculumId =', newSubject.value.curriculumId)
  console.log('🔍 modal: total levels =', allLevels.value.length)

  if (!newSubject.value.curriculumId) {
    console.log('→ returning ALL levels (no curriculum selected)')
    return allLevels.value
  }

  const matched = allLevels.value.filter((level) => {
    const match = level.curriculumId === newSubject.value.curriculumId
    if (match) {
      console.log('✅ Match found:', level.title, 'for curriculum', newSubject.value.curriculumId)
    }
    return match
  })

  console.log('→ matched levels count:', matched.length)
  return matched
})

// === COMPUTED: Enriched Subjects ===
const curriculumMap = computed(() => {
  const map = {}
  allCurriculums.value.forEach((c) => {
    map[c.id] = c.title
  })
  return map
})

const levelMap = computed(() => {
  const map = {}
  allLevels.value.forEach((l) => {
    map[l.id] = l.title
  })
  return map
})

const enrichedSubjects = computed(() => {
  return subjects.value.map((subj) => ({
    ...subj,
    id: subj.id || subj.id,
    curriculumTitle: curriculumMap.value[subj.curriculumId] || '—',
    levelTitle: levelMap.value[subj.levelId] || '—',
  }))
})

const filteredSubjects = computed(() => {
  let list = enrichedSubjects.value

  if (selectedCurriculumId.value) {
    list = list.filter((s) => s.curriculumId === selectedCurriculumId.value)
  }
  if (selectedLevelId.value) {
    list = list.filter((s) => s.levelId === selectedLevelId.value)
  }
  if (searchText.value.trim()) {
    const term = searchText.value.toLowerCase().trim()
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        (s.description && s.description.toLowerCase().includes(term)),
    )
  }
  return list
})

// === WATCHERS ===
watch(selectedCurriculumId, () => {
  selectedLevelId.value = null
})

watch(showCreateModal, (isOpen) => {
  if (!isOpen) {
    newSubject.value = { title: '', description: '', curriculumId: null, levelId: null }
    creating.value = false
    createFormRef.value?.resetValidation()
  }
})

// === METHODS ===
function onCurriculumChange() {
  newSubject.value.levelId = null
}


async function createSubject() {
  const $q = useQuasar()
  const valid = await createFormRef.value?.validate()
  if (!valid) return

  creating.value = true
  try {
    const payload = {
      title: newSubject.value.title.trim(),
      description: newSubject.value.description?.trim() || '',
      curriculumId: newSubject.value.curriculumId,
      levelId: newSubject.value.levelId.id,
    }

    const created = await SubjectsService.createSubject(payload)
    subjects.value.push(created)

    $q.notify({ color: 'positive', message: 'Subject created successfully!' })
    showCreateModal.value = false
  } catch (error) {
    console.error('Create subject error:', error)
    $q.notify({ color: 'negative', message: 'Failed to create subject. Please try again.' })
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
    const levelsData = await LevelsService.list()
    console.log('✅ RAW LEVELS FROM API:', levelsData)

    // Also check one subject to confirm linkage
    const subjectsData = await SubjectsService.list()
    console.log('✅ SAMPLE SUBJECT:', subjectsData[0])

    const curriculumsData = await CurriculumsService.list()

    subjects.value = subjectsData
    allCurriculums.value = curriculumsData
    allLevels.value = levelsData
  } catch (error) {
    console.error('Failed to load ', error)
  } finally {
    loading.value = false
  }
}
</script>
