<template>

  <q-table :rows="lessons" :columns="columns" color="primary" row-key="id" :loading="loading" class="full-width">
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <!-- Actions column -->
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <div class="row gap">
          <q-btn flat dense size="sm" color="primary" icon="visibility" @click="viewSections(props.row)">
            <q-tooltip>View Sections</q-tooltip>
          </q-btn>
          <q-btn flat dense size="sm" color="warning" icon="edit" @click="updateLesson(props.row)">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn flat dense size="sm" color="negative" icon="delete" @click="deleteLesson(props.row.id)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </div>
      </q-td>
    </template>
  </q-table>

  <!-- Sections Dialog -->
  <q-dialog v-model="showSectionsDialog" full-height full-width>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Lesson Sections: {{ selectedLesson?.title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="showSectionsDialog = false" />
      </q-card-section>

      <q-card-section class="scroll">
        <q-list bordered separator v-if="selectedLesson?.sections?.length">
          <q-item v-for="(section, index) in selectedLesson.sections" :key="index">
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ section.title }}</q-item-label>
              <q-item-label caption>Type: {{ section.type }}</q-item-label>
              <q-item-label v-if="section.type === 'video'" caption>
                Duration: {{ formatDuration(section.duration) }}
              </q-item-label>
              <q-item-label v-if="section.type === 'document'" caption>
                Pages: {{ section.pageCount }}
              </q-item-label>
              <q-item-label v-if="section.type === 'quiz'" caption>
                Quiz Type: {{ section.quiz?.type }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-center q-pa-lg text-grey">
          No sections available
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted } from 'vue'
import RestService from 'src/services/rest.service.js'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const loading = ref(true)
    const lessons = ref([])
    const showSectionsDialog = ref(false)
    const selectedLesson = ref(null)

    const columns = [
      {
        name: 'title',
        required: true,
        label: 'Title',
        align: 'left',
        field: 'title',
        sortable: true
      },
      {
        name: 'description',
        label: 'Description',
        align: 'left',
        field: 'description',
        style: 'max-width: 300px',
        classes: 'ellipsis'
      },
      {
        name: 'sectionsCount',
        label: 'Sections',
        align: 'center',
        field: row => row.sections?.length || 0,
        sortable: true
      },
      {
        name: 'createdAt',
        label: 'Created',
        align: 'left',
        field: 'createdAt',
        format: val => new Date(val).toLocaleDateString(),
        sortable: true
      },
      {
        name: 'actions',
        label: 'Actions',
        align: 'center',
        field: 'actions'
      }
    ]

    // Fetch lessons from API
    const fetchLessons = async () => {
      try {
        loading.value = true
        // Endpoint: http://localhost:9000/api/lessons
        const response = await RestService.get('/lessons')
        console.log('Lessons response:', response)

        // Handle both direct array and wrapped response
        if (Array.isArray(response)) {
          lessons.value = response
        } else if (response?.data && Array.isArray(response.data)) {
          lessons.value = response.data
        } else if (response?.items && Array.isArray(response.items)) {
          lessons.value = response.items
        } else {
          console.warn('Unexpected response format:', response)
          lessons.value = []
        }

        console.log('Lessons loaded:', lessons.value.length)
      } catch (error) {
        console.error('Failed to fetch lessons:', error)
        $q.notify({
          type: 'negative',
          message: `Failed to load lessons: ${error.message}`
        })
        lessons.value = []
      } finally {
        loading.value = false
      }
    }

    // View sections of a lesson
    const viewSections = (lesson) => {
      selectedLesson.value = lesson
      showSectionsDialog.value = true
    }

    // Update lesson
    const updateLesson = (lesson) => {
      $q.notify({
        type: 'info',
        message: `Update lesson: ${lesson.title}`
      })
      // TODO: Navigate to edit page or open edit dialog
    }

    // Delete lesson
    const deleteLesson = (id) => {
      $q.dialog({
        title: 'Delete Lesson',
        message: 'Are you sure you want to delete this lesson?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          loading.value = true
          await RestService.delete(`/lessons/${id}`)
          $q.notify({
            type: 'positive',
            message: 'Lesson deleted successfully'
          })
          fetchLessons()
        } catch (error) {
          console.error('Failed to delete lesson:', error)
          $q.notify({
            type: 'negative',
            message: 'Failed to delete lesson'
          })
          loading.value = false
        }
      })
    }

    // Format duration from seconds
    const formatDuration = (seconds) => {
      if (!seconds) return '0s'
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}m ${secs}s`
    }

    onMounted(() => {
      fetchLessons()
    })

    return {
      loading,
      lessons,
      columns,
      showSectionsDialog,
      selectedLesson,
      viewSections,
      updateLesson,
      deleteLesson,
      formatDuration
    }
  }
}
</script>

<style scoped>
.gap {
  gap: 4px;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scroll {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
