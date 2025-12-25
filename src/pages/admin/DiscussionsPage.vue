<template>
  <q-page class="q-pa-md">
    <div class="text-h6 row justify-between items-center">
      Discussions
      <div>
        <q-btn color="primary" class="text-capitalize" @click="openNew">+ New Discussion</q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col-12">
        <q-select v-model="filterCategory" :options="categoryOptions" option-label="label" option-value="value"
          label="Filter by category" dense outlined clearable />
        <q-table :rows="filteredDiscussions" :columns="columns" row-key="id" class="q-mt-md">
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
          <div class="text-h6">{{ dialog.mode === 'edit' ? 'Edit' : 'New' }} Discussion</div>
          <q-btn flat icon="close" v-close-popup @click="closeDialog" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="row q-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-input v-model="form.title" label="Title" dense outlined />
            </div>
            <div class="col-12">
              <q-input v-model="form.content" type="textarea" label="Content" dense outlined />
            </div>
            <div class="col-12">
              <q-select v-model="form.category" :options="categoryOptions" option-label="label" option-value="value"
                label="Category" dense outlined />
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
          <div class="text-h6">View Discussion</div>
          <q-btn flat icon="close" v-close-popup @click="viewDialog.show = false" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div><strong>Title:</strong> {{ viewDialog.item.title }}</div>
          <div><strong>Category:</strong> {{ viewDialog.item.category }}</div>
          <div class="q-mt-sm"><strong>Content:</strong>
            <div>{{ viewDialog.item.content }}</div>
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
import discussionsService from 'src/services/discussions.service.js'

export default defineComponent({
  name: 'DiscussionsAdminPage',
  setup() {
    const discussions = ref([])
    const filterCategory = ref(null)

    const categoryOptions = [
      { label: 'All', value: 'ALL' },
      { label: 'Question', value: 'question' },
      { label: 'Discussion', value: 'discussion' },
      { label: 'Announcement', value: 'announcement' },
      { label: 'Help', value: 'help' },
      { label: 'General', value: 'general' }
    ]

    const columns = [
      { name: 'title', label: 'Title', field: row => row.title, align: 'left' },
      { name: 'category', label: 'Category', field: 'category' },
      { name: 'replyCount', label: 'Replies', field: 'replyCount' },
      { name: 'views', label: 'Views', field: 'views' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
    ]

    const dialog = ref({ show: false, mode: 'new', id: null })
    const viewDialog = ref({ show: false, item: {} })

    const form = ref({ title: '', content: '', category: 'discussion' })

    const load = async () => {
      try {
        const res = await discussionsService.list()
        console.log('Discussions loaded:', res)
        if (Array.isArray(res)) {
          discussions.value = res
        } else if (res && Array.isArray(res.data)) {
          discussions.value = res.data
        } else if (res && Array.isArray(res.items)) {
          discussions.value = res.items
        } else {
          discussions.value = []
        }
      } catch (err) {
        console.error('Failed to load discussions', err)
        discussions.value = []
      }
    }

    onMounted(load)

    const filteredDiscussions = computed(() => {
      const list = Array.isArray(discussions.value) ? discussions.value : []
      if (!filterCategory.value || filterCategory.value === 'ALL') return list
      return list.filter(d => d.category === filterCategory.value)
    })

    function openNew() {
      dialog.value = { show: true, mode: 'new', id: null }
      form.value = { title: '', content: '', category: 'discussion' }
    }

    function closeDialog() {
      dialog.value.show = false
    }

    function viewItem(row) {
      viewDialog.value = { show: true, item: row }
    }

    function editItem(row) {
      dialog.value = { show: true, mode: 'edit', id: row.id }
      form.value = { title: row.title || '', content: row.content || '', category: row.category || 'discussion' }
    }

    async function removeItem(row) {
      const id = row.id
      if (!id) return
      if (!confirm('Delete this discussion?')) return
      try {
        await discussionsService.delete(id)
        await load()
      } catch (err) {
        console.error('Failed to delete', err)
      }
    }

    async function save() {
      try {
        if (dialog.value.mode === 'edit' && dialog.value.id) {
          await discussionsService.update(dialog.value.id, form.value)
        } else {
          await discussionsService.create(form.value)
        }
        dialog.value.show = false
        await load()
      } catch (err) {
        console.error('Failed to save discussion', err)
      }
    }

    return {
      discussions,
      columns,
      dialog,
      form,
      openNew,
      save,
      editItem,
      removeItem,
      viewItem,
      viewDialog,
      categoryOptions,
      filterCategory,
      filteredDiscussions,
      closeDialog
    }
  }
})
</script>
