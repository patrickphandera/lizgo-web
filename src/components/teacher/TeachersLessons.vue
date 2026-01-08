<template>
  <q-page>
    <div class="row justify-between q-mt-sm items-center">
      <div class="column">
        <div class="text-body1">Lessons from {{ user.firstName }} {{ user.lastName }}</div>
      </div>
      <div class="row q-gutter-md items-center">
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
      </div>
    </div>

    <!-- Search -->
    <div class="q-mt-sm q-mb-sm">
      <q-input
        class="thick-border"
        dense
        color="primary"
        outlined
        v-model="searchText"
        label="Search Patrick Phandera's Lessons"
        style="width: 100%"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Subject Chips (from backend) -->

    <!-- Lessons -->
    <div class="row q-col-gutter-md grid-auto">
      <LessonFirstCard v-for="lesson in filteredLessons" :key="lesson.id" :lesson="lesson" />
      <div v-if="filteredLessons.length === 0" class="col-12 text-center text-grey-7 q-mt-xl">
        No lessons found.
      </div>
    </div>
  </q-page>
</template>

<script>
import LessonFirstCard from '../../components/LessonFirstCard.vue'
import lessonsService from '../../services/lessons.service'
import subjectsService from '../../services/subjects.service'
import levelsService from '../../services/levels.service'
import { useRoute } from 'vue-router'
export default {
  props: { user: {
    type: Object,
    required: true
  }},
  components: {
    LessonFirstCard,
  },
  name: 'IndexPage',

  data() {
     const route = useRoute()
    return {
      id:route.params.authId,
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
          lessonsService.getLessonsByAuthor(this.id),
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
