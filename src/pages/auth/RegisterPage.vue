<template>
  <q-page padding class="row justify-center">
    <q-card class="q-px-md column" style="max-width: 600px; width: 100%">
      <q-card-section>
        <div class="flex flex-center">
          <img src="/login.png" alt="" style="width: 100px" />
        </div>
        <div class="text-h6 text-center">Register Account</div>
      </q-card-section>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-input
              outlined
              dense
              v-model="form.name"
              label="Full Name"
              :rules="[(val) => !!val || 'Name is required']"

            />
          </div>
          <div class="col-12">
            <q-input
              outlined
              dense
              v-model="form.email"
              label="Email (Optional)"
              type="email"
class="q-pb-md"
            />
          </div>
          <div class="col-12">
            <q-input
              outlined
              dense
              v-model="form.phoneNumber"
              label="Phone Number"
              type="tel"
              :rules="[(val) => !!val || 'Phone number is required']"

            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              dense
              v-model="form.password"
              label="Password"
              class="q-pr-md"
              type="password"
              :rules="[(val) => !!val || 'Password is required']"

            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              dense
              v-model="form.passwordConfirm"
              label="Confirm Password"
              type="password"
              :rules="[(val) => val === form.password || 'Passwords must match']"

            />
          </div>
          <div class="col-12">
            <q-btn
              label="Register"
              type="submit"
              color="primary"
              :loading="loading"
              class="full-width"
              @click="submitForm()"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn
          flat
          dense
          no-caps
          class="text-none bg-grey-1"
          label="Already have an account? Login"
          @click="goToLogin"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import AuthService from 'src/services/auth.service.js'
import { Notify } from 'quasar'

export default {
  data() {
    const form = ref({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      passwordConfirm: '',
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

      if (this.form.name.split(' ') <= 1) {
        Notify.create('negative', 'Full name should have both first name and last name')
      } else {
        try {
          await AuthService.register(this.form)
          this.$router.push('/login') // redirect to login after successful registration
        } catch (error) {
          console.error('Registration failed:', error)
          alert(error || 'Registration failed')
        } finally {
          this.loading = false
        }
      }
    },
    goToLogin() {
      this.$router.push('/login')
    },
  },
}
</script>
