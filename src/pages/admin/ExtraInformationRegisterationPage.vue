<template>
  <q-page class="q-px-md">


    <!-- SEGMENTED PROGRESS -->

    <!-- STEP 1: COUNTRY -->
    <div v-if="step === 1">
      <div class="text-h6">Choose your country</div>
      <div class="row q-gutter-sm q-mb-md q-mt-sm">
        <q-linear-progress v-for="n in 3" :key="n" :value="step >= n ? 1 : 0" color="primary" size="6px" rounded
          class="col" />
      </div>
      <q-input dense outlined label="Search country" class="q-mb-md"></q-input>
      <q-option-group v-model="form.country" :options="countries" type="radio" class="option-scroll" />
    </div>

    <!-- STEP 2: CURRICULUM -->
    <div v-if="step === 2">
      <div class="text-h6 q-mb-xs text-weight-bold">Select Curriculum</div>
      <div class="row q-gutter-sm q-mb-md q-mt-sm">
        <q-linear-progress v-for="n in 3" :key="n" :value="step >= n ? 1 : 0" color="primary" size="6px" rounded
          class="col" />
      </div>

      <q-option-group v-model="form.curriculum" :options="curriculums" type="radio" class="" />
    </div>

    <!-- STEP 3: LEVEL -->
    <div v-if="step === 3">
      <div class="text-h6">Select Level</div>
      <div class="row q-gutter-sm q-mb-md q-mt-sm">
        <q-linear-progress v-for="n in 3" :key="n" :value="step >= n ? 1 : 0" color="primary" size="6px" rounded
          class="col" />
      </div>
      <div class="text-body2 text-grey-7 q-mb-md">
        Choose your education level.
      </div>

      <q-option-group v-model="form.level" :options="levels" type="radio" />

      <!-- MSCE FORMS -->
      <div v-if="form.level === 'msce'" class="q-mt-lg">
        <div class="text-subtitle1 q-mb-sm">
          Select MSCE Form
        </div>

        <q-option-group v-model="form.msceForm" :options="msceForms" type="radio" />
      </div>
    </div>



    <q-footer class="bg-white shadow-0 q-px-md">
      <!-- NAVIGATION -->
      <div class="row justify-between q-my-sm">
        <q-btn label="Previous" class="text-capitalize text-body1" no_caps outline color="primary" :disable="step === 1"
          @click="prevStep" />

        <router-link :to="`/lessons`" class="text-capitalize text-body1" style="text-decoration: none; color: inherit;">
          <q-btn no_caps label="Go to Dashboard" color="primary" v-if="step === 3" :disable="!canProceed"
            @click="submit" />
        </router-link>

        <q-btn no_caps label="Next" class="text-capitalize text-body1" color="primary" :disable="!canProceed"
          v-if="step < 3" @click="nextStep" />
      </div>
    </q-footer>
  </q-page>
</template>
<script setup>
import { ref, computed } from 'vue'

const step = ref(1)

const form = ref({
  country: null,
  curriculum: null,
  level: null,
  msceForm: null
})

const countries = [
  { label: 'Malawi', value: 'afghanistan' },
  { label: 'Albania', value: 'albania' },
  { label: 'Algeria', value: 'algeria' },
  { label: 'Andorra', value: 'andorra' },
  { label: 'Angola', value: 'angola' },
  { label: 'Antigua and Barbuda', value: 'antigua_and_barbuda' },
  { label: 'Argentina', value: 'argentina' },
  { label: 'Armenia', value: 'armenia' },
  { label: 'Australia', value: 'australia' },
  { label: 'Austria', value: 'austria' },
  { label: 'Azerbaijan', value: 'azerbaijan' },


  { label: 'Yemen', value: 'yemen' },
  { label: 'Zambia', value: 'zambia' },
  { label: 'Zimbabwe', value: 'zimbabwe' }
]

const curriculums = [
  { label: 'MSCE', value: 'national' },
  { label: 'GCE', value: 'pslce' },
  { label: 'JCE', value: 'jce' },
  { label: 'PSLCE', value: 'psjjs' },
  { label: 'Cambridge', value: 'cambridge' },
  { label: 'Other', value: 'ib' }
]

const levels = [
  { label: 'Form 1', value: 'primary' },
  { label: 'Form 2', value: 'junior' },
  { label: 'Form 3', value: 'jh' },
  { label: 'Form 4', value: 'msce' }
]

const msceForms = [
  { label: 'Form 1', value: 'form1' },
  { label: 'Form 2', value: 'form2' },
  { label: 'Form 3', value: 'form3' },
  { label: 'Form 4', value: 'form4' },
  { label: 'Other', value: 'other' }
]

const canProceed = computed(() => {
  if (step.value === 1) return !!form.value.country
  if (step.value === 2) return !!form.value.curriculum
  if (step.value === 3) {
    if (form.value.level === 'msce') {
      return !!form.value.msceForm
    }
    return !!form.value.level
  }
  return false
})

function nextStep() {
  if (step.value < 3) step.value++
}

function prevStep() {
  if (step.value > 1) step.value--
}

function submit() {
  console.log('Final data:', form.value)
}
</script>
<style scoped>
.option-scroll {
  max-height: 240px;
  overflow-y: auto;
}
</style>
