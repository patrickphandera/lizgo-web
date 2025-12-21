<template>
  <q-list>
    <q-item clickable @click="modal = true">
      <q-item-section avatar>
        <q-icon name="add" />
      </q-item-section>

      <q-item-section>
        <q-item-label>Add Lessons</q-item-label>
      </q-item-section>
    </q-item>

    <q-dialog v-model="modal" persistent>
      <q-card style="width: 900px; max-width: 95vw">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Add Lesson</div>
          <q-btn flat icon="close" @click="modal = false" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- STEP 1 -->
          <div v-if="step === 1">
            <q-input dense v-model="lesson.name" label="Lesson Name" outlined class="q-mb-md" />
            <q-input dense autogrow v-model="lesson.description" label="Description" outlined type="textarea"
              class="q-mb-md" />
            <q-input type="file" dense v-model="lesson.thumbnail" label="Thumbnail" outlined class="q-mb-md" />

            <div class="row">
              <div class="col-6">
                <q-select dense v-model="lesson.curriculum" :options="curriculums" emit-value map-options
                  label="Curriculum" outlined class="q-mb-md q-pr-md" />
              </div>
              <div class="col-6">
                <q-select dense v-model="lesson.level" :options="levels" emit-value map-options label="Level" outlined
                  class="q-mb-md" :disable="!lesson.curriculum" />
              </div>
            </div>

            <div class="row q-mb-md">
              <div class="col-6">
                <q-select dense v-model="lesson.subject" :options="subjects" emit-value map-options label="Subject"
                  outlined class="q-mb-md q-pr-md" :disable="!lesson.level" />
              </div>

              <div class="col-6">
                <q-select dense v-model="isTopic" :options="['Topic', 'Book']" outlined label="Topic or Book" />
              </div>

              <div class="col-6" v-if="isTopic === 'Topic'">
                <q-select dense v-model="lesson.topic_or_book" :options="topics" emit-value map-options
                  label="Topic name" outlined class="q-mb-md q-pr-md" :disable="!lesson.subject" />
              </div>

              <div class="col-6" v-if="isTopic === 'Book'">
                <q-input dense v-model="lesson.topic_or_book" label="Book name" outlined class="q-mb-md" />
              </div>

              <div class="col-6">
                <q-input :rules="[val => val > 0 || 'At least 1 section required']" dense v-model.number="totalSections"
                  type="number" min="1" label="Number of Sections" outlined />
              </div>
            </div>
          </div>

          <!-- STEP 2 -->
          <div v-if="step === 2 && currentSection">
            <div class="text-subtitle1 q-mb-md">
              Section {{ currentSectionIndex + 1 }} of {{ lesson.sections.length }}
            </div>

            <q-input dense v-model="currentSection.name" label="Section Name" outlined class="q-mb-sm" />
            <q-input dense autogrow v-model="currentSection.description" label="Section Description" outlined
              type="textarea" class="q-mb-md" />

            <div class="row">
              <div class="col-6">
                <q-select dense v-model="currentSection.type" :options="sectionTypes" label="Section Type" outlined
                  class="q-mb-md q-pr-md" />
              </div>
              <div class="col-6">
                <q-select dense v-model="currentSection.access" :options="accessOptions" label="Access" outlined
                  class="q-mb-md" />
              </div>
            </div>

            <q-toggle v-model="currentSection.required" label="Required" />

            <div v-if="currentSection.type === 'video'" class="q-mt-md">
              <q-file dense v-model="currentSection.content.video_url" label="Video" outlined />
              <q-input dense v-model.number="currentSection.content.duration" label="Duration (seconds)" outlined />
            </div>

            <div v-if="currentSection.type === 'document'" class="q-mt-md">
              <q-file dense v-model="currentSection.content.document_url" label="Document" outlined />
            </div>

            <div v-if="currentSection.type === 'question'" class="q-mt-md">
              <q-btn label="Add Question" color="primary" outline @click="addQuestion" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between">
          <q-btn flat label="Back" :disable="step === 1" @click="prevStep" />
          <q-btn color="primary" :label="step === 1 ? 'Next' : isLastSection ? 'Submit Lesson' : 'Next Section'"
            @click="nextStep" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-list>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import SubjectsService from '../services/subjects.service'
import CurriculumsService from '../services/curriculums.service'
import TopicsService from '../services/topics.service'
import LevelsService from '../services/levels.service'

const modal = ref(false)
const step = ref(1)
const totalSections = ref(1)
const currentSectionIndex = ref(0)
const isTopic = ref('Topic')

const lesson = ref({
  id: `lesson_${Date.now()}`,
  name: '',
  description: '',
  thumbnail: '',
  teacher_id: 'teacher_001',
  curriculum: '',
  level: '',
  subject: '',
  topic_or_book: '',
  sections: []
})

/* RAW DATA */
const allCurriculums = ref([])
const allLevels = ref([])
const allSubjects = ref([])
const allTopics = ref([])

/* FILTERED OPTIONS */
const curriculums = ref([])
const levels = ref([])
const subjects = ref([])
const topics = ref([])

const sectionTypes = ['video', 'document', 'question']
const accessOptions = ['free', 'premium']

const currentSection = computed(() => lesson.value.sections[currentSectionIndex.value] || null)
const isLastSection = computed(() => currentSectionIndex.value === lesson.value.sections.length - 1)

onMounted(loadMetaData)

/* LOAD DATA */
async function loadMetaData() {
  const [subjectsRes, curriculumsRes, topicsRes, levelsRes] = await Promise.all([
    SubjectsService.getAll(),
    CurriculumsService.getAll(),
    TopicsService.getAll(),
    LevelsService.getAll()
  ])

  allCurriculums.value = curriculumsRes
  allLevels.value = levelsRes
  allSubjects.value = subjectsRes
  allTopics.value = topicsRes

  curriculums.value = mapToOptions(allCurriculums.value)
}

watch(
  () => currentSection.value?.type,
  () => {
    if (!currentSection.value) return

    currentSection.value.content = {
      video_url: '',
      duration: 0,
      document_url: '',
      questions: []
    }
  }
)

/* WATCHERS */
watch(() => lesson.value.curriculum, id => {
  lesson.value.level = ''
  lesson.value.subject = ''
  lesson.value.topic_or_book = ''

  levels.value = mapToOptions(allLevels.value.filter(l => l.curriculumId === id))
})


watch(() => lesson.value.level, id => {
  lesson.value.subject = ''
  lesson.value.topic_or_book = ''

  subjects.value = mapToOptions(
    allSubjects.value.filter(s => s.levelId === id)
  )
})

watch(() => lesson.value.subject, id => {
  lesson.value.topic_or_book = ''

  topics.value = mapToOptions(
    allTopics.value.filter(t => t.subjectId === id)
  )
})

/* HELPERS */
function mapToOptions(items = []) {
  return items.map(i => ({ label: i.title, value: i.id }))
}

function createSections() {
  lesson.value.sections = Array.from({ length: totalSections.value }, (_, i) => ({
    id: `section_${i + 1}`,
    name: '',
    description: '',
    type: 'video',
    access: 'free',
    required: true,
    content: {}
  }))
}

function nextStep() {
  if (step.value === 1) {
    createSections()
    step.value = 2
  } else if (!isLastSection.value) {
    currentSectionIndex.value++
  } else {
    submitLesson()
  }
}

function prevStep() {
  if (step.value === 2 && currentSectionIndex.value > 0) {
    currentSectionIndex.value--
  } else {
    step.value = 1
  }
}

function addQuestion() {
  currentSection.value.content.questions.push({
    question: '',
    options: ['', '', '', ''],
    correct_option: 0
  })
}
function resetForm() {
  step.value = 1
  currentSectionIndex.value = 0
  totalSections.value = 1
  isTopic.value = 'Topic'

  lesson.value = {
    id: `lesson_${Date.now()}`,
    name: '',
    description: '',
    thumbnail: null,
    teacher_id: 'teacher_001',
    curriculum: '',
    level: '',
    subject: '',
    topic_or_book: '',
    sections: []
  }
}
watch(modal, (val) => {
  if (!val) resetForm()
})
watch(isTopic, () => {
  lesson.value.topic_or_book = ''
})


function submitLesson() {
  console.log('FINAL LESSON:', lesson.value)
  modal.value = false
}
</script>
