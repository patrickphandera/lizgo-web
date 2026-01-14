<template>
  <q-card class="q-pa-xs">
     <div class="q-pa-sm  row justify-between">
      <div class="text-h6">Recent lessons</div>
      <div>
        <q-icon size="sm" name="mdi-list-status"></q-icon>
      </div>
     </div>
    <q-table
      style="height: 200px"
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="id"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    />
  </q-card>
</template>

<script>
import { ref } from 'vue'

// Define your new columns
const columns = [
  {
    name: 'lesson',
    label: 'Lesson',
    field: 'lesson',
    align: 'left',
    sortable: true
  },
  {
    name: 'teacher',
    label: 'Teacher',
    field: 'teacher',
    sortable: true
  },
  {
    name: 'startedDate',
    label: 'Started',
    field: 'startedDate',
    sortable: true,
    format: val => val ? new Date(val).toLocaleDateString() : '—'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'finished',
    sortable: true,
    format: val => val ? 'Finished' : 'Not finished'
  }
]

// Generate sample data
let rows = []
const lessons = ['Math', 'Physics', 'Chemistry', 'Biology', 'History']
const teachers = ['Mr. Smith', 'Ms. Johnson', 'Dr. Lee', 'Prof. Garcia', 'Mrs. Kim']

for (let i = 0; i < 500; i++) {
  const isFinished = Math.random() > 0.3
  rows.push({
    id: i,
    lesson: lessons[i % lessons.length],
    teacher: teachers[i % teachers.length],
    startedDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000), // last 90 days
    finished: isFinished,
    avgGrade: isFinished ? Math.floor(60 + Math.random() * 40) : null // 60–100 if finished
  })
}

export default {
  setup() {
    return {
      columns,
      rows,
      pagination: ref({
        rowsPerPage: 0 // disables paging; virtual scroll handles rendering
      })
    }
  }
}
</script>
