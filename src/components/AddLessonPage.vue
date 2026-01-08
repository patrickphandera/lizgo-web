<template>
  <div>
    <q-btn
      @click="modal = true"
      class="text-capitalize"
      label="Add Lesson"
      icon-right="add"
    ></q-btn>

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
            <q-input dense v-model="lesson.title" label="Lesson Name" outlined class="q-mb-md" />
            <q-input
              dense
              autogrow
              v-model="lesson.description"
              label="Description"
              outlined
              type="textarea"
              class="q-mb-md"
            />
            <q-file
              dense
              v-model="lesson.thumbnail"
              label="Thumbnail"
              outlined
              class="q-mb-md"
              accept="image/*"
            />

            <div class="row">
              <div class="col-6">
                <q-select
                  dense
                  v-model="lesson.curriculum"
                  :options="curriculums"
                  emit-value
                  map-options
                  label="Curriculum"
                  outlined
                  class="q-mb-md q-pr-md"
                />
              </div>
              <div class="col-6">
                <q-select
                  dense
                  v-model="lesson.level"
                  :options="levels"
                  emit-value
                  map-options
                  label="Level"
                  outlined
                  class="q-mb-md"
                  :disable="!lesson.curriculum"
                />
              </div>
            </div>

            <div class="row q-mb-md">
              <div class="col-6">
                <q-select
                  dense
                  v-model="lesson.subject"
                  :options="subjects"
                  emit-value
                  map-options
                  label="Subject"
                  outlined
                  class="q-mb-md q-pr-md"
                  :disable="!lesson.level"
                />
              </div>

              <div class="col-6">
                <q-select
                  dense
                  v-model="isTopic"
                  :options="['Topic', 'Book']"
                  outlined
                  label="Topic or Book"
                />
              </div>

              <div class="col-6" v-if="isTopic === 'Topic'">
                <q-select
                  dense
                  v-model="lesson.topic_or_book"
                  :options="topics"
                  emit-value
                  map-options
                  label="Topic title"
                  outlined
                  class="q-mb-md q-pr-md"
                  :disable="!lesson.subject"
                />
              </div>

              <div class="col-6" v-if="isTopic === 'Book'">
                <q-input
                  dense
                  v-model="lesson.topic_or_book"
                  label="Book title"
                  outlined
                  class="q-mb-md"
                />
              </div>

              <div class="col-6">
                <q-input
                  :rules="[(val) => val > 0 || 'At least 1 section required']"
                  dense
                  v-model.number="totalSections"
                  type="number"
                  min="1"
                  label="Number of Sections"
                  outlined
                />
              </div>
            </div>
          </div>

          <!-- STEP 2 -->
          <div v-if="step === 2 && currentSection">
            <div class="text-subtitle1 q-mb-md">
              Section {{ currentSectionIndex + 1 }} of {{ lesson.sections.length }}
            </div>

            <q-input
              dense
              v-model="currentSection.title"
              label="Section Name"
              outlined
              class="q-mb-sm"
            />
            <q-input
              dense
              autogrow
              v-model="currentSection.description"
              label="Section Description"
              outlined
              type="textarea"
              class="q-mb-md"
            />

            <div class="row">
              <div class="col-6">
                <q-select
                  dense
                  v-model="currentSection.type"
                  :options="sectionTypes"
                  label="Section Type"
                  outlined
                  class="q-mb-md q-pr-md"
                />
              </div>
              <div class="col-6">
                <q-select
                  dense
                  v-model="currentSection.access"
                  :options="accessOptions"
                  label="Access"
                  outlined
                  class="q-mb-md"
                />
              </div>
            </div>

            <q-toggle v-model="currentSection.required" label="Required" />

            <div v-if="currentSection.type === 'video'" class="q-mt-md">
              <q-file
                dense
                v-model="currentSection.content.videoFile"
                label="Video"
                outlined
                accept="video/*"
              />
              <q-input
                dense
                v-model.number="currentSection.content.duration"
                label="Duration (seconds)"
                outlined
                type="number"
              />
            </div>

            <div v-if="currentSection.type === 'document'" class="q-mt-md">
              <q-file
                dense
                v-model="currentSection.content.documentFile"
                label="Document"
                outlined
                accept=".pdf,.doc,.docx"
              />
            </div>

            <div v-if="currentSection.type === 'quiz'" class="q-mt-md">
              <div class="text-subtitle2 q-mb-md">
                Questions ({{ currentSection.quiz.questions.length }})
              </div>

              <div
                v-for="(question, qIndex) in currentSection.quiz.questions"
                :key="qIndex"
                class="q-mb-lg q-pa-md"
                style="border: 1px solid #e0e0e0; border-radius: 4px"
              >
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-subtitle2">Question {{ qIndex + 1 }}</div>
                  <q-btn
                    flat
                    dense
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click="removeQuestion(qIndex)"
                    :disable="currentSection.quiz.questions.length === 1"
                  />
                </div>

                <q-input v-model="question.title" label="Question" outlined dense class="q-mb-md" />

                <q-select
                  v-model="question.type"
                  :options="['multiple-choice', 'structured']"
                  label="Question Type"
                  outlined
                  dense
                  class="q-mb-md"
                />

                <!-- MULTIPLE CHOICE -->
                <div v-if="question.type === 'multiple-choice'">
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
                    label="Correct Option Index (0-3)"
                    type="number"
                    outlined
                    dense
                    class="q-mb-md"
                    min="0"
                    max="3"
                  />
                </div>

                <!-- STRUCTURED -->
                <div v-if="question.type === 'structured'">
                  <q-input
                    v-model="question.correctAnswer"
                    label="Correct Answer"
                    outlined
                    dense
                    autogrow
                    type="textarea"
                    class="q-mb-md"
                  />
                </div>

                <q-input
                  v-model="question.gradingNote"
                  label="Grading Note"
                  outlined
                  dense
                  autogrow
                  type="textarea"
                />
              </div>

              <q-btn
                flat
                color="primary"
                icon="add"
                label="Add Question"
                @click="addQuestion"
                class="full-width"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between">
          <q-btn flat label="Back" :disable="step === 1 || isSubmitting" @click="prevStep" />

          <q-btn
            color="primary"
            :label="step === 1 ? 'Next' : isLastSection ? 'Submit Lesson' : 'Next Section'"
            :disable="!canProceed || isSubmitting"
            :loading="isSubmitting"
            @click="nextStep"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import FilesService from '../services/files.service'
import LessonsService from '../services/lessons.service'
import SubjectsService from '../services/subjects.service'
import CurriculumsService from '../services/curriculums.service'
import TopicsService from '../services/topics.service'
import LevelsService from '../services/levels.service'

const modal = ref(false)
const step = ref(1)
const totalSections = ref(1)
const currentSectionIndex = ref(0)
const isTopic = ref('Topic')
const isSubmitting = ref(false)

const lesson = ref({
  id: `lesson_${Date.now()}`,
  title: '',
  description: '',
  thumbnail: null,
  teacher_id: 'teacher_001',
  curriculum: '',
  curriculumId: '',
  level: '',
  levelId: '',
  subject: '',
  subjectId: '',
  topic_or_book: '',
  topicId: '',
  sections: [],
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

const sectionTypes = ['video', 'document', 'quiz']
const accessOptions = ['free', 'premium']

const currentSection = computed(() => lesson.value.sections[currentSectionIndex.value] || null)
const isLastSection = computed(() => currentSectionIndex.value === lesson.value.sections.length - 1)

// Improved validation logic
const canProceed = computed(() => {
  if (step.value === 1) {
    // Step 1 validation
    const hasBasicInfo = lesson.value.title && lesson.value.description && lesson.value.thumbnail
    const hasValidSections = totalSections.value > 0
    const hasTopicOrBook = lesson.value.topic_or_book !== ''

    return hasBasicInfo && hasValidSections && hasTopicOrBook
  }

  if (step.value === 2 && currentSection.value) {
    // Step 2 validation
    const section = currentSection.value
    const hasBasicInfo = section.title && section.type

    if (!hasBasicInfo) return false

    // Type-specific validation
    if (section.type === 'video') {
      return section.content?.videoFile && section.content?.duration > 0
    }

    if (section.type === 'document') {
      return section.content?.documentFile
    }

    if (section.type === 'quiz') {
      const hasQuestions = section.quiz?.questions?.length > 0
      if (!hasQuestions) return false

      // Validate all questions
      return section.quiz.questions.every((question) => {
        const hasQuestion = question.title?.trim()
        if (!hasQuestion) return false

        if (question.type === 'multiple-choice') {
          const hasAllOptions = question.options.every((opt) => opt.trim() !== '')
          const hasValidIndex =
            question.correctOptionIndexes[0] >= 0 && question.correctOptionIndexes[0] <= 3
          return hasAllOptions && hasValidIndex
        }

        if (question.type === 'structured') {
          return question.correctAnswer?.trim() !== ''
        }

        return false
      })
    }

    return true
  }

  return false
})

onMounted(loadMetaData)

/* LOAD DATA */
async function loadMetaData() {
  const [subjectsRes, curriculumsRes, topicsRes, levelsRes] = await Promise.all([
    SubjectsService.getAll(),
    CurriculumsService.getAll(),
    TopicsService.getAll(),
    LevelsService.getAll(),
  ])

  allCurriculums.value = curriculumsRes
  allLevels.value = levelsRes
  allSubjects.value = subjectsRes
  allTopics.value = topicsRes

  curriculums.value = mapToOptions(allCurriculums.value)
}

// Watch for section type changes and initialize content
watch(
  () => currentSection.value?.type,
  (newType, oldType) => {
    if (!currentSection.value || newType === oldType) return

    // Initialize content based on type
    if (newType === 'video') {
      currentSection.value.content = {
        videoFile: null,
        duration: 0,
      }
      delete currentSection.value.quiz
    } else if (newType === 'document') {
      currentSection.value.content = {
        documentFile: null,
      }
      delete currentSection.value.quiz
    } else if (newType === 'quiz') {
      delete currentSection.value.content
      currentSection.value.quiz = {
        questions: [createEmptyQuestion()],
      }
    }
  },
)

/* WATCHERS */
watch(
  () => lesson.value.curriculum,
  (id) => {
    if (!id) return

    lesson.value.level = ''
    lesson.value.subject = ''
    lesson.value.topic_or_book = ''

    levels.value = mapToOptions(allLevels.value.filter((l) => l.curriculumId === id))
  },
)

watch(
  () => lesson.value.level,
  (id) => {
    if (!id) return

    lesson.value.subject = ''
    lesson.value.topic_or_book = ''

    subjects.value = mapToOptions(allSubjects.value.filter((s) => s.levelId === id))
  },
)

watch(
  () => lesson.value.subject,
  (id) => {
    if (!id) return

    lesson.value.topic_or_book = ''

    topics.value = mapToOptions(allTopics.value.filter((t) => t.subjectId === id))
  },
)

watch(modal, (val) => {
  if (!val) resetForm()
})

watch(isTopic, () => {
  lesson.value.topic_or_book = ''
})

/* HELPERS */
function mapToOptions(items = []) {
  return items.map((i) => ({ label: i.title, value: i.id }))
}

function createEmptyQuestion() {
  return {
    title: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctOptionIndexes: [0],
    correctAnswer: '',
    gradingNote: '',
  }
}

function addQuestion() {
  if (currentSection.value?.quiz) {
    currentSection.value.quiz.questions.push(createEmptyQuestion())
  }
}

function removeQuestion(index) {
  if (currentSection.value?.quiz && currentSection.value.quiz.questions.length > 1) {
    currentSection.value.quiz.questions.splice(index, 1)
  }
}

function createSections() {
  lesson.value.sections = Array.from({ length: totalSections.value }, (_, i) => ({
    id: `section_${i + 1}`,
    title: '',
    description: '',
    type: 'video',
    access: 'free',
    required: true,
    content: {
      videoFile: null,
      duration: 0,
    },
  }))
}

function prevStep() {
  if (step.value === 2 && currentSectionIndex.value > 0) {
    currentSectionIndex.value--
    return
  }

  if (step.value === 2 && currentSectionIndex.value === 0) {
    step.value = 1
    currentSectionIndex.value = 0
  }
}

function nextStep() {
  if (step.value === 1) {
    createSections()
    currentSectionIndex.value = 0
    step.value = 2
    return
  }

  if (currentSectionIndex.value < lesson.value.sections.length - 1) {
    currentSectionIndex.value++
    return
  }

  // Submit on last section
  submitLesson()
}

function resetForm() {
  step.value = 1
  currentSectionIndex.value = 0
  totalSections.value = 1
  isTopic.value = 'Topic'

  lesson.value = {
    id: `lesson_${Date.now()}`,
    title: '',
    description: '',
    thumbnail: null,
    teacher_id: 'teacher_001',
    curriculum: '',
    level: '',
    subject: '',
    topic_or_book: '',
    sections: [],
  }
}

async function uploadFile(file) {
  if (!file) return null

  const response = await FilesService.upload('/files/upload', file)

  return response.secureUrl || response.url
}

async function submitLesson() {
  try {
    isSubmitting.value = true

    // Upload thumbnail
    if (lesson.value.thumbnail) {
      lesson.value.thumbnail = await uploadFile(lesson.value.thumbnail)
    }

    // Upload section files
    for (const section of lesson.value.sections) {
      section.Title = section.title
      section.Type = section.type
      if (section.type === 'quiz' && section.quiz) {
        section.quiz.title = section.title // or a separate quiz title if you want
        section.quiz.type = 'quiz'
      }

      // ---- VIDEO ----
      if (section.type === 'video' && section.content?.videoFile) {
        section.videoUrl = await uploadFile(section.content.videoFile)
        section.duration = section.content.duration
        delete section.content.videoFile
      }

      // ---- DOCUMENT ----
      if (section.type === 'document' && section.content?.documentFile) {
        section.documentUrl = await uploadFile(section.content.documentFile)
        delete section.content.documentFile
      }
      if (section.type === 'document' && section.content?.documentFile) {
        section.documentUrl = await uploadFile(section.content.documentFile)
        delete section.content.documentFile
      }
    }

    // Save lesson

    const payload = {
      ...lesson.value,
      curriculumId: lesson.value.curriculum,
      levelId: lesson.value.level,
      subjectId: lesson.value.subject,
      topicId: lesson.value.topic_or_book,
    }
    console.log('FINAL LESSON OBJECT:', JSON.stringify(payload, null, 2))
    const result = await LessonsService.createLessonWithSections(payload)

    if (!result) throw new Error('Failed to create lesson')
    modal.value = false
  } catch (error) {
    console.error('Error saving lesson:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
