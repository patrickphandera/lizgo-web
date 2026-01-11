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
          <div class="text-h6 text-weight-medium">Current Location</div>
          <div class="row q-gutter-sm q-mb-md q-mt-sm">
            <q-linear-progress
              v-for="n in 3"
              :key="n"
              :value="step >= n ? 1 : 0"
              color="primary"
              size="6px"
              rounded
              class="col"
            />
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
          <div class="text-h6 q-mb-xs text-h6 text-weight-medium">Current Curriculum</div>
          <div class="row q-gutter-sm q-mb-md q-mt-sm">
            <q-linear-progress
              v-for="n in 3"
              :key="n"
              :value="step >= n ? 1 : 0"
              color="primary"
              size="6px"
              rounded
              class="col"
            />
          </div>
          <q-option-group v-model="form.curriculum" :options="curriculums" type="radio" />
        </div>

        <!-- STEP 3: LEVEL -->
        <div v-if="step === 3">
          <div class="text-h6 text-weight-medium">Current Level</div>
          <div class="row q-gutter-sm q-mb-md q-mt-sm">
            <q-linear-progress
              v-for="n in 3"
              :key="n"
              :value="step >= n ? 1 : 0"
              color="primary"
              size="6px"
              rounded
              class="col"
            />
          </div>
          <q-option-group v-model="form.level" :options="levels" type="radio" />

          <!-- MSCE FORMS -->
          <div v-if="isMsceCurriculum" class="q-mt-lg">
            <div class="text-subtitle1 q-mb-sm">Select MSCE Form</div>
            <q-option-group v-model="form.msceForm" :options="msceForms" type="radio" />
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
            v-if="step === 3"
            no-caps
            label="Explore Lessons"
            color="primary"
            class="text-capitalize"
            :disable="!canProceed"
            @click="submit"
          />

          <q-btn
            v-if="step < 3"
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
import { ref, computed, watch } from 'vue'
import curriculumsService from '../services/curriculums.service.js'
import levelsService from '../services/levels.service.js'
import UserPersonalizationsService from '../services/user-personalizations.js'
const step = ref(1)
const open = ref(false)

const form = ref({
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

const msceForms = [
  { label: 'Form 1', value: 'form1' },
  { label: 'Form 2', value: 'form2' },
  { label: 'Form 3', value: 'form3' },
  { label: 'Form 4', value: 'form4' },
  { label: 'Other', value: 'other' },
]

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

// Watchers
watch(() => form.value.country, loadCurriculums, { immediate: true })
watch(() => form.value.curriculum, loadLevels)
watch(getByAUth())

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
    if (isMsceCurriculum.value) {
      return !!form.value.msceForm
    }
    return true
  }
  return false
})

function nextStep() {
  if (step.value < 3) step.value++
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
   location.reload();
  } catch (error) {
    alert(error)
  }
  open.value = false
}

async function getByAUth() {
  try {
    await UserPersonalizationsService.exists()
    open.value=false
  } catch (error) {
    open.value=true
    console.log('not loaded', error)
  }
}
</script>

<style scoped>
.option-scroll {
  max-height: 240px;
  overflow-y: auto;
}
</style>
