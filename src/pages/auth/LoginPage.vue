<template>
  <q-page padding class="row justify-center">

    <q-card class="q-pa-md column q-mt-md" style="max-width: 400px; width: 100%; height: 100%">
      <q-card-section>
        <div class="flex flex-center">
          <img src="/Welcome-amico.png" alt="" style="width: 100px;">
        </div>
        <div class="text-h6 text-center">You're Welcome Back</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <q-input
            outlined
            dense
            v-model="username"
            label="Username [ Phone number or Email ]"
            :rules="[(val) => !!val || 'Username is required']"
            class="q-mb-sm"
          />
          <q-input
            outlined
            dense
            v-model="password"
            label="Password"
            type="password"
            :rules="[(val) => !!val || 'Password is required']"
            class="q-mb-sm"
          />

          <q-btn
            label="Login"
            type="submit"
            color="primary"
            :loading="loading"
            class="full-width"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Don't have an account? Register" @click="goToRegister" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import { useAuthStore } from '../stores/auth'

export default {
  data() {
    return {
      username: '',
      password: '',
      phoneNumber: '',
      email: '',
      loading: false,
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  methods: {
    async submitForm() {
      this.loading = true
      try {
        if (!this.isEmail(this.username)) {
          this.phoneNumber = this.username.trim()
          await this.authStore.login({phoneNumber: this.phoneNumber, password: this.password})
          Notify.create('Login successful..', 'positive')
          this.$router.push('/students/lessons') // redirect after login
        } else {
          this.email = this.username.trim()
          await this.authStore.login({email: this.email, password: this.password})
          Notify.create('Login successful..', 'positive')
          this.$router.push('/quizzes') // redirect after login
        }
      } catch (error) {
        console.error('Login failed:', error)
        Notify.create(error?.message || 'Login failed', 'negative')
      } finally {
        this.loading = false
      }




    },
    goToRegister() {
      this.$router.push('/register')
    },
   isEmail(input) {
  if (!input) return false
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(input.trim())
}

  },
}
</script>
