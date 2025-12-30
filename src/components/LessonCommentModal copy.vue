<template>
  <div class="q-gutter-sm">
    <q-btn @click="fixed = true"  class="text-capitalize">
      <q-icon name="mdi-message-badge-outline" size="24px"></q-icon> 24 Comments
    </q-btn>

    <q-dialog persistent full-height  v-model="fixed">
      <q-card class="column no-wrap" style="height: 100%">
        <!-- Header -->
        <q-card-section class="row justify-between">
          <div class="text-h6">Messages</div>
          <q-btn flat dense icon="close" @click="fixed = false" />
        </q-card-section>

        <q-separator />

        <!-- Scrollable Content Area -->
        <q-card-section class="col scroll">

          <q-item v-for="i in 20" :key="i" class="bg-grey-2 rounded-xl q-mb-sm">


            <q-item-section>
              <q-item-label class="text-caption  row items-end">    <q-avatar size="sm" class="q-pr-xs">
                <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
              </q-avatar> @PatrickPhandera</q-item-label>
              <q-item-label class="text-caption q-py-xs">
                Maize is a crucial crop in Malawi, serving as both a staple food and a key driver
                of the national economy. Its production supports the livelihoods of millions of
                smallholder farmers and contributes significantly to food security. Understanding
                the importance of maize helps in promoting sustainable agricultural practices and
                shaping policies that strengthen Malawi's agricultural sector.

              </q-item-label>
               <!-- <q-item-label class="text-caption q-pt-xs">@PatrickPhandera</q-item-label> -->
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-separator />

        <!-- Fixed Bottom Input -->
        <q-card-actions class="q-pa-md">
          <q-input
            label="Write Message.."
            outlined
            class="full-width"
            v-model="message"
          >
            <template v-slot:append>
              <q-btn color="primary" icon="mdi-arrow-right-thin" flat />
            </template>
          </q-input>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LessonCommentModal',
  setup() {
    return {
      basic: ref(false),
      fixed: ref(false),
      text: ref(''),      // For "New message" input
      message: ref('')    // For "Write Message.." input
    }
  }
}
</script>
