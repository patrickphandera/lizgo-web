<template>
  <q-page class="q-px-md q-mt-md q-mb-md">
    <div class="text-h6 row justify-between items-center">
      Curriculums
      <div>
        <q-btn color="primary" class="text-capitalize" @click="openNew">+ New Curriculum</q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col-12">
        <q-select v-model="filterCountry" :options="filterCountryOptions" option-label="label" option-value="country"
          label="Filter by country" dense outlined clearable emit-value map-options />

        <q-table :rows="filteredCurriculums" :columns="columns" row-key="_id" class="q-mt-md">
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
          <div class="text-h6">{{ dialog.mode === 'edit' ? 'Edit' : 'New' }} Curriculum</div>
          <q-btn flat icon="close" v-close-popup @click="closeDialog" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="row q-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-input v-model="form.title" label="Title" dense outlined />
            </div>
            <div class="col-12">
              <q-select v-model="selectedCountry" :options="countryOptions" option-label="label" option-value="value"
                class="width-full" label="Country" dense outlined emit-value map-options />
            </div>
            <div class="col-12">
              <q-input v-model="form.description" type="textarea" label="Description" dense outlined />
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
          <div class="text-h6">View Curriculum</div>
          <q-btn flat icon="close" v-close-popup @click="viewDialog.show = false" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div><strong>Title:</strong> {{ viewDialog.item.title }}</div>
          <div><strong>Country:</strong> {{ viewDialog.item.country }}</div>
          <div><strong>Country Code:</strong> {{ viewDialog.item.country_code }}</div>
          <div class="q-mt-sm"><strong>Description:</strong>
            <div>{{ viewDialog.item.description }}</div>
          </div>
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
import curriculumsService from 'src/services/curriculums.service.js'

export default {
  name: 'CurriculumAdminPage',
  data() {
    return {
      curriculums: [],
      filterCountry: null,
      selectedCountry: null,
      countryOptions: [
        { label: 'Malawi', value: 'MW', country: 'Malawi' },
        { label: 'Zambia', value: 'ZM', country: 'Zambia' },
        { label: 'Tanzania', value: 'TZ', country: 'Tanzania' },
        { label: 'Kenya', value: 'KE', country: 'Kenya' }
      ],
      filterCountryOptions: [
        { label: 'All', value: 'ALL' }
      ],
      columns: [
        { name: 'title', label: 'Title', field: row => row.title, align: 'left' },
        { name: 'country', label: 'Country', field: 'country' },
        { name: 'country_code', label: 'Code', field: 'country_code' },
        { name: 'description', label: 'Description', field: 'description' },
        { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
      ],
      dialog: { show: false, mode: 'new', id: null },
      viewDialog: { show: false, item: {} },
      form: { title: '', description: '', country_code: '', country: '' }
    }
  },
  computed: {
    filteredCurriculums() {
      const list = Array.isArray(this.curriculums) ? this.curriculums : []
      if (!this.filterCountry || this.filterCountry === 'ALL') return list
      return list.filter(c => c.country === this.filterCountry)
    }
  },
  watch: {
    selectedCountry(newVal) {
      if (newVal) {
        const selectedOption = this.countryOptions.find(opt => opt.value === newVal)
        if (selectedOption) {
          this.form.country_code = selectedOption.value
          this.form.country = selectedOption.country
        }
      } else {
        this.form.country_code = ''
        this.form.country = ''
      }
    }
  },
  created() {
    this.filterCountryOptions = [
      { label: 'All', value: 'ALL', country: 'ALL' },
      ...this.countryOptions
    ]
    this.load()
  },
  methods: {
    async load() {
      try {
        const res = await curriculumsService.list()
        console.log('Curriculums loaded:', res)
        if (res && Array.isArray(res.data)) {
          this.curriculums = res.data
        } else if (res && Array.isArray(res.items)) {
          this.curriculums = res.items
        } else if (Array.isArray(res)) {
          this.curriculums = res
        } else {
          this.curriculums = []
        }
      } catch (err) {
        console.error('Failed to load curriculums', err)
        this.curriculums = []
      }
    },
    openNew() {
      this.dialog = { show: true, mode: 'new', id: null }
      this.selectedCountry = null
      this.form = { title: '', description: '', country_code: '', country: '' }
    },
    closeDialog() {
      this.dialog.show = false
    },
    viewItem(row) {
      this.viewDialog = { show: true, item: row }
    },
    editItem(row) {
      this.dialog = { show: true, mode: 'edit', id: row._id }
      this.selectedCountry = row.country_code || null
      this.form = {
        title: row.title || '',
        description: row.description || '',
        country_code: row.country_code || '',
        country: row.country || ''
      }
    },
    async removeItem(row) {
      const id = row._id
      if (!id) return
      if (!confirm('Delete this curriculum?')) return
      try {
        await curriculumsService.deleteCurriculum(id)
        await this.load()
      } catch (err) {
        console.error('Failed to delete', err)
      }
    },
    async save() {
      const payload = {
        title: this.form.title,
        description: this.form.description,
        country_code: this.form.country_code,
        country: this.form.country
      }

      try {
        if (this.dialog.mode === 'edit' && this.dialog.id) {
          await curriculumsService.updateCurriculum(this.dialog.id, payload)
        } else {
          await curriculumsService.createCurriculum(payload)
        }
        this.dialog.show = false
        await this.load()
      } catch (err) {
        console.error('Failed to save curriculum', err)
      }
    }
  }
}
</script>
