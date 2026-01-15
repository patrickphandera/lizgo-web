<template>
  <q-card class="q-pa-xs">
    <div class="q-pa-sm row justify-between">
      <div class="text-h6">Recent Lessons</div>
      <div><q-icon size="sm" name="mdi-list-status" /></div>
    </div>
    <q-table
      style="height: 200px"
      flat
      bordered
      :rows="tableRows"
      :columns="columns"
      row-key="id"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-action="props">
        <div class="row justify-end">
       <q-btn flat color="primary" icon="mdi-open-in-new" size="sm" @click="handleAction(props.row)" />
      </div></template>
    </q-table>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  lessons: {
    type: Array,
    required: true,
  },
})

const columns = [
  { name: 'title', align: 'left', label: 'Lesson', field: 'title', sortable: true },
  { name: 'lastUpdated', label: 'Last Updated', field: 'lastUpdated', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true },
  { name: 'action',align: 'right', label: 'Action', field: 'action', sortable: true },
]

const tableRows = computed(() => props.lessons.userLesson1)

const pagination = ref({ rowsPerPage: 0 })
</script>
