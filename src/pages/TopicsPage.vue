<template>
  <q-page class="q-px-sm">
    <!-- Header & Controls -->
    <div class="row justify-between q-px-lg q-mt-sm items-center">
      <div class="column">
        <div class="text-weight-bold text-h6">Topics</div>
        <div>Manage lesson topics organized by subject.</div>
      </div>
      <div class="row q-gutter-md items-center">
        <!-- Subject Filter -->
        <q-select
          dense
          outlined
          style="width: 220px"
          v-model="selectedSubjectId"
          label="Subject"
          class="text-capitalize"
          color="primary"
          :options="subjectOptions"
          option-value="id"
          option-label="title"
          emit-value
          map-options
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
        label="Search Topics"
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
    <div v-else-if="filteredTopics.length === 0" class="text-center q-mt-xl text-grey-7 q-px-lg">
      No topics match your filters.
    </div>

    <!-- Topic Cards -->
    <div v-else class="row q-col-gutter-md q-mx-sm q-mt-xs">
      <div
        v-for="topic in filteredTopics"
        :key="topic.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="topic-card">
          <q-card-section>
            <div class="text-h6 q-mb-xs">{{ topic.title }}</div>
            <div class="text-body2 q-mb-sm">
              {{ topic.description || '—' }}
            </div>
            <q-chip square dense class="text-caption">
              {{ subjectMap[topic.subjectId] || '—' }}
            </q-chip>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Create Topic Modal -->
    <q-dialog v-model="showCreateModal" persistent>
      <q-card style="min-width: 400px; width: 500px">
        <q-card-section>
          <div class="text-h6">Create New Topic</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="createTopic" ref="createFormRef">
            <q-input
              dense
              outlined
              v-model="newTopic.title"
              label="Title *"
              lazy-rules
              :rules="[(val) => !!val || 'Title is required']"
            />

            <q-input
              dense
              outlined
              v-model="newTopic.description"
              label="Description"
              class="q-mt-sm"
              type="textarea"
              rows="3"
            />

            <!-- Subject (required) -->
            <q-select
              dense
              outlined
              v-model="newTopic.subjectId"
              :options="allSubjects"
              option-value="id"
              option-label="title"
              label="Subject *"
              lazy-rules
              :rules="[(val) => !!val || 'Subject is required']"
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
            @click="createTopic"
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
import TopicsService from '../../services/topics.service.js'
import SubjectsService from '../../services/subjects.service.js'

// === FILTERS ===
const selectedSubjectId = ref(null)
const searchText = ref('')

// === DATA ===
const topics = ref([])
const allSubjects = ref([])
const loading = ref(true)

// === MODAL ===
const showCreateModal = ref(false)
const newTopic = ref({
  title: '',
  description: '',
  subjectId: null,
})
const creating = ref(false)
const createFormRef = ref(null)

// === COMPUTED: Subject options for filter ===
const subjectOptions = computed(() => {
  return [{ id: null, title: 'All' }, ...allSubjects.value]
})

// === COMPUTED: Subject lookup map ===
const subjectMap = computed(() => {
  const map = {}
  allSubjects.value.forEach((s) => {
    map[s.id] = s.title
  })
  return map
})

// === COMPUTED: Filtered topics ===
const filteredTopics = computed(() => {
  let list = topics.value

  // Filter by subject
  if (selectedSubjectId.value) {
    list = list.filter((t) => t.subjectId === selectedSubjectId.value)
  }

  // Search by title or description
  if (searchText.value.trim()) {
    const term = searchText.value.toLowerCase().trim()
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term)),
    )
  }

  return list
})

// === WATCHERS ===
watch(showCreateModal, (isOpen) => {
  if (!isOpen) {
    newTopic.value = { title: '', description: '', subjectId: null }
    creating.value = false
    createFormRef.value?.resetValidation()
  }
})

// === METHODS ===


async function createTopic() {
  const $q = useQuasar()
  const valid = await createFormRef.value?.validate()
  if (!valid) return

  creating.value = true
  try {
    const payload = {
      title: newTopic.value.title.trim(),
      description: newTopic.value.description?.trim() || '',
      subjectId: newTopic.value.subjectId,
    }

    const created = await TopicsService.createTopic(payload)
    topics.value.push(created)

    $q.notify({ color: 'positive', message: 'Topic created successfully!' })
    showCreateModal.value = false
  } catch (error) {
    console.error('Create topic error:', error)
    $q.notify({ color: 'negative', message: 'Failed to create topic. Please try again.' })
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
    const [topicsData, subjectsData] = await Promise.all([
      TopicsService.list(),
      SubjectsService.list(),
    ])

    topics.value = topicsData.map((item) => ({
      ...item,
      id: item.id || item._id,
    }))

    allSubjects.value = subjectsData.map((item) => ({
      ...item,
      id: item.id || item._id,
    }))
  } catch (error) {
    console.error('Failed to load ', error)
    useQuasar().notify({ color: 'negative', message: 'Failed to load data.' })
  } finally {
    loading.value = false
  }
}
</script>
