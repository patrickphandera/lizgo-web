<template>
  <q-layout view="hHh Lpr lff">
    <q-header class="bg-primary" elevated>
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          size="md"
          color="white"

        />
        <div class="text-weight-medium text-body1 text-capitalize text-white">Lizgo Learning</div>

        <q-toolbar-title class="text-weight-bold text-capitalize text-h6"></q-toolbar-title>

        <div>
          <div>
            <personal-chat-dialog v-model="open" :conversation-id="conversationId" />
            <q-btn size="12px"  unelevated round icon="forumn"  @click="open = true" >
              <q-badge color="red" floating>4</q-badge>
            </q-btn>
            <q-btn flat size="12px" color="white" round icon="notifications"  unelevated>
              <q-badge color="red" floating>4</q-badge>
            </q-btn>

            <q-btn unelevated>
              <q-avatar size="md" color="white" class="text-caption shadow-1 text-black" clickable> p </q-avatar>
              <q-menu>
                <q-list style="min-width: 200px">
                  <q-item clickable>
                    <q-item-section>Student </q-item-section>
                    <q-item-section avatar><q-icon name="unfold_more"></q-icon></q-item-section>
                    <q-menu>
                      <q-list style="min-width: 200px">
                        <q-item clickable>
                          <q-item-section>Teacher </q-item-section>
                          <q-item-section avatar
                            ><q-icon name="keyboard_arrow_up"></q-icon
                          ></q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                  <q-item clickable class="bg-negative text-white q-px-md">
                    <q-item-section>Logout</q-item-section>
                    <q-item-section avatar><q-icon name="logout"></q-icon></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>
      <q-drawer
        v-model="drawer"
        show-if-above

        :mini="miniState"
        @mouseenter="miniState = false"
        @mouseleave="miniState = true"
        mini-to-overlay

        :width="200"
        :breakpoint="500"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding class="q-mt-md">

            <q-item clickable v-ripple>

              <q-item-section avatar>
                <q-icon name="mdi-home" />
              </q-item-section>

              <q-item-section>
                Home
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="mdi-youtube" />
              </q-item-section>

              <q-item-section>
                Lessons
              </q-item-section>
            </q-item>

            <q-item active clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="mdi-crowd" />
              </q-item-section>

              <q-item-section>
                Channels
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>

              <q-item-section>
                Settings
              </q-item-section>
            </q-item>

            <!-- <q-separator /> -->

          </q-list>
        </q-scroll-area>
      </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'
// import AddLessonPage from 'src/components/AddLessonPage.vue'

const linksList = [
  {
    title: 'Home',
    icon: 'home',
    link: '/home',
  },
  {
    title: 'Lessons',
    icon: 'mdi-youtube',
    link: '/lessons',
  },
  {
    title: 'Quizes',
    icon: 'mdi-help-circle',
    link: '/quizzes',
  },
  {
    title: 'Discussions',
    icon: 'mdi-account-group',
    link: '/discussions',
  },
]
import { ref } from 'vue'
import PersonalChatDialog from 'src/components/PersonalChatDialog.vue'
export default defineComponent({
  name: 'MainLayout',

  components: {
    // AddLessonPage,

    PersonalChatDialog,
  },

  data() {
    return {
      miniState: ref(true),
      open: false,
      conversationId: '694f4edcf2566fb1b6d36778',
      categories: ['All'],
      levels: ['All'],
      linksList,
      leftDrawerOpen: false,
    }
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
  },
})
</script>
<style scoped>
.custom-outline.q-field--outlined .q-field__control:before {
  border-color: blue;
}

.custom-outline.q-field--outlined.q-field--focused .q-field__control:after {
  border-color: green;
}
</style>
