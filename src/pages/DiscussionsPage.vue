<template>
  <q-page class="q-pa-md">

    <!-- Subject Filter -->

    <div>
      <q-option-group class="text-caption q-mx-sm" dense v-model="panel" inline :options="[
        { label: 'Completed', value: 'Completed' }, { label: 'Unattempted', value: 'available' }
      ]" />
    </div>
    <q-tab-panels v-model="panel" animated class="shadow-0 rounded-borders ">
      <q-tab-panel name="available">
        <div class="row q-col-gutter-md">
          <DiscussionCard v-for="n in 6" :key="'ongoing-' + n" />
        </div>

      </q-tab-panel>

      <q-tab-panel name="Completed">
        <div class="row q-col-gutter-md">
          <DiscussionCard v-for="n in 6" :key="'ongoing-' + n" />
        </div>
      </q-tab-panel>
    </q-tab-panels>




  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import DiscussionCard from '../../components/DiscussionCard.vue'

import { ref } from 'vue'
export default defineComponent({
  name: 'QuizzesPage',
  components: {
    DiscussionCard
  },
  setup() {
    return {
      panel: ref('Completed'),
      subjects: [
        'Mathematics',
        'English',
        'Physics',
        'Chemistry',
        'Biology',
        'Science & Technology',
        'Agriculture',
        'Life Skills',
        'French'
      ]
    }
  }
})
</script>
