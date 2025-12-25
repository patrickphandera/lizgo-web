<template>
  <q-layout view="lHh Lpr lff">
    <q-header class="bg-white shadow-1" bordered>
      <q-toolbar>
        <q-btn flat round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" size="md" class="text-black" />
        <div class="text-weight-medium text-h6 text-capitalize text-primary">
          Admin Panel
        </div>

        <q-toolbar-title class="text-weight-bold text-capitalize text-h6 "></q-toolbar-title>



        <!-- <div class="absolute-center row items-center q-gutter-md q-pt-md" style="max-width: 900px; width: 100%;">
          <q-card class="shadow-0 q-mt-md " style="flex: 2; min-width: 300px;">
            <q-input dense outlined v-model="text" label="Search Lessons" style="width: 100%;">
              <template v-slot:prepend>
                <q-icon dense unelevated name="
                  search" />
              </template>
            </q-input>
          </q-card>
        </div> -->
        <div>

          <div>


            <q-btn color="grey-1" round icon="notifications" class="q-mx-sm text-black" unelevated>
              <q-badge color="red" floating>4</q-badge>
            </q-btn>

            <q-btn outline>
              <q-avatar color="primary" class="text-sub-title shadow-1" clickable>
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
    <q-drawer class="shadow-2" :width="200" behavior="desktop" v-model="leftDrawerOpen" show-if-above>
      <q-list class="row justify-center q-mt-xs q-mb-xs">
        <q-avatar class="shadow-3 q-mb-md ">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
      </q-list>
      <!-- <q-separator class="q-mx-lg shadow-3"></q-separator> -->
      <q-list>


        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
      <!-- <q-list class="">
        <q-item-label header>Essential Actions </q-item-label>
      </q-list> -->
      <!-- <AddLessonPage></AddLessonPage> -->
    </q-drawer>

    <q-page-container>


      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import EssentialLink from 'components/AdminEssentialLink.vue'
// import AddLessonPage from 'src/components/AddLessonPage.vue'

const linksList = [
  {
    title: 'Home',
    icon: 'home',
    link: '/admin',
  },
  {
    title: 'Students',
    icon: 'mdi-account-multiple',
    link: '/admin/students',
  },
  {
    title: 'Curriculums',
    icon: 'mdi-currency-eth',
    link: '/admin/curriculums',
  },
  {
    title: 'Levels',
    icon: 'mdi-filter-variant',
    link: '/admin/levels',
  },
  {
    title: 'Subjects',
    icon: 'mdi-text-long',
    link: '/admin/subjects',
  },
  {
    title: 'Topics',
    icon: 'mdi-text-box-multiple',
    link: '/admin/topics',
  },
  {
    title: 'Lessons',
    icon: 'mdi-youtube',
    link: '/admin/lessons',
  },
  {
    title: 'Quizzes',
    icon: 'mdi-help-circle',
    link: '/admin/quizzes',
  },
  {
    title: 'Discussions',
    icon: 'mdi-account-group',
    link: '/admin/discussions',
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    // AddLessonPage,
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
