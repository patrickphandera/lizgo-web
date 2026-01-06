<!-- eslint-disable vue/valid-v-for -->
<template>
  <q-page class="q-mx-md q-mt-md">
    <div class="text-h6 flex justify-between">
      <div class="flex">
        <router-link :to="`/students/lessons`" style="text-decoration: none; color: inherit">
            <q-btn
            size="sm"
              class="text-capitalize shadow-0 row"
              @click="$router.push({ path: '/lessons' })"
            >
            <q-icon  size="24px" name="mdi-keyboard-backspace"></q-icon>  <span class="text-body1"></span>
            </q-btn>

        </router-link>
        <span class="q-mx-md text-center text-body1">{{ lesson.title }}</span>
      </div>
      <div>
        <AddCredit></AddCredit>
      </div>
    </div>
    <div class="row q-my-sm">
      <div class="col-10 q-pr-md">
        <q-card v-if="!isNextBtnActive" class="my-card video row justify-center">
          <img src="/premium.jpeg" class="video"
        /></q-card>
        <div v-else>
          <LearningSection
            v-if="!isLessonComplete && currentSection"
            :section="currentSection"
            :title="lesson.title"
          >
          </LearningSection>

          <q-card
            v-else-if="isLessonComplete"
            class="q-pa-xl row justify-center items-center text-center video"
          >
            <div>
              <q-icon name="check_circle" color="primary" size="64px" />
              <div class="text-h6 q-mt-md">Lesson completed 🎉</div>
              <div class="text-caption">You’ve finished all sections</div>
            </div>
          </q-card>
        </div>
        <div class="row justify-between q-mt-sm ">
          <div>
            <LessonCommentModal :conversationId="lesson.conversationId"></LessonCommentModal>
          </div>
          <div>
            <q-btn
              icon="mdi-skip-previous"
              :disable="currentSectionIndex === 0"
              @click="previousSection"
            />

            <q-btn
              v-if="isNextBtnActive"
              icon="mdi-skip-next"
              :disable="isLessonComplete"
              @click="nextSection"
            />
            <q-btn v-if="!isNextBtnActive" icon="mdi-skip-next" disable />
          </div>
        </div>

      </div>

      <q-card class="col-2 q-px-md shadow-1">
        <q-timeline color="grey-12">
          <q-timeline-entry
            v-for="(section, index) in lesson.sections"
            :key="section.id"
            :icon="getSectionIcon(section, index)"
            :color="getSectionColor(section, index)"
          >
            <template #title>
              <div class="text-body2 text-black">
                {{ section.title }}
              </div>
            </template>

            <template #subtitle>
              <div class="text-caption text-capitalize">
                {{ section.description }}
              </div>
            </template>
          </q-timeline-entry>
        </q-timeline>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { Notify } from 'quasar'
import LearningSection from '../components/LearningSection.vue'
import { defineComponent } from 'vue'
import LessonsService from '../services/lessons.service'
import AddCredit from '../components/AddCredit.vue'
import LessonCommentModal from '../components/LessonCommentModal.vue'
export default defineComponent({
  name: 'IndexPage',
  components: { LearningSection, AddCredit,LessonCommentModal },

  data() {
    return {
      checkingOUt: false,
      text: '',
      isNextBtnActive: true,
      completedSections: new Set(
        JSON.parse(localStorage.getItem(`lesson-${this.$route.params.id}-progress`) || '[]'),
      ),

      lesson: {
        title: '',
        sections: [],
      },
      currentSection: null,
      currentSectionIndex: 0,
    }
  },
  watch: {
    completedSections: {
      handler(newSet) {
        localStorage.setItem(
          `lesson-${this.$route.params.id}-progress`,
          JSON.stringify([...newSet]),
        )
      },
      deep: true,
    },
  },
  async mounted() {
    const lessonId = this.$route.params.id

    try {
      const lesson = await LessonsService.getLessonDetails(lessonId)

      this.lesson = lesson
      this.currentSectionIndex = 0
      console.log('Loaded lesson:', lesson)
      await this.loadSection()
    } catch (err) {
      Notify.create({
        type: 'negative',
        message: `Error fetching lesson: ${err}`,
      })
      console.error('Error fetching lesson:', err)
    }
  },
  computed: {
    isLessonComplete() {
      return this.currentSectionIndex >= this.lesson.sections.length
    },
  },
  methods: {
    isCompleted(section) {
      return this.completedSections.has(section.id)
    },

    isCurrent(index) {
      return index === this.currentSectionIndex
    },

    getSectionIcon(section, index) {
      if (this.isCompleted(section)) return 'check_circle'
      if (this.isCurrent(index)) return 'play_circle'
      return 'lock'
    },

    getSectionColor(section, index) {
      if (this.isCompleted(section)) return 'primary'
      if (this.isCurrent(index)) return 'primary'
      return 'grey-6'
    },

    async loadSection() {
      try {
        if (this.currentSectionIndex >= this.lesson.sections.length) return
        const lessonId = this.$route.params.id
        const section = this.lesson.sections[this.currentSectionIndex]

        const sectionDetails = await LessonsService.getLessonDetails(
          `${lessonId}/section/${section.id}`,
        )

        this.currentSection = {
          ...section,
          ...sectionDetails,
        }
        this.isNextBtnActive = true
      } catch (err) {
        this.isNextBtnActive = false
        Notify.create({
          type: 'negative',
          message: `${err}`,
        })
        console.error('Error loading section:', err)
      }
    },
    async nextSection() {
      // mark current as completed
      this.completedSections.add(this.lesson.sections[this.currentSectionIndex].id)

      // Move to next section
      this.currentSectionIndex++

      // Check if we've completed all sections
      if (this.currentSectionIndex >= this.lesson.sections.length) {
        this.currentSection = null
        return
      }

      // Load the next section
      await this.loadSection()
    },
    async previousSection() {
      if (this.currentSectionIndex === 0) return

      this.currentSectionIndex--
      await this.loadSection()
    },
  },
})
</script>
<style scoped>
.video {
  height: 450px;
  width: auto;
}
</style>
