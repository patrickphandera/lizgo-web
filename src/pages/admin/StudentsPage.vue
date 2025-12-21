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
        <q-select v-model="filterCountry" :options="countryOptions" option-label="label" option-value="value"
          label="Filter by country" dense outlined clearable />
        <q-table :rows="filteredCurriculums" :columns="columns" row-key="id" class="q-mt-md">
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
              <q-select v-model="form.country_code" :options="countryOptions" option-label="label" option-value="value"
                class="width-full" label="Country" dense outlined />
            </div>
            <div class="col-12">
              <q-input v-model="form.country" label="Country (override)" dense outlined />
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
          <div><strong>Code:</strong> {{ viewDialog.item.country_code }}</div>
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
import { defineComponent, ref, computed, onMounted } from 'vue'
import curriculumsService from 'src/services/curriculums.service.js'

export default defineComponent({
  name: 'CurriculumAdminPage',
  setup() {
    const curriculums = ref([])
    const filterCountry = ref(null)

    const countryOptions = [
      { label: 'All', value: 'ALL' },
      { label: 'Malawi', value: 'MW' },
      { label: 'Zambia', value: 'ZM' },
      { label: 'Zimbabwe', value: 'ZW' },
      { label: 'Tanzania', value: 'TZ' }
    ]

    const columns = [
      { name: 'title', label: 'Title', field: row => row.title, align: 'left' },
      { name: 'country', label: 'Country', field: 'country' },
      { name: 'country_code', label: 'Code', field: 'country_code' },
      { name: 'description', label: 'Description', field: 'description' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
    ]

    const dialog = ref({ show: false, mode: 'new', id: null })
    const viewDialog = ref({ show: false, item: {} })

    const form = ref({ title: '', country: '', country_code: '', description: '' })

    function capitalize(s) {
      if (!s) return s
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    }

    const countryMap = {
      ALL: 'All',
      MW: 'Malawi',
      ZM: 'Zambia',
      ZW: 'Zimbabwe',
      TZ: 'Tanzania'
    }

    const load = async () => {
      try {
        const res = await curriculumsService.list()
        console.log('Curriculums loaded:', res)
        if (Array.isArray(res)) {
          curriculums.value = res
        } else if (res && Array.isArray(res.data)) {
          curriculums.value = res.data
        } else if (res && Array.isArray(res.items)) {
          curriculums.value = res.items
        } else {
          curriculums.value = []
        }
      } catch (err) {
        console.error('Failed to load curriculums', err)
        curriculums.value = []
      }
    }

    onMounted(load)

    const filteredCurriculums = computed(() => {
      const list = Array.isArray(curriculums.value) ? curriculums.value : []
      if (!filterCountry.value || filterCountry.value === 'ALL') return list
      const code = (filterCountry.value || '').toUpperCase()
      return list.filter(c => ((c && c.country_code) || '').toUpperCase() === code)
    })

    function openNew() {
      dialog.value = { show: true, mode: 'new', id: null }
      form.value = { title: '', country: '', country_code: '', description: '' }
    }

    function closeDialog() {
      dialog.value.show = false
    }

    function viewItem(row) {
      viewDialog.value = { show: true, item: row }
    }

    function editItem(row) {
      dialog.value = { show: true, mode: 'edit', id: row.id }
      form.value = { title: row.title || '', country: row.country || countryMap[(row.country_code || '').toUpperCase()] || '', country_code: (row.country_code || '').toUpperCase(), description: row.description || '' }
    }

    async function removeItem(row) {
      const id = row.id
      if (!id) return
      if (!confirm('Delete this curriculum?')) return
      try {
        await curriculumsService.deleteCurriculum(id)
        await load()
      } catch (err) {
        console.error('Failed to delete', err)
      }
    }

    async function save() {
      // Ensure country code uppercase and country capitalized
      const payload = {
        title: form.value.title,
        country_code: (form.value.country_code || '').toUpperCase(),
        country: form.value.country ? capitalize(form.value.country) : (countryMap[(form.value.country_code || '').toUpperCase()] || ''),
        description: form.value.description
      }

      try {
        if (dialog.value.mode === 'edit' && dialog.value.id) {
          await curriculumsService.updateCurriculum(dialog.value.id, payload)
        } else {
          await curriculumsService.createCurriculum(payload)
        }
        dialog.value.show = false
        await load()
      } catch (err) {
        console.error('Failed to save curriculum', err)
      }
    }

    return {
      curriculums,
      columns,
      dialog,
      form,
      openNew,
      save,
      editItem,
      removeItem,
      viewItem,
      viewDialog,
      countryOptions,
      filterCountry,
      filteredCurriculums,
      closeDialog
    }
  }
})
</script>
