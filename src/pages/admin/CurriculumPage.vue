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


    const columns = [
      { name: 'title', label: 'Title', field: row => row.title, align: 'left' },
      { name: 'description', label: 'Description', field: 'description' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
    ]

    const dialog = ref({ show: false, mode: 'new', id: null })
    const viewDialog = ref({ show: false, item: {} })

    const form = ref({ title: '', description: '' })

    // function capitalize(s) {
    //   if (!s) return s
    //   return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    // }


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
      return list
    })

    function openNew() {
      dialog.value = { show: true, mode: 'new', id: null }
      form.value = { title: '', description: '' }
    }

    function closeDialog() {
      dialog.value.show = false
    }

    function viewItem(row) {
      viewDialog.value = { show: true, item: row }
    }

    function editItem(row) {
      dialog.value = { show: true, mode: 'edit', id: row.id }
      form.value = { title: row.title || '', description: row.description || '' }
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
      const payload = {
        title: form.value.title,
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
      filteredCurriculums,
      closeDialog
    }
  }
})
</script>
