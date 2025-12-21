<template>
  <q-list>

    <q-item clickable @click="modal = true">
      <q-item-section avatar>
        <q-icon name="add" />
      </q-item-section>

      <q-item-section>
        <q-item-label>Add Lessons</q-item-label>

        {{ subjects }}

        {{ levels }}

        {{ topics }}

        {{ curriculums }}
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

          <div v-if="step === 1">
            <q-input dense v-model="lesson.name" label="Lesson Name" outlined class="q-mb-md">
            </q-input>
            <q-input dense autogrow v-model="lesson.description" label="Description" outlined type="textarea"
              class="q-mb-md" />
            <q-input type="file" dense v-model="lesson.thumbnail" label="Thumbnail" outlined class="q-mb-md" />
            <div class="row ">
              <div class="col-6">
                <q-select dense v-model="lesson.curriculum" :options="curriculums" label="Curriculum" outlined
                  class="q-mb-md q-pr-md" />
              </div>
              <div class="col-6">
                <q-select dense v-model="lesson.level" :options="levels" label="Level" outlined class="q-mb-md" />
              </div>
            </div>

            <div class="q-mb-md row">
              <div class="col-6">
                <q-select :options="subjects" autogrow dense v-model="lesson.subject" label="Subject" outlined
                  class="q-mb-md q-mr-md" />
              </div>
              <div class="col-6">
                <q-select autogrow dense v-model="isTopic" outlined color="primary" label="Topic or Book"
                  class="q-pr-md" :options="['Topic', 'Book']" />
              </div>
              <div class="col-6" v-if="isTopic === 'Topic'">
                <q-select dense v-model="lesson.topic_or_book" :options="topics" label="Topic name" outlined
                  class="q-mb-md q-mr-md" />
              </div>
              <div class="col-6" v-if="isTopic === 'Book'">
                <q-input dense v-model="lesson.topic_or_book" label="Book name" outlined class="q-mb-md " />
              </div>

              <div class="col-6">
                <q-input dense v-model="totalSections" type="number" min="1" label="Number of Sections" outlined />
              </div>
            </div>

          </div>



          <div v-if="step === 2 && currentSection">
            <div class="text-subtitle1 q-mb-md">
              Section {{ currentSectionIndex + 1 }} of {{ lesson.sections.length }}
            </div>

            <q-input autogrow dense v-model="currentSection.name" label="Section Name" outlined class="q-mb-sm" />
            <q-input autogrow dense v-model="currentSection.description" label="Section Description" outlined
              type="textarea" class="q-mb-md" />
            <div class="row">
              <div class="col-6">
                <q-select autogrow dense v-model="currentSection.type" :options="sectionTypes" label="Section Type"
                  outlined class="q-mb-md q-mr-md" />
              </div>
              <div class="col-6">
                <q-select autogrow dense v-model="currentSection.access" :options="accessOptions" label="Access"
                  outlined class="q-mb-md" />
              </div>
            </div>
            <q-toggle v-model="currentSection.required" label="Required" />

            <div v-if="currentSection.type === 'video'" class="q-mt-md">
              <q-file autogrow dense v-model="currentSection.content.video_url" label="Video" outlined class="q-mb-sm">
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template></q-file>
              <q-input autogrow dense v-model.number="currentSection.content.duration" label="Duration (seconds)"
                outlined />
            </div>

            <div v-if="currentSection.type === 'document'" class="q-mt-md">
              <q-file autogrow dense v-model="currentSection.content.document_url" label="Document" outlined
                class="q-mb-sm" />
            </div>

            <div autogrow dense v-if="currentSection.type === 'question'" class="q-mt-md">
              <q-btn label="Add Question" class="no_caps" color="primary" outline @click="addQuestion" />

              <div v-for="(q, qi) in currentSection.content.questions" :key="qi" class="q-mt-md">
                <q-input autogrow dense v-model="q.question" label="Question" outlined class="q-mb-sm" />
                <q-input autogrow dense v-for="(opt, oi) in q.options" :key="oi" v-model="q.options[oi]"
                  :label="`Option ${oi + 1}`" outlined class="q-mb-xs" />
                <q-select autogrow dense v-model="q.correct_option" :options="[0, 1, 2, 3]" label="Correct Option Index"
                  outlined />
                <q-separator class="q-my-md" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between">
          <q-btn no_caps flat label="Back" :disable="step === 1" @click="prevStep" />
          <q-btn color="primary" no_caps :label="step === 1 ? 'Next' : isLastSection ? 'Submit Lesson' : 'Next Section'"
            @click="nextStep" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-list>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// assumed existing services
import SubjectsService from '../services/subjects.service'
import CurriculumsService from '../services/curriculums.service'
import TopicsService from '../services/topics.service'
import LevelsService from '../services/levels.service'


const modal = ref(false)
const isTopic = ref('Topic')
const step = ref(1)
const totalSections = ref(1)
const currentSectionIndex = ref(0)

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
const subjects = ref([])
const curriculums = ref([])
const levels = ref([])
const topics = ref([])
const sectionTypes = ['video', 'document', 'question']
const accessOptions = ['free', 'premium']

const currentSection = computed(() => lesson.value.sections[currentSectionIndex.value] || null)
const isLastSection = computed(() => currentSectionIndex.value === lesson.value.sections.length - 1)

onMounted(async () => {
  await loadMetaData()
})

async function loadMetaData() {
  try {
    const [
      subjectsRes,
      curriculumsRes,
      topicsRes,
      levelsRes
    ] = await Promise.all([
      SubjectsService.getAll(),
      CurriculumsService.getAll(),
      TopicsService.getAll(),
      LevelsService.getAll()
    ])
    console.log(subjectsRes,
      curriculumsRes,
      topicsRes,
      levelsRes)
    subjects.value = mapToOptions(subjectsRes)
    curriculums.value = mapToOptions(curriculumsRes)
    topics.value = mapToOptions(topicsRes)
    levels.value = mapToOptions(levelsRes)



  } catch (err) {
    console.error('Failed to load lesson metadata', err)
  }
}

function mapToOptions(items = []) {
  return items.map(i => ({
    label: i.title, // 👈 title shown to user
    value: i.id     // 👈 stored in lesson object
  }))
}

function createSections() {
  lesson.value.sections = Array.from({ length: totalSections.value }, (_, i) => ({
    id: `section_${i + 1}`,
    name: '',
    description: '',
    type: 'video',
    access: 'free',
    required: true,
    content: { video_url: '', duration: 0, document_url: '', format: 'pdf', questions: [] }
  }))
}

function nextStep() {
  if (step.value === 1) {
    createSections()
    step.value = 2
    return
  }

  if (!isLastSection.value) {
    currentSectionIndex.value++
  } else {
    submitLesson()
  }
}

function prevStep() {
  if (step.value === 2 && currentSectionIndex.value > 0) {
    currentSectionIndex.value--
  } else if (step.value === 2) {
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

function submitLesson() {
  console.log('FINAL LESSON OBJECT:', JSON.stringify(lesson.value, null, 2))
  modal.value = false
}
</script>
