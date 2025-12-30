<template>
  <q-page class="">
    <div class="text-h6 q-px-lg q-mt-sm">
      Lessons
    </div>
    <div class="q-px-md q-mt-sm q-mb-sm">
      <div class="shadow-0 row q-pt-xs q-mt-sm q-px-xs" style="flex: 2; min-width: 300px;">
        <q-input  dense color="primary" outlined v-model="text" label="Search Lessons" style="width: 100%;">
          <template v-slot:prepend>
            <q-icon dense unelevated name="
                  search" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-mx-sm q-mb-sm  row no-wrap scroll-x q-gutter-md hide-scrollbar">
      <q-chip square dense color="primary shadow-2 q-pt-xs" class="text-white">All</q-chip>
      <q-chip dense square class="shadow-0"
        v-for="n in ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Science & Technology', 'Agriculture', 'Home Economics', 'Physics', 'Chemistry', 'Life Skills', 'French', 'Chichewa', 'Wood Work', 'Metal Work']"
        :key="n">
        {{ n }}
      </q-chip>
    </div>
    <div class="row q-col-gutter-md grid-auto q-px-lg">
      <LessonFirstCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson"></LessonFirstCard>
    </div>
    <AddLessonPage></AddLessonPage>
  </q-page>
</template>

<script>
import LessonFirstCard from 'src/components/LessonFirstCard.vue'
import lessonsService from 'src/services/lessons.service'
import AddLessonPage from '../components/AddLessonPage.vue'
export default {
  components: {
    LessonFirstCard,AddLessonPage
  },
  name: 'IndexPage',

  data() {
    return {
      levels: 'All',
      lessons: []
    }
  },
  async mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const lessons = await lessonsService.getAll()
        this.lessons = lessons
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
