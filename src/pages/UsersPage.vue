<template>
  <q-page class="q-px-sm">
    <!-- Header & Controls -->
    <div class="row justify-between q-px-lg q-mt-sm items-center">
      <div class="column">
        <div class="text-weight-bold text-h6">Users</div>
        <div>Manage platform users and their roles.</div>
      </div>
      <div class="row q-gutter-md items-center">
        <!-- Role Filter -->
        <q-select
          dense
          outlined
          v-model="selectedRole"
          :options="roleOptions"
          label="Role"
          style="width: 140px"

        />

        <!-- Status Filter -->
        <q-select
          dense
          outlined
          v-model="selectedStatus"
          :options="statusOptions"
          label="Status"
          style="width: 120px"

        />

        <q-btn
          :disable="loading"
          class="text-capitalize"
          color="primary"
          @click="openCreateModal"
          icon="add"
          label="New User"
        />
      </div>
    </div>

    <!-- Search -->
    <div class="q-px-lg q-mt-md">
      <q-input
        class="thick-border"
        dense
        color="primary"
        outlined
        v-model="searchText"
        label="Search Users"
        style="width: 100%"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="row q-col-gutter-md q-mx-md q-mt-lg">
      <div v-for="i in 6" :key="'skeleton-' + i" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="q-pa-md">
          <q-skeleton type="rect" height="160px" />
        </q-card>
      </div>
    </div>

    <!-- No Results -->
    <div
      v-else-if="filteredUsers.length === 0"
      class="text-center q-mt-xl text-grey-7 q-px-lg"
    >
      No users match your filters.
    </div>

    <!-- User Cards -->
    <div v-else class="row q-col-gutter-md q-mx-sm q-mt-xs">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="user-card">
          <q-card-section>
            <div class="text-h6 q-mb-xs">
              {{ user.firstName }} {{ user.middleName }} {{ user.lastName }}
            </div>
            <div class="text-body2 text-grey-8 q-mb-sm">
             <q-chip dense v-for="role in user.roles" v-bind:key="role"> {{ role }}</q-chip>


            </div>
            <div class="row items-center justify-between ">
              <div class="row ">
              <q-badge
                :color="user.status === 'active' ? 'green' : 'grey'"
                :text-color="user.status === 'active' ? 'white' : 'dark'"
              >
                {{ user.status }}
              </q-badge>
              <div class="text-caption text-grey-6">
                Joined: {{ formatDate(user.createdAt) }}
              </div>
              </div>
              <div>
                <q-btn flat dense icon="mdi-chevron-down"></q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Create User Modal -->
    <q-dialog v-model="showCreateModal" persistent>
      <q-card style="min-width: 400px; width: 500px">
        <q-card-section>
          <div class="text-h6">Create New User</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="createUser" ref="createFormRef">
            <div class="row q-col-gutter-sm">
              <q-input
                dense
                outlined
                v-model="newUser.firstName"
                label="First Name *"
                class="col"
                lazy-rules
                :rules="[val => !!val || 'First name is required']"
              />
              <q-input
                dense
                outlined
                v-model="newUser.middleName"
                label="Middle Name"
                class="col"
              />
            </div>

            <q-input
              dense
              outlined
              v-model="newUser.lastName"
              label="Last Name *"
              class="q-mt-sm"
              lazy-rules
              :rules="[val => !!val || 'Last name is required']"
            />

            <q-select
              dense
              outlined
              v-model="newUser.roles"
              :options="availableRoles"
              label="Roles *"
              multiple
              emit-value
              map-options
              class="q-mt-sm"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'At least one role required']"
            />

            <q-select
              dense
              outlined
              v-model="newUser.status"
              :options="statusOptions"
              label="Status *"
              class="q-mt-sm"
              lazy-rules
              :rules="[val => !!val || 'Status is required']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pr-md">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Create"
            color="primary"
            @click="createUser"
            :loading="creating"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { date } from 'quasar'
import UsersService from 'src/services/users.service.js'

// === FILTERS ===
const selectedRole = ref(null)
const selectedStatus = ref(null)
const searchText = ref('')

// === DATA ===
const users = ref([])
const loading = ref(true)

// === MODAL ===
const showCreateModal = ref(false)
const newUser = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  roles: [],
  status: 'active'
})
const creating = ref(false)
const createFormRef = ref(null)

// === OPTIONS ===
const roleOptions = ['admin', 'teacher', 'user', 'moderator'] // Adjust based on your system
const availableRoles = roleOptions.map(role => ({ label: role, value: role }))
const statusOptions = ['active', 'inactive', 'suspended']

// === COMPUTED: Filtered users ===
const filteredUsers = computed(() => {
  let list = users.value

  // Filter by role
  if (selectedRole.value) {
    list = list.filter(user =>
      user.roles && user.roles.includes(selectedRole.value)
    )
  }

  // Filter by status
  if (selectedStatus.value) {
    list = list.filter(user => user.status === selectedStatus.value)
  }

  // Search by name
  if (searchText.value.trim()) {
    const term = searchText.value.toLowerCase().trim()
    list = list.filter(user =>
      (user.firstName && user.firstName.toLowerCase().includes(term)) ||
      (user.middleName && user.middleName.toLowerCase().includes(term)) ||
      (user.lastName && user.lastName.toLowerCase().includes(term))
    )
  }

  return list
})

// === METHODS ===
function formatDate(iso) {
  return date.formatDate(iso, 'DD MMM YYYY')
}

function openCreateModal() {
  showCreateModal.value = true
}

async function createUser() {
  const $q = useQuasar()
  const valid = await createFormRef.value?.validate()
  if (!valid) return

  creating.value = true
  try {
    const payload = {
      firstName: newUser.value.firstName.trim(),
      middleName: newUser.value.middleName?.trim() || '',
      lastName: newUser.value.lastName.trim(),
      roles: newUser.value.roles,
      status: newUser.value.status
    }

    const created = await UsersService.createUser(payload)
    users.value.push(created)

    $q.notify({ color: 'positive', message: 'User created successfully!' })
    showCreateModal.value = false
  } catch (error) {
    console.error('Create user error:', error)
    $q.notify({ color: 'negative', message: 'Failed to create user.' })
  } finally {
    creating.value = false
  }
}

// === WATCHERS ===
watch(showCreateModal, (isOpen) => {
  if (!isOpen) {
    newUser.value = {
      firstName: '',
      middleName: '',
      lastName: '',
      roles: [],
      status: 'active'
    }
    creating.value = false
    createFormRef.value?.resetValidation()
  }
})

// === INIT ===
onMounted(async () => {
  loading.value = true
  try {
    const data = await UsersService.list()
    users.value = data.map(item => ({
      ...item,
      id: item.id || item._id
    }))
  } catch (error) {
    console.error('Failed to load users:', error)
    useQuasar().notify({ color: 'negative', message: 'Failed to load users.' })
  } finally {
    loading.value = false
  }
})
</script>
