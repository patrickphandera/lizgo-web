<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-primary" >
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
            <q-btn size="12px" unelevated round icon="forumn">
              <q-badge color="red" floating>4</q-badge>
              <q-menu transition-show="scale" transition-hide="scale">
                <q-list separator style="min-width: 200px" class="q-pb-md">
                  <q-item>
                    <q-item-section class="text-body1"> Messages </q-item-section>
                    <q-item-section avatar>
                      <q-btn flat dense icon="close"></q-btn>
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="open = true" class="column">
                    <q-item-section>
                      <q-item-label class="row justify-between text-caption"
                        >Williams Jere
                        <q-chip square dense class="text-caption" size="sm"
                          >1 Min Ago.</q-chip
                        ></q-item-label
                      >
                      <q-item-label caption class="ellipsis text-body1"
                        >Man, mundithandizako ma quiz aja?</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="open = true">
                    <q-item-section>
                      <q-item-label class="row justify-between"
                        >Williams Jere
                        <q-chip square dense class="text-caption" size="sm"
                          >1 Min Ago.</q-chip
                        ></q-item-label
                      >
                      <q-item-label caption class="ellipsis"
                        >Man, mundithandizako ma quiz aja?</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="open = true">
                    <q-item-section>
                      <q-item-label class="row justify-between"
                        >Williams Jere
                        <q-chip square dense class="text-caption" size="sm"
                          >1 Min Ago.</q-chip
                        ></q-item-label
                      >
                      <q-item-label caption class="ellipsis"
                        >Man, mundithandizako ma quiz aja?</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn flat size="12px" color="white" round icon="notifications" unelevated>
              <q-badge color="red" floating>4</q-badge>
            </q-btn>

            <q-btn unelevated>
              <q-avatar size="md" color="white" class="text-caption shadow-1 text-black" clickable>
                p
              </q-avatar>
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
        <q-list  class="">
          <q-item clickable v-ripple v-for="(link,index) in linksList" v-bind:key="index" :to="link.link">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>

            <q-item-section> {{ link.title }} </q-item-section>
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
    link: '/students/home',
  },
  {
    title: 'Lessons',
    icon: 'mdi-youtube',
    link: '/students/lessons',
  },
  {
    title: 'Channels',
    icon: 'mdi-crowd',
    link: '/students/channels',
  },
   {
    title: 'Subjects',
    icon: 'list',
    link: '/students/subjects',
  },
    {
    title: 'Settings',
    icon: 'mdi-cog',
    link: '/students/settings',
  }
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
