<template>
  <q-layout view="hHh Lpr lff">
    <q-header  class="q-py-xs" elevated>
      <q-toolbar>

        <q-btn flat  round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" size="md" class="text-white" />
        <div class="text-weight-bold q-ml-md text-body1 text-capitalize text-black">




        </div>
        <q-toolbar-title class="text-weight-bold text-white text-capitalize text-overline ">LESSONS</q-toolbar-title>

        <div>

          <div>
            <q-btn color="grey-1" round icon="notifications" class="q-mx-sm text-black" unelevated>
              <q-badge color="red" floating>4</q-badge>
            </q-btn>

            <q-btn flat round>
              <q-avatar round color="white" class="text-sub-title shadow-1 text-primary" clickable>
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
                          <q-item-section avatar><q-icon name="keyboard_arrow_up"></q-icon></q-item-section>
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
    <q-drawer :class="$q.dark.isActive ? 'bg-grey-9 q-mb-md' : 'bg-grey-3 q-mb-md'" bordered :width="140" behavior="mobile" v-model="leftDrawerOpen" show-if-above>

      <q-list class="q-mt-lg">
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
<MyBottomComponent />
    </q-drawer>

    <q-page-container>


      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

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
    title: 'Forums',
    icon: 'mdi-account-group',
    link: '/discussions',
  },
   {
    title: 'Subjects',
    icon: 'mdi-list',
    link: '/subjects',
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  data() {
    return {
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
