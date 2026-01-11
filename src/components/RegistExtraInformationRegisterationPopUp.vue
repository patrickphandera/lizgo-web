<template>
  <q-dialog persistent v-model="open">
    <q-card class="q-pb-md">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Content Personalization</div>
        <q-space />
      </q-card-section>

      <q-card-section>
        Help us tailor the content to you by sharing a few details about your location, syllabus,
        and current level. This will ensure you see the most relevant lessons and resources from the
        start.
      </q-card-section>

      <div class="q-px-md">
        <!-- STEP 1: COUNTRY -->
        <div v-if="step === 1">
          <div class="row q-gutter-sm q-mb-md">
            <q-linear-progress
              v-for="n in 4"
              :key="n"
              :value="step >= n ? 1 : 0"
              color="primary"
              size="20px"
              rounded
              class="col"
            >
              <div
                :class="
                  step >= n
                    ? `absolute-full flex flex-center text-caption text-white`
                    : 'absolute-full flex flex-center  text-black text-caption'
                "
              >
                {{ steps[n - 1] }} <q-icon v-if="step >= n" name="mdi-check-circle"></q-icon>
                <q-icon v-else></q-icon></div
            ></q-linear-progress>
          </div>
          <q-input dense outlined label="Search country" class="q-mb-md"></q-input>
          <q-option-group
            v-model="form.country"
            :options="countries"
            type="radio"
            class="option-scroll text-body2"
          />
        </div>

        <!-- STEP 2: CURRICULUM -->
        <div v-if="step === 2">
          <div class="row q-gutter-sm q-mb-md">
            <q-linear-progress
              v-for="n in 4"
              :key="n"
              size="20px"
              :value="step >= n ? 1 : 0"
              color="primary"
              rounded
              class="col"
            >
              <div
                :class="
                  step >= n
                    ? `absolute-full flex flex-center text-caption text-white`
                    : 'absolute-full flex flex-center  text-black text-caption'
                "
              >
                {{ steps[n - 1] }} <q-icon v-if="step >= n" name="mdi-check-circle"></q-icon>
                <q-icon v-else></q-icon>
              </div>
            </q-linear-progress>
          </div>
          <q-option-group v-model="form.curriculum" :options="curriculums" type="radio" />
        </div>

        <!-- STEP 3: LEVEL -->
        <div v-if="step === 3">
          <div class="row q-gutter-sm q-mb-md">
            <q-linear-progress
              v-for="n in 4"
              :key="n"
              :value="step >= n ? 1 : 0"
              color="primary"
              size="20px"
              rounded
              class="col"
            >
              <div
                :class="
                  step >= n
                    ? `absolute-full flex flex-center text-caption text-white`
                    : 'absolute-full flex flex-center  text-black text-caption'
                "
              >
                {{ steps[n - 1] }} <q-icon v-if="step >= n" name="mdi-check-circle"></q-icon>
                <q-icon v-else></q-icon></div
            ></q-linear-progress>
          </div>
          <q-option-group v-model="form.level" :options="levels" type="radio" />

          <!-- MSCE FORMS -->
          <div v-if="isMsceCurriculum" class="q-mt-lg">
            <div class="text-subtitle1 q-mb-sm">Select MSCE Form</div>
            <q-option-group v-model="form.msceForm" :options="msceForms" type="radio" />
          </div>
        </div>

        <div v-if="step === 4">
          <div class="row q-gutter-sm q-mb-md">
            <q-linear-progress
              v-for="n in 4"
              :key="n"
              :value="step >= n ? 1 : 0"
              color="primary"
              size="20px"
              rounded
              class="col"
            >
              <div
                :class="
                  step >= n
                    ? 'absolute-full flex flex-center text-caption text-white'
                    : 'absolute-full flex flex-center text-caption text-black'
                "
              >
                {{ steps[n - 1] }}
                <q-icon v-if="step >= n" name="mdi-check-circle" />
              </div>
            </q-linear-progress>
          </div>

          <div class="scroll-section">
            <q-option-group v-model="form.subjects" :options="subjects" type="checkbox" />
          </div>
        </div>

        <!-- NAVIGATION -->
        <div class="row justify-between q-mt-lg">
          <q-btn
            class="text-capitalize text-body1"
            no-caps
            outline
            icon="mdi-chevron-left"
            color="primary"
            :disable="step === 1"
            @click="prevStep"
          />

          <q-btn
            v-if="step === 4"
            no-caps
            label="Explore Lessons"
            color="primary"
            icon-right="mdi-arrow-right"
            class="text-capitalize"
            :disable="!canProceed"
            @click="submit"
          />

          <q-btn
            v-if="step < 4"
            no-caps
            class="text-capitalize text-body1"
            color="primary"
            icon-right="mdi-chevron-right"
            :disable="!canProceed"
            @click="nextStep"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch,onMounted } from 'vue'
import curriculumsService from '../services/curriculums.service.js'
import levelsService from '../services/levels.service.js'
import UserPersonalizationsService from '../services/user-personalizations.js'
import subjectsService from '../services/subjects.service.js'
const step = ref(1)
const open = ref(false)

const form = ref({
  subjects: ['english'],
  country: 'mw',
  curriculum: null,
  level: null,
  msceForm: null,
})

const countries = [
  { label: 'Malawi', value: 'mw' },
  { label: 'Zambia', value: 'zm' },
  { label: 'Zimbabwe', value: 'zw' },
]

const curriculums = ref([])
const levels = ref([])
const curriculumMap = ref(new Map())

const subjects = ref([])


const msceForms = [
  { label: 'Form 1', value: 'form1' },
  { label: 'Form 2', value: 'form2' },
  { label: 'Form 3', value: 'form3' },
  { label: 'Form 4', value: 'form4' },
  { label: 'Other', value: 'other' },
]

const steps = ref(['Current Location', 'Current Curriculum', 'Current Level', 'Select Subjects'])
// Load ALL curriculums and filter by country on frontend
async function loadCurriculums() {
  try {
    const all = await curriculumsService.list() // returns array of curriculum objects
    const filtered = all.filter(
      (item) => (item.country_code || '').toLowerCase() === form.value.country,
    )

    const map = new Map()
    curriculums.value = filtered.map((item) => {
      map.set(item.id, item)
      return { label: item.title, value: item.id }
    })
    curriculumMap.value = map

    // Reset downstream selections
    form.value.curriculum = null
    form.value.level = null
    levels.value = []
    if (step.value > 1) step.value = 1
  } catch (err) {
    console.error('Failed to load curriculums:', err)
    curriculums.value = []
    curriculumMap.value = new Map()
  }
}

// Load ALL levels and filter by curriculumId on frontend
async function loadLevels() {
  if (!form.value.curriculum) {
    levels.value = []
    return
  }

  try {
    const allLevels = await levelsService.list() // get all levels
    const filtered = allLevels.filter((item) => item.curriculumId === form.value.curriculum)

    levels.value = filtered.map((item) => ({
      label: item.title,
      value: item.id,
    }))

    form.value.level = null
    form.value.msceForm = null
  } catch (err) {
    console.error('Failed to load levels:', err)
    levels.value = []
  }
}
async function loadSubjects() {
  if (!form.value.level) {
    subjects.value = []
    form.value.subjects = []
    return
  }

  try {
    const allSubjects = await subjectsService.list()
    const filtered = allSubjects.filter((s) => s.levelId === form.value.level)

    subjects.value = filtered.map((s) => ({
      label: s.title,
      value: s.id,
    }))

    // reset selection when level changes
    form.value.subjects = []
  } catch (err) {
    console.error('Failed to load subjects:', err)
    subjects.value = []
  }
}

// Watchers
watch(() => form.value.country, loadCurriculums, { immediate: true })
watch(() => form.value.curriculum, loadLevels)
watch(() => form.value.level, loadSubjects)
onMounted(() => {
  getByAUth()
})

// Is selected curriculum titled "MSCE"?
const isMsceCurriculum = computed(() => {
  if (!form.value.curriculum) return false
  const curriculum = curriculumMap.value.get(form.value.curriculum)
  return curriculum?.title === 'MSCE'
})

// Validation
const canProceed = computed(() => {
  if (step.value === 1) return !!form.value.country
  if (step.value === 2) return !!form.value.curriculum
  if (step.value === 3) {
    if (!form.value.level) return false
    if (isMsceCurriculum.value) return !!form.value.msceForm
    return true
  }
  if (step.value === 4) {
    return form.value.subjects.length > 0
  }
  return false
})


function nextStep() {
  if (step.value < 4) step.value++
}

function prevStep() {
  if (step.value > 1) step.value--
}

async function submit() {
  const payload = {
    countryCode: form.value.country,
    curriculumId: form.value.curriculum,
    levelId: form.value.level,
    ...(isMsceCurriculum.value && { msceForm: form.value.msceForm }),
  }

  console.log('Final personalization data:', payload)
  try {
    await UserPersonalizationsService.createUserPersonalization(payload)
    alert('Your content persolization saved.This page will reload to reflect your preferences.')
    location.reload()
  } catch (error) {
    alert(error)
  }
  open.value = false
}

async function getByAUth() {
  try {
    await UserPersonalizationsService.exists()
    open.value = false
  } catch (error) {
    open.value = true
    console.log('not loaded', error)
  }
}
</script>

<style scoped>
.scroll-section {
  max-height: 250px;
  overflow-y: auto;
}
</style>
