<template>
  <q-page class="q-px-sm">
    <!-- Header & Controls -->
    <div class="row justify-between q-px-lg q-mt-sm items-center">
      <div class="column">
        <div class="text-weight-bold text-h6">Curriculums</div>
        <div>Manage educational curriculums used across subjects and levels.</div>
      </div>
      <div class="row q-gutter-md items-center">
        <q-input
          dense
          outlined
          v-model="searchText"
          label="Search Curriculums"
          style="width: 250px"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          :disable="loading"
          class="text-capitalize"
          color="primary"
          @click="openCreateModal"
          icon="add"
          label="New Curriculum"
        />
      </div>
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
    <div
      v-else-if="filteredCurriculums.length === 0"
      class="text-center q-mt-xl text-grey-7 q-px-lg"
    >
      No curriculums match your search.
    </div>

    <!-- Curriculum Cards -->
    <div v-else class="row q-col-gutter-md q-mx-sm q-mt-xs">
      <div
        v-for="curriculum in filteredCurriculums"
        :key="curriculum.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="curriculum-card">
          <q-card-section>
            <div class="text-h6 q-mb-xs">{{ curriculum.title }}</div>
            <div class="text-body2 q-mb-sm">
              {{ curriculum.description || '—' }}
            </div>
            <div class="text-caption">
              {{ curriculum.country ? `${curriculum.country} (${curriculum.country_code})` : '—' }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Create Curriculum Modal -->
    <q-dialog v-model="showCreateModal" persistent>
      <q-card style="min-width: 400px; width: 500px">
        <q-card-section>
          <div class="text-h6">Create New Curriculum</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="createCurriculum" ref="createFormRef">
            <q-input
              dense
              outlined
              v-model="newCurriculum.title"
              label="Title *"
              lazy-rules
              :rules="[(val) => !!val || 'Title is required']"
            />

            <q-input
              dense
              outlined
              v-model="newCurriculum.description"
              label="Description"
              class="q-mt-sm"
              type="textarea"
              rows="2"
            />

            <q-input
              dense
              outlined
              v-model="newCurriculum.country"
              label="Country"
              class="q-mt-sm"
            />

            <q-input
              dense
              outlined
              v-model="newCurriculum.country_code"
              label="Country Code (e.g. mw)"
              class="q-mt-sm"
              hint="2-letter ISO code"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pr-md">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Create"
            color="primary"
            @click="createCurriculum"
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
import CurriculumsService from 'src/services/curriculums.service.js'

// === DATA ===
const curriculums = ref([])
const loading = ref(true)
const searchText = ref('')

// === MODAL ===
const showCreateModal = ref(false)
const newCurriculum = ref({
  title: '',
  description: '',
  country: '',
  country_code: '',
})
const creating = ref(false)
const createFormRef = ref(null)

// === COMPUTED: Filtered list ===
const filteredCurriculums = computed(() => {
  let list = curriculums.value
  if (searchText.value.trim()) {
    const term = searchText.value.toLowerCase().trim()
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term)) ||
        (c.country && c.country.toLowerCase().includes(term)),
    )
  }
  return list
})

// === WATCHERS ===
watch(showCreateModal, (isOpen) => {
  if (!isOpen) {
    newCurriculum.value = { title: '', description: '', country: '', country_code: '' }
    creating.value = false
    createFormRef.value?.resetValidation()
  }
})

// === METHODS ===
function openCreateModal() {
  showCreateModal.value = true
}

async function createCurriculum() {
  const $q = useQuasar()
  const valid = await createFormRef.value?.validate()
  if (!valid) return

  creating.value = true
  try {
    const payload = {
      title: newCurriculum.value.title.trim(),
      description: newCurriculum.value.description?.trim() || '',
      country: newCurriculum.value.country?.trim() || '',
      country_code: newCurriculum.value.country_code?.trim().toLowerCase() || '',
    }

    const created = await CurriculumsService.createCurriculum(payload) // ❌ TYPO!
    curriculums.value.push(created)

    $q.notify({ color: 'positive', message: 'Curriculum created successfully!' })
    showCreateModal.value = false
  } catch (error) {
    console.error('Create curriculum error:', error)
    $q.notify({ color: 'negative', message: 'Failed to create curriculum.' })
  } finally {
    creating.value = false
  }
}

// === INIT ===
onMounted(() => {
  loadCurriculums()
})

async function loadCurriculums() {
  loading.value = true
  try {
    const data = await CurriculumsService.list()
    curriculums.value = data.map((item) => ({
      ...item,
      id: item.id || item._id, // safe fallback
    }))
  } catch (error) {
    console.error('Failed to load curriculums:', error)
    useQuasar().notify({ color: 'negative', message: 'Failed to load curriculums.' })
  } finally {
    loading.value = false
  }
}
</script>
