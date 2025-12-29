<template>
  <div class="col-12 col-sm-6 col-md-4">
    <q-card>
      <!-- Body -->
      <q-card-section>
        <div class="text-body1 text-weight-medium">
          {{ conversation?.title }}
        </div>

        <div class="text-caption q-mt-xs">
          {{ conversation?.description }}
        </div>
        <div class="q-mt-md">
          <q-chip square text-color="black" flat class="text-caption"> Medium </q-chip>
          <q-chip text-color="black" class="text-caption">
            {{ conversation?.members?.length }} Member
          </q-chip>
          <q-chip square text-color="black" class="text-caption"> 2hr Ago </q-chip>
          <!-- <q-chip square text-color="black" class="text-caption">
            {{ conversation?.members?.length }} Questions
          </q-chip> -->
        </div>
      </q-card-section>

      <!-- <q-separator /> -->

      <!-- Actions -->
      <div class="q-pt-xs q-px-md row justify-between q-pb-md">
        <div class="row q-gutter-sm">
          <q-avatar size="35px" class="shadow-6">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="column">
            <span square class="text-caption">Patrick Phandera</span>
            <span square class="text-caption text-grey-8" dense>30k Followers</span>
            <q-space />
          </div>
        </div>
        <GroupChatModal></GroupChatModal>
      </div>
    </q-card>
  </div>
</template>

<script>
  import GroupChatModal from './GroupChatModal.vue'
import { defineComponent } from 'vue'
import { ref } from 'vue'
export default defineComponent({
  name: 'ChannelCard',
  props: { conversation: Object },
  components: { GroupChatModal },
  setup() {
    return {
      showConversation: ref(false),
    }
  },
})
</script>
