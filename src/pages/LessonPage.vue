<!-- eslint-disable vue/valid-v-for -->
<template>
  <q-page class="q-mx-md q-mt-md ">
    <div class="text-h6 flex justify-between">
      <div class="flex">
        <router-link :to="`/lessons`" style="text-decoration: none; color: inherit;">
          <q-card style="width: 60px;" class="shadow-0">
            <q-btn icon="arrow_back" class="text-capitalize shadow-0" @click="$router.push({ path: '/lessons' })">

            </q-btn>
          </q-card>
        </router-link> <span class="q-mx-md text-center text-body1">{{ lesson.title }}</span>
      </div>
      <div>
        <q-btn class="text-capitalize shadow-0" label="Add Credits" icon-right="add_shopping_cart"></q-btn>
      </div>

    </div>
    <div class="row q-my-md">
      <div class="col-10 q-pr-md">

        <LearningSection v-if="!isLessonComplete && currentSection" :section="currentSection" :title="lesson.title">
        </LearningSection>
        <q-card v-else-if="isLessonComplete" class="q-pa-xl row justify-center items-center text-center video">
          <div>
            <q-icon name="check_circle" color="primary" size="64px" />
            <div class="text-h6 q-mt-md">Lesson completed 🎉</div>
            <div class="text-caption">You’ve finished all sections</div>
          </div>
        </q-card>

        <div class="row justify-end q-mt-sm">
          <q-btn icon="mdi-skip-previous" :disable="currentSectionIndex === 0" @click="previousSection" />

          <q-btn icon="mdi-skip-next" :disable="isLessonComplete" @click="nextSection" />
        </div>
        <q-card bordered flat class="
            q-mt-md">
          <q-card-section class="text-h6">
            <div>
              Comments
            </div>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-input outlined v-model="text" class="q-mt-sm" label="New message" dense />

              </q-item-section>
            </q-item>
            <q-item v-for="i in [1, 2]" v-bind:key="i">
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                </q-avatar>
              </q-item-section>


              <q-item-section>
                <q-item-label caption>@PatrickPhandera</q-item-label>
                <q-item-label class="text-caption"> Maize is a crucial crop in Malawi, serving as both a staple food and
                  a key driver of the national economy. Its production supports the livelihoods of millions of
                  smallholder farmers and contributes significantly to food security. Understanding the importance of
                  maize helps in promoting sustainable agricultural practices and shaping policies that strengthen
                  Malawi’s agricultural sector.</q-item-label>

              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>


      </div>

      <q-card class="col-2 q-px-md shadow-1">
        <q-timeline color="grey-12">
          <q-timeline-entry v-for="(section, index) in lesson.sections" :key="section.id"
            :icon="getSectionIcon(section, index)" :color="getSectionColor(section, index)">
            <template #title>
              <div class="text-body2 text-black">
                {{ section.title }}
              </div>
            </template>

            <template #subtitle>
              <div class="text-caption">
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
import LearningSection from '../components/LearningSection.vue'
import { defineComponent } from 'vue'
import LessonsService from '../services/lessons.service'

export default defineComponent({
  name: 'IndexPage',
  components: { LearningSection },

  data() {
    return {
      text: '',
      completedSections: new Set(
        JSON.parse(localStorage.getItem(`lesson-${this.$route.params.id}-progress`) || '[]')
      ),

      lesson: {

        title: '',
        sections: []
      },
      currentSection: null,
      currentSectionIndex: 0
    }
  },
  watch: {
    completedSections: {
      handler(newSet) {
        localStorage.setItem(
          `lesson-${this.$route.params.id}-progress`,
          JSON.stringify([...newSet])
        )
      },
      deep: true
    }
  }
  ,
  async mounted() {
    const lessonId = this.$route.params.id

    try {
      const lesson = await LessonsService.getLessonDetails(lessonId)

      this.lesson = lesson
      this.currentSectionIndex = 0
      await this.loadSection()
    } catch (err) {
      console.error('Error fetching lesson:', err)
    }
  },
  computed: {
    isLessonComplete() {
      return this.currentSectionIndex >= this.lesson.sections.length
    }
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
      if (this.currentSectionIndex >= this.lesson.sections.length) return
      const lessonId = this.$route.params.id
      const section = this.lesson.sections[this.currentSectionIndex]

      const sectionDetails = await LessonsService.getLessonDetails(
        `${lessonId}/section/${section.id}`
      )

      this.currentSection = {
        ...section,
        ...sectionDetails
      }
    },
    async nextSection() {
      // mark current as completed
      this.completedSections.add(
        this.lesson.sections[this.currentSectionIndex].id
      )

      // Move to next section
      this.currentSectionIndex++

      // Check if we've completed all sections
      if (this.currentSectionIndex >= this.lesson.sections.length) {
        this.currentSection = null
        return
      }

      // Load the next section
      await this.loadSection()
    }
    ,

    async previousSection() {
      if (this.currentSectionIndex === 0) return

      this.currentSectionIndex--
      await this.loadSection()
    }
  }

})
</script>
<style scoped>
.video {
  height: 450px;
}
</style>