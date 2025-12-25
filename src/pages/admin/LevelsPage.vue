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

        <q-table
  class="q-mt-md"
  :rows="filteredLevels"
  :columns="columns"
  row-key="_id"
>
        <template v-slot:body-cell-curriculum="props">
  <q-td>
    {{ curriculumMap[props.row.curriculumId] || '-' }}
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
import levelsService from 'src/services/levels.service'
import curriculumsService from 'src/services/curriculums.service'

export default {
  name: 'LevelAdminPage',

  data () {
    return {
      levels: [],
      curricula: [],
      filterCurriculum: null,

      curriculumOptions: [],
      curriculumMap: {},

      columns: [
        { name: 'title', label: 'Title', field: 'title', sortable: true },
        { name: 'curriculum', label: 'Curriculum', field: 'curriculumId' },
        { name: 'description', label: 'Description', field: 'description' },
        { name: 'actions', label: 'Actions' }
      ],

      dialog: {
        show: false,
        mode: 'new',
        id: null
      },

      viewDialog: {
        show: false,
        item: {}
      },

      form: {
        title: '',
        curriculumId: null,
        description: ''
      }
    }
  },

  created () {
    this.load()
  },

  computed: {
    filteredLevels () {
      if (!this.filterCurriculum || this.filterCurriculum === 'ALL') {
        return this.levels
      }

      return this.levels.filter(
        l => String(l.curriculumId) === String(this.filterCurriculum)
      )
    }
  },

  methods: {
    async load () {
      const [levelsRes, curriculaRes] = await Promise.all([
        levelsService.list(),
        curriculumsService.list()
      ])

      this.levels = levelsRes
      this.curricula = curriculaRes

      this.curriculumMap = {}
      this.curriculumOptions = [
        { label: 'All', value: 'ALL' },
        ...this.curricula.map(c => {
          this.curriculumMap[c._id] = c.title
          return { label: c.title, value: c._id }
        })
      ]
    },

    openNew () {
      this.dialog = { show: true, mode: 'new', id: null }
      this.form = {
        title: '',
        curriculumId: null,
        description: ''
      }
    },

    editItem (row) {
      this.dialog = { show: true, mode: 'edit', id: row._id }
      this.form = {
        title: row.title,
        curriculumId: row.curriculumId,
        description: row.description
      }
    },

    closeDialog () {
      this.dialog.show = false
    },

    viewItem (row) {
      this.viewDialog = { show: true, item: row }
    },

    async removeItem (row) {
      if (!row._id || !confirm('Delete this level?')) return
      await levelsService.deleteLevel(row._id)
      await this.load()
    },

    async save () {
      const payload = { ...this.form }

      if (this.dialog.mode === 'edit') {
        await levelsService.updateLevel(this.dialog.id, payload)
      } else {
        payload.curriculumId=payload.curriculumId.value
        await levelsService.createLevel(payload)
      }

      this.dialog.show = false
      await this.load()
    }
  }
}
</script>
