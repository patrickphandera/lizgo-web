<template>
  <q-page class="q-px-md q-mt-md q-mb-md">
    <div class="text-h6 row justify-between items-center">
      Topics
      <q-btn color="primary" class="text-capitalize" @click="openNew">
        + New Topic
      </q-btn>
    </div>
    <div class="row q-mt-md">
      <div class="col-12">
        <q-table flat bordered :rows="topics" :columns="columns" row-key="id" class="q-mt-md">
          <template v-slot:body-cell-subject="props">
            <q-td align="right">
              {{
                props.row.subjectId.label }}
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td align="right">
              <q-btn dense flat icon="visibility" @click="viewItem(props.row)" />
              <q-btn dense flat icon="edit" @click="editItem(props.row)" />
              <q-btn dense flat icon="delete" color="negative" @click="removeItem(props.row)" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Create / Edit -->
    <q-dialog v-model="dialog.show">
      <q-card style="min-width: 400px; max-width: 700px">
        <q-card-section class="row justify-between">
          <div class="text-h6">{{ dialog.mode === 'edit' ? 'Edit' : 'New' }} Topic</div>
          <q-btn flat icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-input v-model="form.title" label="Title" dense outlined />
            </div>

            <div class="col-12">
              <q-select v-model="form.subjectId" :options="subjectOptions" option-label="label" option-value="value"
                label="Subject" dense outlined />
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

    <!-- View -->
    <q-dialog v-model="viewDialog.show">
      <q-card style="min-width: 300px">
        <q-card-section class="row justify-between">
          <div class="text-h6">View Topic</div>
          <q-btn flat icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div><strong>Title:</strong> {{ viewDialog.item.title }}</div>
          <div><strong>Subject:</strong> {{ subjectMap[viewDialog.item.subjectId] }}</div>
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
import { defineComponent, ref, onMounted } from 'vue'
import topicsService from 'src/services/topics.service'
import subjectsService from 'src/services/subjects.service'

export default defineComponent({
  name: 'TopicAdminPage',
  setup() {
    const topics = ref([])

    const subjectOptions = ref([])

    const subjectMap = {}

    const columns = [
      { name: 'title', label: 'Title', field: row => row.title, align: 'left' },
      { name: 'subject', label: 'Subject', field: row => subjectMap[row.subjectId] || row.subjectId },
      { name: 'description', label: 'Description', field: 'description' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
    ]

    const dialog = ref({ show: false, mode: 'new', id: null })
    const viewDialog = ref({ show: false, item: {} })

    const form = ref({
      title: '',
      subjectId: '',
      description: ''
    })

    const load = async () => {
      try {
        const [topicsRes, subjectsRes] = await Promise.all([
          topicsService.list(),
          subjectsService.list()
        ])

        topics.value = topicsRes?.data ?? topicsRes ?? []

        subjectOptions.value = (subjectsRes?.data ?? subjectsRes ?? []).map(l => {
          subjectMap[l.id] = l.title
          return { label: l.title, value: l.id }
        })

      } catch (err) {
        console.error('Load failed', err)
      }
    }

    onMounted(load)


    function openNew() {
      dialog.value = { show: true, mode: 'new', id: null }
      form.value = { title: '', subjectId: '', description: '' }
    }

    function editItem(row) {
      dialog.value = { show: true, mode: 'edit', id: row.id }
      form.value = {
        title: row.title,
        subjectId: row.subjectId,
        description: row.description
      }
    }

    function viewItem(row) {
      viewDialog.value = { show: true, item: row }
    }

    async function removeItem(row) {
      if (!row.id || !confirm('Delete this topic?')) return
      await topicsService.deleteTopic(row.id)
      await load()
    }

    async function save() {
      if (dialog.value.mode === 'edit') {
        await topicsService.updateTopic(dialog.value.id, form.value)
      } else {
        await topicsService.createTopic(form.value)
      }

      dialog.value.show = false
      await load()
    }

    return {
      topics,
      columns,
      dialog,
      viewDialog,
      form,
      openNew,
      save,
      editItem,
      removeItem,
      viewItem,
      subjectOptions,
      subjectMap,
    }
  }
})
</script>
