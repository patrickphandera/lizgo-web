<template>
  <q-page class="q-px-sm">
    <RegistExtraInformationRegisterationPopUp></RegistExtraInformationRegisterationPopUp>
    <div class="row justify-between q-px-md q-mt-sm items-center">
      <div class="column">
        <div class="text-weight-bold text-h6">Welcome to Lessons</div>
        <div>We have a variety of lessons tailored to your curriculum and levels of study.</div>
      </div>

      <div class="row items-center justify-between">
        <div class="lt-md">
          <AddCredit />
        </div>
      </div>

      <div class="row q-gutter-md items-center gt-sm">
        <!-- Level Filter -->
        <q-select
          dense
          outlined
          v-model="selectedLevelId"
          :options="levelOptions"
          label="Level"
          style="width: 150px"
          emit-value
          map-options
        />
        <AddCredit />
      </div>
    </div>

    <!-- Search -->
    <div class="q-px-md q-mt-sm q-mb-sm">
      <q-input
        class="thick-border"
        dense
        color="primary"
        outlined
        v-model="searchText"
        label="Search Lessons"
        style="width: 100%"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Subject Chips (from backend) -->
    <div class="q-mx-sm q-mb-sm row no-wrap scroll-x q-gutter-md hide-scrollbar">
      <q-chip
        square
        dense
        :color="!selectedSubjectId ? 'primary' : 'grey-3'"
        :text-color="!selectedSubjectId ? 'white' : 'dark'"
        class="shadow-2 q-pt-xs cursor-pointer"
        @click="selectedSubjectId = null"
      >
        All
      </q-chip>
      <q-chip
        v-for="subject in subjects"
        :key="subject.id"
        square
        dense
        :color="selectedSubjectId === subject.id ? 'primary' : 'grey-3'"
        :text-color="selectedSubjectId === subject.id ? 'white' : 'dark'"
        class="shadow-0 cursor-pointer"
        @click="selectedSubjectId = subject.id"
      >
        {{ subject.title }}
      </q-chip>
    </div>

    <!-- Lessons -->
    <div class="row q-col-gutter-md grid-auto q-px-md">
      <LessonFirstCard v-for="lesson in filteredLessons" :key="lesson.id" :lesson="lesson" />
      <div v-if="filteredLessons.length === 0" class="col-12 text-center text-grey-7 q-mt-xl">
        No lessons found.
      </div>
    </div>
  </q-page>
</template>

<script>
import AddCredit from '../components/AddCredit.vue'
import LessonFirstCard from 'src/components/TeacherLessonFirstCard.vue'
import lessonsService from 'src/services/lessons.service'
import subjectsService from 'src/services/subjects.service'
import levelsService from 'src/services/levels.service'
import RegistExtraInformationRegisterationPopUp from '../components/RegistExtraInformationRegisterationPopUp.vue'
export default {
  components: {
    LessonFirstCard,
    RegistExtraInformationRegisterationPopUp,
    AddCredit,
  },
  name: 'IndexPage',

  data() {
    return {
      lessons: [],
      subjects: [],
      levels: [],
      selectedLevelId: null,
      selectedSubjectId: null,
      searchText: '',
      loading: true,
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      try {
        const [lessons, subjects, levels] = await Promise.all([
          lessonsService.getStudentPersonalizedLessons(),
          subjectsService.getAll(),
          levelsService.getAll(),
        ])

        // Normalize IDs
        this.lessons = lessons.map((item) => ({
          ...item,
          id: item.id || item._id,
        }))

        this.subjects = subjects.map((item) => ({
          ...item,
          id: item.id || item._id,
        }))

        this.levels = levels.map((item) => ({
          ...item,
          id: item.id || item._id,
        }))
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        this.loading = false
      }
    },
  },

  computed: {
    // Level options for select: [{ label, value }, ...]
    levelOptions() {
      return [
        { label: 'All', value: null },
        ...this.levels.map((level) => ({
          label: level.title,
          value: level.id,
        })),
      ]
    },

    // Main filtering logic
    filteredLessons() {
      let list = this.lessons

      // Filter by level
      if (this.selectedLevelId) {
        list = list.filter((lesson) => lesson.levelId === this.selectedLevelId)
      }

      // Filter by subject
      if (this.selectedSubjectId) {
        list = list.filter((lesson) => lesson.subjectId === this.selectedSubjectId)
      }

      // Search
      if (this.searchText.trim()) {
        const term = this.searchText.toLowerCase().trim()
        list = list.filter(
          (lesson) =>
            (lesson.title && lesson.title.toLowerCase().includes(term)) ||
            (lesson.description && lesson.description.toLowerCase().includes(term)),
        )
      }

      return list
    },
  },
}
</script>

<style scoped>
.thick-border .q-field__control::before,
.thick-border .q-field__control::after {
  border-width: 2px;
}
.cursor-pointer {
  cursor: pointer;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
