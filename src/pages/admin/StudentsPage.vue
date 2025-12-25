<template>
  <q-page class="q-px-md q-mt-md q-mb-md">
    <div class="text-h6 row justify-between items-center">
      Students
      <div>
        <q-btn color="primary" class="text-capitalize" @click="openNew">+ New Student</q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col-12">
        <q-select v-model="filterRole" :options="roleOptions" option-label="label" option-value="value"
          label="Filter by role" dense outlined clearable />
        <q-table :rows="filteredUsers" :columns="columns" row-key="id" class="q-mt-md">
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
          <div class="text-h6">{{ dialog.mode === 'edit' ? 'Edit' : 'New' }} Student</div>
          <q-btn flat icon="close" v-close-popup @click="closeDialog" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="row q-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-input v-model="form.name" label="Name" dense outlined />
            </div>
            <div class="col-12">
              <q-input v-model="form.email" label="Email" dense outlined />
            </div>
            <div class="col-12" v-if="dialog.mode === 'new'">
              <q-input v-model="form.password" type="password" label="Password" dense outlined />
            </div>
            <div class="col-12">
              <q-select v-model="form.role" :options="roleOptions" option-label="label" option-value="value"
                label="Role" dense outlined />
            </div>
            <div class="col-12">
              <q-input v-model="form.bio" type="textarea" label="Bio" dense outlined />
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
          <div class="text-h6">View Student</div>
          <q-btn flat icon="close" v-close-popup @click="viewDialog.show = false" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div><strong>Name:</strong> {{ viewDialog.item.name }}</div>
          <div><strong>Email:</strong> {{ viewDialog.item.email }}</div>
          <div><strong>Role:</strong> {{ viewDialog.item.role }}</div>
          <div class="q-mt-sm"><strong>Bio:</strong>
            <div>{{ viewDialog.item.bio }}</div>
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
import usersService from 'src/services/users.service.js'

export default defineComponent({
  name: 'StudentsAdminPage',
  setup() {
    const users = ref([])
    const filterRole = ref(null)

    const roleOptions = [
      { label: 'All', value: 'ALL' },
      { label: 'Student', value: 'student' },
      { label: 'Teacher', value: 'teacher' },
      { label: 'Admin', value: 'admin' }
    ]

    const columns = [
      { name: 'name', label: 'Name', field: row => row.name, align: 'left' },
      { name: 'email', label: 'Email', field: 'email' },
      { name: 'role', label: 'Role', field: 'role' },
      { name: 'isActive', label: 'Active', field: 'isActive' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
    ]

    const dialog = ref({ show: false, mode: 'new', id: null })
    const viewDialog = ref({ show: false, item: {} })

    const form = ref({ name: '', email: '', password: '', role: 'student', bio: '' })

    const load = async () => {
      try {
        const res = await usersService.list()
        console.log('Users loaded:', res)
        if (Array.isArray(res)) {
          users.value = res
        } else if (res && Array.isArray(res.data)) {
          users.value = res.data
        } else if (res && Array.isArray(res.items)) {
          users.value = res.items
        } else {
          users.value = []
        }
      } catch (err) {
        console.error('Failed to load users', err)
        users.value = []
      }
    }

    onMounted(load)

    const filteredUsers = computed(() => {
      const list = Array.isArray(users.value) ? users.value : []
      if (!filterRole.value || filterRole.value === 'ALL') return list
      return list.filter(u => u.role === filterRole.value)
    })

    function openNew() {
      dialog.value = { show: true, mode: 'new', id: null }
      form.value = { name: '', email: '', password: '', role: 'student', bio: '' }
    }

    function closeDialog() {
      dialog.value.show = false
    }

    function viewItem(row) {
      viewDialog.value = { show: true, item: row }
    }

    function editItem(row) {
      dialog.value = { show: true, mode: 'edit', id: row.id }
      form.value = { name: row.name || '', email: row.email || '', role: row.role || 'student', bio: row.bio || '' }
    }

    async function removeItem(row) {
      const id = row.id
      if (!id) return
      if (!confirm('Delete this user?')) return
      try {
        await usersService.delete(id)
        await load()
      } catch (err) {
        console.error('Failed to delete', err)
      }
    }

    async function save() {
      const payload = { ...form.value }
      if (dialog.value.mode === 'edit') {
        delete payload.password // Don't update password in edit
      }

      try {
        if (dialog.value.mode === 'edit' && dialog.value.id) {
          await usersService.update(dialog.value.id, payload)
        } else {
          await usersService.create(payload)
        }
        dialog.value.show = false
        await load()
      } catch (err) {
        console.error('Failed to save user', err)
      }
    }

    return {
      users,
      columns,
      dialog,
      form,
      openNew,
      save,
      editItem,
      removeItem,
      viewItem,
      viewDialog,
      roleOptions,
      filterRole,
      filteredUsers,
      closeDialog
    }
  }
})
</script>
