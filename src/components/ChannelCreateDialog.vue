<template>
  <div>
    <q-btn label="Create New Channel" class="text-capitalize width-full" color="primary" @click="showCreateDialog = true" />
    <q-dialog v-model="showCreateDialog">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Create Channel</div>
        </q-card-section>
        <q-card-section>
          <ChannelCreateForm
            @success="onChannelCreated"
            @cancel="showCreateDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChannelCreateForm from './ChannelCreateForm.vue'

const showCreateDialog = ref(false)

function onChannelCreated(channel) {
  console.log('New channel:', channel)
  showCreateDialog.value = false
  // Optionally refresh channel list
}
</script>
