<template>
  <q-page class="q-px-md q-mt-md q-mb-md">
    <div class="text-h6 row justify-between items-center">
      Subjects
      <q-btn color="primary" class="text-capitalize" @click="openNew">
        + New Subject
      </q-btn>
    </div>

    <!-- Filter -->
    <div class="row q-mt-md">
      <div class="col-12">
        <q-select v-model="filterCurriculum" :options="curriculumOptions" option-label="title" option-value="id"
          emit-value map-options label="Filter by Curriculum" dense outlined clearable />

        <q-table class="q-mt-md" :rows="filteredSubjects" :columns="columns" row-key="id">
          <template #body-cell-actions="props">
            <q-td align="right">
              <q-btn dense flat icon="visibility" @click="viewItem(props.row)" />
              <q-btn dense flat icon="edit" @click="editItem(props.row)" />
              <q-btn dense flat icon="delete" color="negative" @click="removeItem(props.row)" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Create / Edit Dialog -->
    <q-dialog v-model="dialog.show">
      <q-card style="min-width: 400px; max-width: 700px">
        <q-card-section class="row justify-between">
          <div class="text-h6">
            {{ dialog.mode === 'edit' ? 'Edit' : 'New' }} Subject
          </div>
          <q-btn flat icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-gutter-sm">
            <div class="col-12">
              <q-input v-model="form.title" label="Title" dense outlined />
            </div>

            <div class="col-12">
              <q-select v-model="form.levelId" :options="levelOptions" option-label="title" option-value="id" emit-value
                map-options label="Level" dense outlined />
            </div>

            <div class="col-12">
              <q-select v-model="form.curriculumId" :options="curriculumOptions" option-label="title" option-value="id"
                emit-value map-options label="Curriculum" dense outlined />
            </div>

            <div class="col-12">
              <q-input v-model="form.description" type="textarea" label="Description" dense outlined />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Save" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- View Dialog -->
    <q-dialog v-model="viewDialog.show">
      <q-card style="min-width: 300px">
        <q-card-section class="row justify-between">
          <div class="text-h6">View Subject</div>
          <q-btn flat icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div><strong>Title:</strong> {{ viewDialog.item.title }}</div>
          <div><strong>Level:</strong> {{ getLevelTitle(viewDialog.item.levelId) }}</div>
          <div><strong>Curriculum:</strong> {{ getCurriculumTitle(viewDialog.item.curriculumId) }}</div>
          <div class="q-mt-sm">
            <strong>Description:</strong>
            <div>{{ viewDialog.item.description }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import subjectsService from 'src/services/subjects.service'
import levelsService from 'src/services/levels.service'
import curriculaService from 'src/services/curriculums.service'

export default defineComponent({
  name: 'SubjectAdminPage',
  setup() {
    const subjects = ref([])
    const levelOptions = ref([])
    const curriculumOptions = ref([])
    const filterCurriculum = ref(null)

    const dialog = ref({ show: false, mode: 'new', id: null })
    const viewDialog = ref({ show: false, item: {} })

    const form = ref({
      title: '',
      levelId: null,
      curriculumId: null,
      description: ''
    })

    const columns = [
      { name: 'title', label: 'Title', field: 'title', align: 'left' },
      {
        name: 'level',
        label: 'Level',
        field: row =>
          levelOptions.value.find(l => l.id === row.levelId)?.title || '-'
      },
      {
        name: 'curriculum',
        label: 'Curriculum',
        field: row =>
          curriculumOptions.value.find(c => c.id === row.curriculumId)?.title || '-'
      },
      { name: 'description', label: 'Description', field: 'description' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
    ]

    const loadAll = async () => {
      try {
        const [subjectsRes, levelsRes, curriculaRes] = await Promise.all([
          subjectsService.list(),
          levelsService.list(),
          curriculaService.list()
        ])

        subjects.value = subjectsRes?.data ?? subjectsRes ?? []
        levelOptions.value = levelsRes?.data ?? levelsRes ?? []
        curriculumOptions.value = curriculaRes?.data ?? curriculaRes ?? []
      } catch (e) {
        console.error('Load failed', e)
      }
    }

    onMounted(loadAll)

    const filteredSubjects = computed(() => {
      if (!filterCurriculum.value) return subjects.value
      return subjects.value.filter(
        s => s.curriculumId === filterCurriculum.value
      )
    })

    function openNew() {
      dialog.value = { show: true, mode: 'new', id: null }
      form.value = { title: '', levelId: null, curriculumId: null, description: '' }
    }

    function editItem(row) {
      dialog.value = { show: true, mode: 'edit', id: row.id }
      form.value = { ...row }
    }

    function viewItem(row) {
      viewDialog.value = { show: true, item: row }
    }

    async function removeItem(row) {
      if (!row.id || !confirm('Delete this subject?')) return
      await subjectsService.deleteSubject(row.id)
      await loadAll()
    }

    async function save() {
      if (dialog.value.mode === 'edit') {
        await subjectsService.updateSubject(dialog.value.id, form.value)
      } else {
        await subjectsService.createSubject(form.value)
      }

      dialog.value.show = false
      await loadAll()
    }

    const getLevelTitle = id =>
      levelOptions.value.find(l => l.id === id)?.title || '-'

    const getCurriculumTitle = id =>
      curriculumOptions.value.find(c => c.id === id)?.title || '-'

    return {
      columns,
      dialog,
      viewDialog,
      form,
      levelOptions,
      curriculumOptions,
      filterCurriculum,
      filteredSubjects,
      openNew,
      editItem,
      viewItem,
      removeItem,
      save,
      getLevelTitle,
      getCurriculumTitle
    }
  }
})
</script>
