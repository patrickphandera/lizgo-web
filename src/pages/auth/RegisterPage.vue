<template>
  <q-page padding class="row justify-center">
    <q-card class="q-pa-md column" style="max-width: 400px; width: 100%;">
      <q-card-section>
        <div class="text-h6 text-center">Register</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="form">
          <q-input
            outlined
            dense

            v-model="form.name"
            label="Full Name"
            :rules="[val => !!val || 'Name is required']"
            class="q-mb-sm"
          />
          <q-input
            outlined
            dense
            v-model="form.email"
            label="Email (Optional)"
            type="email"
            class="q-mb-sm"
          />
          <q-input
            outlined
            dense
            v-model="form.phoneNumber"
            label="Phone Number"
            type="tel"

            :rules="[val => !!val || 'Phone number is required']"
            class="q-mb-sm"
          />
          <q-input
            outlined
            dense
            v-model="form.password"
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
            class="q-mb-sm"
          />
          <q-input
            outlined
            dense
            v-model="form.passwordConfirm"
            label="Confirm Password"
            type="password"
            :rules="[val => val === form.password || 'Passwords must match']"
            class="q-mb-sm"
          />

          <q-btn
            label="Register"
            type="submit"
            color="primary"
            :loading="loading"
            class="full-width"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat dense no-caps class="text-none bg-grey-3" label="Already have an account? Login" @click="goToLogin" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import AuthService from 'src/services/auth.service.js'

export default {
  data() {

    const form = ref({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      passwordConfirm: ''
    })
    const loading = ref(false)


    return {
      form,
      loading,
    }
  },
  methods: {
    async submitForm() {
      this.loading = true
      try {
        await AuthService.register(this.form)
        this.$router.push('/login') // redirect to login after successful registration
      } catch (error) {
        console.error('Registration failed:', error)
        alert(error || 'Registration failed')
      } finally {
        this.loading = false
      }
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>
