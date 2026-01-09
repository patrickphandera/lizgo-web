<template>
  <div class="">
    <!-- {{ channels }} -->
    <q-list class="row border">
      <q-list class="col-12 q-pt-sm" bordered>
        <div class="row justify-between q-px-md">
          <div class="text-h6 flex items-center">Channels</div>
          <div>
            <div class="q-mb-sm row q-col-gutter-md items-center">
               <q-input   dense outlined label="Search Channels" prepend="mdi-magnify">
                <template v-slot:prepend>
                  <q-icon name="mdi-magnify"></q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <q-page class="q-px-md">
          <q-list bordered>
            <div  v-for="(channel,index) in channels"
              v-bind:key="channel.id">
              <q-separator v-if="index !== 0"></q-separator>
            <q-expansion-item
              v-ripple="false"

              expand-icon-toggle

              expand-separator
              icon="list"
              :label="channel.title"
              :caption="channel.timeAgo"
            >

              <q-card>
                <q-card-section class="row justify-between">
                  {{ channel.description }}
                  <div>
                    <q-btn
                      label="+ New Group Chat"
                      color="primary"
                      class="text-capitalize"
                      @click="channel.toggle = true"
                    />
                    <GroupConversationCreateDialog
                      v-model="channel.toggle"
                      :channel-id="channel.id"
                      @success="onGroupCreated"
                    ></GroupConversationCreateDialog>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-col-gutter-md grid-auto">
                    <ChannelCard
                    v-bind:key="conversation.id"
                    v-for="conversation in  filterByChannelId(conversations, channel.id)"
                      :conversation="conversation"
                    ></ChannelCard>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            </div>

          </q-list>
        </q-page>
      </q-list>
    </q-list>

  </div>
</template>
<script>
import { ref } from 'vue'
import GroupConversationCreateDialog from '../../components/GroupConversationCreateDialog.vue'
import { defineComponent } from 'vue'
import ChannelCard from '../../components/ChannelCard.vue'
// import CreateQuizModal from '../components/CreateQuizModal.vue'
import channelsService from '../../services/channels.service'
import conversationsService from '../../services/conversations.service'
export default defineComponent({
  name: 'ChannelsPage',
  components: {
    GroupConversationCreateDialog,
    ChannelCard,
  },
  data() {
    const panel = ref('available')
    const showChannelDialog = ref(false)

    const unattemptedCount = 6
    const completedCount = 3
    const conversations = ref([])
    const channels = ref([])
    const filterByChannelId = (list, channelId) => {
      console.log('Filtering conversations for channelId:', channelId, list)
      return list.filter((item) => item.channelId === channelId)
    }
    return {
      filterByChannelId,
      showChannelDialog,
      panel,
      unattemptedCount,
      completedCount,
      conversations,
      channels,
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {

    async handleChannelCreated() {},
    async loadData() {
      const channels = await channelsService.list()

      channels.map((channel) => {
        channel.toggle = false
        return channel
      })
      this.channels = channels
      this.conversations = await conversationsService.list()
    },
  },
})
</script>
