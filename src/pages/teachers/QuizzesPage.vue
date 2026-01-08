<template>
  <q-page class="q-pa-md">
    <div class="text-h6 row justify-between items-center">
      Quizzes
      <div>
        <q-btn color="primary" class="text-capitalize" @click="openNew">+ New Quiz</q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col-12">
        <q-select v-model="filterPublished" :options="publishedOptions" option-label="label" option-value="value"
          label="Filter by status" dense outlined clearable />
        <q-table :rows="filteredQuizzes" :columns="columns" row-key="id" class="q-mt-md">
          <template v-slot:body-cell-actions="props">
            <q-td align="right">
              <q-btn dense flat icon="visibility" @click="viewItem(props.row)"></q-btn>
              <q-btn dense flat icon="edit" @click="editItem(props.row)"></q-btn>
              <q-btn dense flat icon="delete" color="negative" @click="removeItem(props.row)"></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="dialog.show">
      <q-card style="min-width: 400px; max-width: 700px">
        <q-card-section class="row justify-between">
          <div class="text-h6">{{ dialog.mode === 'edit' ? 'Edit' : 'New' }} Quiz</div>
          <q-btn flat icon="close" v-close-popup @click="closeDialog" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="row q-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-input v-model="form.title" label="Title" dense outlined />
            </div>
            <div class="col-12">
              <q-input v-model="form.description" type="textarea" label="Description" dense outlined />
            </div>
            <div class="col-12">
              <q-select v-model="form.difficulty" :options="difficultyOptions" option-label="label" option-value="value"
                label="Difficulty" dense outlined />
            </div>
            <div class="col-12">
              <q-input v-model.number="form.passingScore" type="number" label="Passing Score (%)" dense outlined />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="closeDialog" class="text-capitalize" />
          <q-btn color="primary" label="Save" @click="save" class="text-capitalize" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="viewDialog.show">
      <q-card style="min-width: 300px">
        <q-card-section class="row justify-between">
          <div class="text-h6">View Quiz</div>
          <q-btn flat icon="close" v-close-popup @click="viewDialog.show = false" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div><strong>Title:</strong> {{ viewDialog.item.title }}</div>
          <div><strong>Description:</strong> {{ viewDialog.item.description }}</div>
          <div><strong>Difficulty:</strong> {{ viewDialog.item.difficulty }}</div>
          <div><strong>Passing Score:</strong> {{ viewDialog.item.passingScore }}%</div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Close" class="text-capitalize" v-close-popup @click="viewDialog.show = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import quizzesService from 'src/services/quizzes.service.js'

export default defineComponent({
  name: 'QuizzesAdminPage',
  setup() {
    const quizzes = ref([])
    const filterPublished = ref(null)

    const publishedOptions = [
      { label: 'All', value: 'ALL' },
      { label: 'Published', value: 'true' },
      { label: 'Draft', value: 'false' }
    ]

    const difficultyOptions = [
      { label: 'Easy', value: 'easy' },
      { label: 'Medium', value: 'medium' },
      { label: 'Hard', value: 'hard' }
    ]

    const columns = [
      { name: 'title', label: 'Title', field: row => row.title, align: 'left' },
      { name: 'difficulty', label: 'Difficulty', field: 'difficulty' },
      { name: 'passingScore', label: 'Passing Score', field: 'passingScore' },
      { name: 'published', label: 'Published', field: 'published' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
    ]

    const dialog = ref({ show: false, mode: 'new', id: null })
    const viewDialog = ref({ show: false, item: {} })

    const form = ref({ title: '', description: '', difficulty: 'medium', passingScore: 60 })

    const load = async () => {
      try {
        const res = await quizzesService.list()
        console.log('Quizzes loaded:', res)
        if (Array.isArray(res)) {
          quizzes.value = res
        } else if (res && Array.isArray(res.data)) {
          quizzes.value = res.data
        } else if (res && Array.isArray(res.items)) {
          quizzes.value = res.items
        } else {
          quizzes.value = []
        }
      } catch (err) {
        console.error('Failed to load quizzes', err)
        quizzes.value = []
      }
    }

    onMounted(load)

    const filteredQuizzes = computed(() => {
      const list = Array.isArray(quizzes.value) ? quizzes.value : []
      if (!filterPublished.value || filterPublished.value === 'ALL') return list
      const published = filterPublished.value === 'true'
      return list.filter(q => q.published === published)
    })

    function openNew() {
      dialog.value = { show: true, mode: 'new', id: null }
      form.value = { title: '', description: '', difficulty: 'medium', passingScore: 60 }
    }

    function closeDialog() {
      dialog.value.show = false
    }

    function viewItem(row) {
      viewDialog.value = { show: true, item: row }
    }

    function editItem(row) {
      dialog.value = { show: true, mode: 'edit', id: row.id }
      form.value = { title: row.title || '', description: row.description || '', difficulty: row.difficulty || 'medium', passingScore: row.passingScore || 60 }
    }

    async function removeItem(row) {
      const id = row.id
      if (!id) return
      if (!confirm('Delete this quiz?')) return
      try {
        await quizzesService.delete(id)
        await load()
      } catch (err) {
        console.error('Failed to delete', err)
      }
    }

    async function save() {
      try {
        if (dialog.value.mode === 'edit' && dialog.value.id) {
          await quizzesService.update(dialog.value.id, form.value)
        } else {
          await quizzesService.create(form.value)
        }
        dialog.value.show = false
        await load()
      } catch (err) {
        console.error('Failed to save quiz', err)
      }
    }

    return {
      quizzes,
      columns,
      dialog,
      form,
      openNew,
      save,
      editItem,
      removeItem,
      viewItem,
      viewDialog,
      publishedOptions,
      difficultyOptions,
      filterPublished,
      filteredQuizzes,
      closeDialog
    }
  }
})
</script>
