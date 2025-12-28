<template>
  <div class="">
    <!-- {{ channels }} -->
    <q-list class="row border">
      <q-list class="col-2 border q-mt-sm">
        <q-list style="max-width: 318px" class="q-mt-md" separator>
          <q-item>
            <ChannelCreateDialog v-model="showChannelDialog" @success="handleChannelCreated" />
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>All Channels</q-item-label>
              <q-item-label caption>View All Channels</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="mdi-chevron-right" />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Specific Channels</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="mdi-chevron-down" />
            </q-item-section>
          </q-item>



          <q-item clickable v-ripple v-for="channel in channels" v-bind:key="channel.id">
            <q-item-section>
              <q-item-label caption class="text-black">{{ channel.title }}</q-item-label>
              <q-item-label caption
                >{{ channel.description }} | <q-chip dense class="text-caption">{{ channel.timeAgo }}</q-chip>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="mdi-chevron-right" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-list>
      <q-list class="col-10 q-pt-sm" bordered>
        <div class="row justify-between q-px-md">
          <div class="text-body1 flex items-center">Groups</div>
          <div>
            <div class="q-mb-sm row q-col-gutter-md items-center">
              <div></div>
              <div><q-btn no_caps class="text-capitalize">+ New Group</q-btn></div>

              <q-input dense outlined label="Search Groups" prepend="mdi-magnify">
                <template v-slot:prepend>
                  <q-icon name="mdi-magnify"></q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <q-page class="q-px-md">
          <div class="row q-col-gutter-md grid-auto">
            <ChannelCard v-for="quiz in quizzes" v-bind:key="quiz.id" :quiz="quiz"></ChannelCard>
          </div>
          <!-- <CreateQuizModal></CreateQuizModal> -->
        </q-page>
      </q-list>
    </q-list>
  </div>
</template>
<script>
import { ref } from 'vue'
import ChannelCreateDialog from '../components/ChannelCreateDialog.vue'
import { defineComponent } from 'vue'
import ChannelCard from '../components/ChannelCard.vue'
// import CreateQuizModal from '../components/CreateQuizModal.vue'
import quizzesService from 'src/services/quizzes.service'
import channelsService from 'src/services/channels.service'
export default defineComponent({
  name: 'ChannelsPage',
  components: {
    ChannelCard,
    //  CreateQuizModal
    ChannelCreateDialog,
  },
  data() {
    const panel = ref('available')
    const showChannelDialog = ref(false)

    const unattemptedCount = 6
    const completedCount = 3
    const quizzes = ref([])
    const channels = ref([])
    return {
      showChannelDialog,
      panel,
      unattemptedCount,
      completedCount,
      quizzes,
      channels,
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async handleChannelCreated() {},
    async loadData() {
      this.channels = await channelsService.list()
      this.quizzes = await quizzesService.list()
    },
  },
})
</script>
