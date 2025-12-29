<template>
  <div class="q-pa-md q-gutter-sm">

    <q-btn label="Messages" class="text-capitalize " color="primary" @click="fixed = true"/>
    <q-dialog persistent full-height v-model="fixed">
      <q-card>
        <q-card-section class="row justify-between">
          <div class="text-h6">Messages</div>
          <q-btn flat dense icon="close" @click="fixed = false" />
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 66vh" class="scroll">
          <p v-for="n in 15" :key="n">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" >
        <q-input  label="Write Message.." outlined class="full-width text-caption" ><template v-slot:append><q-btn color="primary" icon="mdi-arrow-right-thin"></q-btn></template></q-input>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      basic: ref(false),
      fixed: ref(false)
    }
  }
}
</script>
