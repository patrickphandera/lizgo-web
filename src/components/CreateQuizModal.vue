<template>
  <q-list>
    <q-item clickable @click="modal = true">
      <q-item-section avatar>
        <q-icon name="quiz" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Create Quiz</q-item-label>
      </q-item-section>
    </q-item>

    <q-dialog v-model="modal" persistent>
      <q-card style="width: 900px; max-width: 95vw">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Create New Quiz</div>
          <q-btn flat icon="close" @click="modal = false" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- STEP 1: Metadata -->
          <div v-if="step === 1">
            <q-input dense v-model="quiz.title" label="Quiz Title *" outlined class="q-mb-md" />
            <q-input dense autogrow v-model="quiz.description" label="Description (Optional)" outlined type="textarea" class="q-mb-md" />

            <div class="row q-mb-md">
              <div class="col-6">
                <q-input dense v-model.number="quiz.minutes" type="number" min="1" label="Duration (minutes) *" outlined />
              </div>
              <div class="col-6">
                <q-select
                  dense
                  v-model="quiz.level"
                  :options="levels"
                  emit-value
                  map-options
                  label="Level *"
                  outlined
                  :disable="!quiz.curriculum"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <q-select
                  dense
                  v-model="quiz.curriculum"
                  :options="curriculums"
                  emit-value
                  map-options
                  label="Curriculum *"
                  outlined
                  class="q-mb-md q-pr-md"
                />
              </div>
              <div class="col-6">
                <q-select
                  dense
                  v-model="quiz.subject"
                  :options="subjects"
                  emit-value
                  map-options
                  label="Subject *"
                  outlined
                  class="q-mb-md"
                  :disable="!quiz.level"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <q-select
                  dense
                  v-model="quiz.topic"
                  :options="topics"
                  emit-value
                  map-options
                  label="Topic *"
                  outlined
                  :disable="!quiz.subject"
                />
              </div>
            </div>
          </div>

          <!-- STEP 2: Questions -->
          <div v-if="step === 2">
            <div v-for="(question, qIndex) in quiz.questions" :key="qIndex" class="q-mb-lg q-pa-md" style="border: 1px solid #e0e0e0; border-radius: 4px;">
              <div class="row items-center justify-between q-mb-md">
                <div class="text-subtitle2">Question {{ qIndex + 1 }}</div>
                <q-btn
                  flat
                  dense
                  icon="delete"
                  color="negative"
                  size="sm"
                  @click="removeQuestion(qIndex)"
                  :disable="quiz.questions.length === 1"
                />
              </div>

              <q-input v-model="question.title" label="Question *" outlined dense class="q-mb-md" />

              <q-select
                v-model="question.type"
                :options="questionTypes"
                label="Question Type *"
                outlined
                dense
                class="q-mb-md"
              />

              <!-- MULTIPLE CHOICE -->
              <div v-if="question.type === 'multiple-choice'" class="q-mb-md">
                <div class="text-caption q-mb-xs">Options (min 2)</div>
                <q-input
                  v-for="(opt, i) in question.options"
                  :key="i"
                  v-model="question.options[i]"
                  :label="`Option ${i + 1}`"
                  outlined
                  dense
                  class="q-mb-sm"
                />
                <q-input
                  v-model.number="question.correctOptionIndexes[0]"
                  label="Correct Option Index (0-based)"
                  type="number"
                  outlined
                  dense
                  min="0"
                  :max="question.options.length - 1"
                  class="q-mb-md"
                />
              </div>

              <!-- STRUCTURED -->
              <div v-if="question.type === 'structured'" class="q-mb-md">
                <q-input
                  v-model="question.correctAnswer"
                  label="Correct Answer *"
                  outlined
                  dense
                  autogrow
                  type="textarea"
                  class="q-mb-md"
                />
              </div>

              <q-input
                v-model="question.gradingNote"
                label="Grading Note (Optional)"
                outlined
                dense
                autogrow
                type="textarea"
              />
            </div>

            <q-btn
              color="primary"
              icon="add"
              no-caps
              label="Add Question"
              @click="addQuestion"
              class="full-width"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between">
          <q-btn flat label="Back" :disable="step === 1" @click="prevStep" />
          <q-btn
            color="primary"
            :label="step === 1 ? 'Next' : 'Create Quiz'"
            :disable="!canProceed"
            :loading="isSubmitting"
            @click="nextStep"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-list>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import CurriculumsService from '../services/curriculums.service'
import LevelsService from '../services/levels.service'
import SubjectsService from '../services/subjects.service'
import TopicsService from '../services/topics.service'
import QuizzesService from '../services/quizzes.service'

// === STATE ===
const modal = ref(false)
const step = ref(1)
const isSubmitting = ref(false)

const quiz = ref({
  title: '',
  description: '',
  minutes: 10,
  curriculum: '',
  level: '',
  subject: '',
  topic: '',
  questions: [createEmptyQuestion()],
  creator: 'teacher_001' // TODO: Replace with real auth ID
})

// === RAW DATA ===
const allCurriculums = ref([])
const allLevels = ref([])
const allSubjects = ref([])
const allTopics = ref([])

// === FILTERED OPTIONS ===
const curriculums = ref([])
const levels = ref([])
const subjects = ref([])
const topics = ref([])

const questionTypes = ['multiple-choice', 'structured']

// === COMPUTED ===
const canProceed = computed(() => {
  if (step.value === 1) {
    return (
      quiz.value.title.trim() &&
      quiz.value.minutes > 0 &&
      quiz.value.curriculum &&
      quiz.value.level &&
      quiz.value.subject &&
      quiz.value.topic
    )
  }

  if (step.value === 2) {
    return quiz.value.questions.length > 0 && quiz.value.questions.every(q => {
      if (!q.title?.trim()) return false

      if (q.type === 'multiple-choice') {
        const validOptions = q.options && q.options.length >= 2 && q.options.every(opt => opt.trim() !== '')
        const validIndex = q.correctOptionIndexes?.[0] != null &&
          q.correctOptionIndexes[0] >= 0 &&
          q.correctOptionIndexes[0] < (q.options?.length || 0)
        return validOptions && validIndex
      }

      if (q.type === 'structured') {
        return q.correctAnswer?.trim() !== ''
      }

      return false
    })
  }

  return false
})

// === LIFECYCLE ===
onMounted(loadMetaData)

// === LOAD DATA ===
async function loadMetaData() {
  const [curriculumsRes, levelsRes, subjectsRes, topicsRes] = await Promise.all([
    CurriculumsService.getAll(),
    LevelsService.getAll(),
    SubjectsService.getAll(),
    TopicsService.getAll()
  ])

  allCurriculums.value = curriculumsRes
  allLevels.value = levelsRes
  allSubjects.value = subjectsRes
  allTopics.value = topicsRes

  curriculums.value = mapToOptions(allCurriculums.value)
}

// === WATCHERS ===
watch(() => quiz.value.curriculum, (id) => {
  if (!id) {
    quiz.value.level = ''
    quiz.value.subject = ''
    quiz.value.topic = ''
    levels.value = []
    subjects.value = []
    topics.value = []
    return
  }
  levels.value = mapToOptions(allLevels.value.filter(l => l.curriculumId === id))
})

watch(() => quiz.value.level, (id) => {
  if (!id) {
    quiz.value.subject = ''
    quiz.value.topic = ''
    subjects.value = []
    topics.value = []
    return
  }
  subjects.value = mapToOptions(allSubjects.value.filter(s => s.levelId === id))
})

watch(() => quiz.value.subject, (id) => {
  if (!id) {
    quiz.value.topic = ''
    topics.value = []
    return
  }
  topics.value = mapToOptions(allTopics.value.filter(t => t.subjectId === id))
})

watch(modal, (open) => {
  if (!open) resetForm()
})

// === HELPERS ===
function mapToOptions(items = []) {
  return items.map(i => ({ label: i.title || i.name, value: i.id || i._id }))
}

function createEmptyQuestion() {
  return {
    title: '',
    type: 'multiple-choice',
    options: ['', '','',''],
    correctOptionIndexes: [1],
    correctAnswer: '',
    gradingNote: ''
  }
}

function addQuestion() {
  quiz.value.questions.push(createEmptyQuestion())
}

function removeQuestion(index) {
  if (quiz.value.questions.length > 1) {
    quiz.value.questions.splice(index, 1)
  }
}

function prevStep() {
  step.value = 1
}

function nextStep() {
  if (step.value === 1) {
    step.value = 2
    return
  }

  submitQuiz()
}

function resetForm() {
  step.value = 1
  quiz.value = {
    title: '',
    description: '',
    minutes: 10,
    curriculum: '',
    level: '',
    subject: '',
    topic: '',
    questions: [createEmptyQuestion()],
  }
}

// === SUBMIT ===
async function submitQuiz() {
  try {
    isSubmitting.value = true

    // Prepare payload matching CreateQuizDto
    const payload = {
      title: quiz.value.title,
      description: quiz.value.description || undefined,
      minutes: quiz.value.minutes,
      level: quiz.value.level,
      subjectId: quiz.value.subject,
      topicId: quiz.value.topic,
      curriculumId: quiz.value.curriculum,
      creator: quiz.value.creator,
      questions: quiz.value.questions.map(q => {
        const base = {
          title: q.title,
          type: q.type,
          gradingNote: q.gradingNote || undefined
        }

        if (q.type === 'multiple-choice') {
          return {
            ...base,
            options: q.options.filter(opt => opt.trim() !== ''),
            correctOptionIndexes: [q.correctOptionIndexes[0]]
          }
        } else {
          return {
            ...base,
            correctAnswer: q.correctAnswer
          }
        }
      })
    }

    await QuizzesService.create(payload)
    modal.value = false
    // TODO: Show success notification
  } catch (error) {
    console.error('Failed to create quiz:', error)
    // TODO: Show error notification
  } finally {
    isSubmitting.value = false
  }
}
</script>
