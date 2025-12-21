<template>
  <q-page class="q-px-md q-mt-md q-mb-md">
    <!-- HEADER -->
    <div class="text-h6 row justify-between items-center">
      Levels
      <q-btn color="primary" class="text-capitalize" @click="openNew">
        + New Level
      </q-btn>
    </div>

    <!-- FILTER + TABLE -->
    <div class="row q-mt-md">
      <div class="col-12">
        <q-select v-model="filterCurriculum" :options="curriculumOptions" option-label="label" option-value="value"
          label="Filter by curriculum" dense outlined clearable />

        <q-table class="q-mt-md" :rows="filteredLevels" :columns="columns" row-key="id">
          <!-- Curriculum column -->
          <template v-slot:body-cell-curriculum="props">
            <q-td align="right">
              {{ props.row.curriculumId.label }}
            </q-td>
          </template>


          <!-- Actions -->
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

    <!-- CREATE / EDIT DIALOG -->
    <q-dialog v-model="dialog.show">
      <q-card style="min-width: 400px; max-width: 700px">
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">
            {{ dialog.mode === 'edit' ? 'Edit' : 'New' }} Level
          </div>
          <q-btn flat icon="close" @click="closeDialog" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-gutter-sm">
            <div class="col-12">
              <q-input v-model="form.title" label="Title" dense outlined />
            </div>

            <div class="col-12">
              <q-select v-model="form.curriculumId" :options="curriculumOptions.filter(o => o.value !== 'ALL')"
                option-label="label" option-value="value" label="Curriculum" dense outlined />
            </div>

            <div class="col-12">
              <q-input v-model="form.description" type="textarea" label="Description" dense outlined />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancel" class="text-capitalize" @click="closeDialog" />
          <q-btn color="primary" label="Save" class="text-capitalize" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- VIEW DIALOG -->
    <q-dialog v-model="viewDialog.show">
      <q-card style="min-width: 300px">
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">View Level</div>
          <q-btn flat icon="close" @click="viewDialog.show = false" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div><strong>Title:</strong> {{ viewDialog.item.title }}</div>

          <div class="q-mt-sm">
            <strong>Curriculum:</strong>
            {{ curriculumMap[String(viewDialog.item.curriculumId)] || '-' }}
          </div>

          <div class="q-mt-sm">
            <strong>Description:</strong>
            <div>{{ viewDialog.item.description }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Close" class="text-capitalize" @click="viewDialog.show = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import levelsService from 'src/services/levels.service'
import curriculumsService from 'src/services/curriculums.service'

export default defineComponent({
  name: 'LevelAdminPage',

  setup() {
    const levels = ref([])
    const curricula = ref([])
    const filterCurriculum = ref(null)

    const curriculumOptions = ref([])
    const curriculumMap = {}

    const columns = [
      { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
      { name: 'curriculum', label: 'Curriculum', field: 'curriculum', sortable: true },
      { name: 'description', label: 'Description', field: 'description', sortable: true },
      { name: 'actions', label: 'Actions', field: 'actions' }
    ]

    const dialog = ref({ show: false, mode: 'new', id: null })
    const viewDialog = ref({ show: false, item: {} })

    const form = ref({
      title: '',
      curriculumId: null,
      description: ''
    })

    /* LOAD DATA */
    const load = async () => {
      const [levelsRes, curriculaRes] = await Promise.all([
        levelsService.list(),
        curriculumsService.list()
      ])

      levels.value = levelsRes?.data || levelsRes || []
      curricula.value = curriculaRes?.data || curriculaRes || []

      curriculumOptions.value = [
        { label: 'All', value: 'ALL' },
        ...curricula.value.map(c => {
          curriculumMap[String(c.id)] = c.title
          return { label: c.title, value: String(c.id) }
        })
      ]
    }

    onMounted(load)

    /* FILTER */
    const filteredLevels = computed(() => {
      if (!filterCurriculum.value || filterCurriculum.value === 'ALL') {
        return levels.value
      }
      return levels.value.filter(
        l => String(l.curriculumId) === String(filterCurriculum.value)
      )
    })

    /* CRUD */
    function openNew() {
      dialog.value = { show: true, mode: 'new', id: null }
      form.value = { title: '', curriculumId: null, description: '' }
    }

    function editItem(row) {
      dialog.value = { show: true, mode: 'edit', id: row.id }
      form.value = { ...row }
    }

    function closeDialog() {
      dialog.value.show = false
    }

    function viewItem(row) {
      viewDialog.value = { show: true, item: row }
    }

    async function removeItem(row) {
      if (!row.id || !confirm('Delete this level?')) return
      await levelsService.deleteLevel(row.id)
      await load()
    }

    async function save() {
      const payload = { ...form.value }

      if (dialog.value.mode === 'edit') {
        await levelsService.updateLevel(dialog.value.id, payload)
      } else {
        await levelsService.createLevel(payload)
      }

      dialog.value.show = false
      await load()
    }

    return {
      columns,
      curriculumOptions,
      curriculumMap,
      filterCurriculum,
      filteredLevels,
      dialog,
      viewDialog,
      form,
      openNew,
      editItem,
      viewItem,
      removeItem,
      save,
      closeDialog
    }
  }
})
</script>
